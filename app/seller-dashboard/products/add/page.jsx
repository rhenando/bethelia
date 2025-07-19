"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

// Helper to make file names safe for Firebase Storage
const safeFileName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]/gi, "_") // allow only a-z, 0-9, dot (for extension)
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

export default function AddProduct({ onBack }) {
  const router = useRouter();
  const authUser = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    tags: [],
    status: "active",
    shippingClass: "",
    images: [],
    weight: "",
    length: "",
    width: "",
    height: "",
    priceTiers: [{ minQty: 1, price: "" }],
    stock: "",
    sku: "",
    barcode: "",
  });

  const [mainImages, setMainImages] = useState([]);
  const [mainPreviews, setMainPreviews] = useState([]);
  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from Firestore on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const q = query(collection(db, "categories"), orderBy("order"));
        const snap = await getDocs(q);
        setCategoryOptions(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (err) {
        setCategoryOptions([]);
        toast.error("Failed to load categories");
      }
      setLoadingCategories(false);
    }
    fetchCategories();
  }, []);

  const shippingClassOptions = [
    "Standard",
    "Fragile",
    "Bulky",
    "Liquid",
    "Other",
  ];

  const onMainDrop = (acceptedFiles) => {
    const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setMainImages((prev) => [...prev, ...acceptedFiles]);
    setMainPreviews((prev) => [...prev, ...previews]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: onMainDrop,
    multiple: true,
    maxFiles: 8,
  });

  const handleVariantImage = (idx, file) => {
    const preview = file ? URL.createObjectURL(file) : null;
    setVariants((prev) =>
      prev.map((v, i) =>
        i === idx ? { ...v, image: file, imagePreview: preview } : v
      )
    );
  };

  const handleVariantChange = (idx, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  };

  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      {
        sku: "",
        barcode: "",
        option1: "",
        option2: "",
        price: "",
        stock: "",
        image: null,
        imagePreview: null,
        weight: "",
        length: "",
        width: "",
        height: "",
      },
    ]);
  const removeVariant = (idx) =>
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  const handleRemoveMainImage = (idx) => {
    setMainImages((prev) => prev.filter((_, i) => i !== idx));
    setMainPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---- HANDLE SUBMIT ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      toast.error("Product name and category required.");
      return;
    }
    if (!authUser?.uid) {
      toast.error("Login as seller to add products.");
      return;
    }
    if (mainImages.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }
    setSaving(true);

    try {
      // --- Upload main images ---
      const mainImageUrls = [];
      for (let i = 0; i < mainImages.length; ++i) {
        const file = mainImages[i];
        const refPath = `products/${
          authUser.uid
        }/main_${Date.now()}_${i}_${safeFileName(file.name)}`;
        const storageRef = ref(storage, refPath);
        const snap = await uploadBytesResumable(storageRef, file);
        const url = await getDownloadURL(snap.ref);
        mainImageUrls.push(url);
      }

      // --- Upload variant images (if any) ---
      const variantsWithUrls = await Promise.all(
        variants.map(async (variant, idx) => {
          let imageUrl = "";
          if (variant.image) {
            const refPath = `products/${
              authUser.uid
            }/variant_${Date.now()}_${idx}_${safeFileName(variant.image.name)}`;
            const storageRef = ref(storage, refPath);
            const snap = await uploadBytesResumable(storageRef, variant.image);
            imageUrl = await getDownloadURL(snap.ref);
          }
          return {
            ...variant,
            price: Number(variant.price || 0),
            stock: Number(variant.stock || 0),
            weight: Number(variant.weight || form.weight || 0),
            length: Number(variant.length || form.length || 0),
            width: Number(variant.width || form.width || 0),
            height: Number(variant.height || form.height || 0),
            image: imageUrl,
          };
        })
      );

      const priceTiers =
        Array.isArray(form.priceTiers) && form.priceTiers.length > 0
          ? form.priceTiers
              .filter((t) => t && t.price !== "" && t.minQty !== "")
              .map((t) => ({
                minQty: t.minQty !== "" ? Number(t.minQty) : 1,
                price: t.price !== "" ? Number(t.price) : 0,
              }))
          : [];

      // --- Firestore save ---
      await addDoc(collection(db, "products"), {
        ...form,
        category: form.category,
        tags: form.tags,
        price:
          form.priceTiers[0]?.price !== ""
            ? Number(form.priceTiers[0]?.price)
            : 0,
        priceTiers,
        stock: form.stock !== "" ? Number(form.stock) : 0,
        images: mainImageUrls,
        mainImage: mainImageUrls[0],
        variants: variantsWithUrls,
        sellerId: authUser.uid,
        createdAt: serverTimestamp(),
        status: form.status,
        sku: form.sku || "",
        barcode: form.barcode || "",
        weight: form.weight !== "" ? Number(form.weight) : 0,
        length: form.length !== "" ? Number(form.length) : 0,
        width: form.width !== "" ? Number(form.width) : 0,
        height: form.height !== "" ? Number(form.height) : 0,
      });

      toast.success("Product added!");
      router.back(); // Go back to product list after success
    } catch (err) {
      toast.error("Failed to add product.");
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <div className='max-w-2xl mx-auto bg-white rounded-xl shadow p-4'>
      <div className='mb-2 flex flex-col items-start'>
        <button
          type='button'
          onClick={onBack || (() => router.back())}
          className='flex items-center gap-1 text-blue-600 text-xs font-medium hover:underline mb-2'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Products
        </button>
        <h2 className='text-lg font-bold ml-1'>Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* BASIC INFO */}
        <div className='grid grid-cols-1 gap-4'>
          <Input
            name='name'
            placeholder='Product Name*'
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <select
            name='category'
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className='w-full border rounded px-3 py-2 text-sm'
            required
          >
            <option value=''>Select a Category*</option>
            {loadingCategories ? (
              <option disabled>Loading...</option>
            ) : categoryOptions.length === 0 ? (
              <option disabled>No categories found</option>
            ) : (
              categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>
        <textarea
          name='description'
          placeholder='Product Description'
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className='w-full border rounded px-3 py-2 min-h-[80px] text-sm'
        />

        {/* PRICING & IDENTIFIERS */}
        <div className='grid grid-cols-1 gap-4'>
          <Label className='font-semibold'>Pricing & Identifiers</Label>
          <Input
            name='price'
            placeholder='Base Price*'
            type='number'
            min={0}
            value={form.priceTiers[0]?.price || ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                priceTiers: [{ ...f.priceTiers[0], price: e.target.value }],
              }))
            }
          />
          <Input
            name='stock'
            placeholder='Stock*'
            type='number'
            min={0}
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          />
          <Input
            name='sku'
            placeholder='SKU (Optional)'
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          />
          <Input
            name='barcode'
            placeholder='Barcode (Optional)'
            value={form.barcode}
            onChange={(e) =>
              setForm((f) => ({ ...f, barcode: e.target.value }))
            }
          />
        </div>

        {/* SHIPPING & DIMENSIONS */}
        <div className='grid grid-cols-1 gap-4'>
          <Label className='font-semibold'>Shipping & Dimensions</Label>
          <select
            name='shippingClass'
            value={form.shippingClass}
            onChange={(e) =>
              setForm((f) => ({ ...f, shippingClass: e.target.value }))
            }
            className='w-full border rounded px-3 py-2 text-sm'
          >
            <option value=''>Select Shipping Class (Optional)</option>
            {shippingClassOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Input
            name='weight'
            placeholder='Weight (kg)'
            type='number'
            min={0}
            value={form.weight}
            onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
          />
          <Input
            name='length'
            placeholder='Length (cm)'
            type='number'
            min={0}
            value={form.length}
            onChange={(e) => setForm((f) => ({ ...f, length: e.target.value }))}
          />
          <Input
            name='width'
            placeholder='Width (cm)'
            type='number'
            min={0}
            value={form.width}
            onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
          />
          <Input
            name='height'
            placeholder='Height (cm)'
            type='number'
            min={0}
            value={form.height}
            onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
          />
        </div>

        {/* IMAGES */}
        <div>
          <Label className='block font-semibold mb-2'>Product Images*</Label>
          <div
            {...getRootProps()}
            className={clsx(
              "border-2 border-dashed rounded-lg py-6 px-4 text-center bg-gray-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors",
              isDragActive && "border-blue-500 bg-blue-50"
            )}
          >
            <input {...getInputProps()} />
            <p className='text-sm text-gray-500'>
              Drag & drop images here, or click to select files. (Max 8)
            </p>
            <div className='flex gap-2 mt-4 flex-wrap justify-center'>
              {mainPreviews.map((src, i) => (
                <div key={i} className='relative group'>
                  <Image
                    src={src}
                    alt={`Preview ${i + 1}`}
                    width={80}
                    height={80}
                    className='rounded border object-cover'
                    onLoad={() => URL.revokeObjectURL(src)} // Clean up object URLs
                  />
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMainImage(i);
                    }}
                    className='absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full p-1 leading-none text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VARIANTS */}
        <div>
          <div className='flex items-center justify-between mb-2'>
            <Label className='font-semibold'>
              Variants (e.g., Color, Size)
            </Label>
            <button
              type='button'
              className='text-blue-600 text-sm font-bold'
              onClick={addVariant}
            >
              + Add Variant
            </button>
          </div>
          {variants.length > 0 && (
            <div className='space-y-3'>
              {variants.map((variant, i) => (
                <div
                  key={i}
                  className='border rounded p-3 bg-gray-50 space-y-3' // Increased vertical space
                >
                  {/* --- UPDATED: Vertical stack for variant options --- */}
                  <div className='grid grid-cols-1 gap-3'>
                    <Input
                      placeholder='Option 1 (e.g. Color)'
                      value={variant.option1}
                      onChange={(e) =>
                        handleVariantChange(i, "option1", e.target.value)
                      }
                    />
                    <Input
                      placeholder='Option 2 (e.g. Size)'
                      value={variant.option2}
                      onChange={(e) =>
                        handleVariantChange(i, "option2", e.target.value)
                      }
                    />
                  </div>
                  {/* --- UPDATED: 2-column grid for Price and Stock --- */}
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      placeholder='Price'
                      type='number'
                      min={0}
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(i, "price", e.target.value)
                      }
                    />
                    <Input
                      placeholder='Stock'
                      type='number'
                      min={0}
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(i, "stock", e.target.value)
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between pt-1'>
                    <div className='flex items-center gap-2'>
                      {variant.imagePreview && (
                        <Image
                          src={variant.imagePreview}
                          alt='Variant'
                          width={40}
                          height={40}
                          className='rounded border object-cover'
                        />
                      )}
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          handleVariantImage(i, e.target.files[0])
                        }
                        className='text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                      />
                    </div>
                    <button
                      type='button'
                      className='text-xs text-red-600 font-medium hover:underline'
                      onClick={() => removeVariant(i)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <Button type='submit' className='w-full h-10' disabled={saving}>
          {saving ? "Saving..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
