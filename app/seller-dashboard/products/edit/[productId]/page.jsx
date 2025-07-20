"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { db, storage } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
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
import { ArrowLeft, Loader2 } from "lucide-react";
import clsx from "clsx";

const safeFileName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { productId } = params;
  const authUser = useSelector((state) => state.auth.user);

  const [form, setForm] = useState(null);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const q = query(collection(db, "categories"), orderBy("order"));
        const snap = await getDocs(q);
        setCategoryOptions(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        toast.error("Failed to load categories");
      }
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

  // Fetch existing product data
  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const data = productSnap.data();
          setForm(data);
          setVariants(data.variants || []);
          setImages(data.images || []);
        } else {
          toast.error("Product not found.");
          router.push("/seller-dashboard/products");
        }
      } catch (error) {
        toast.error("Failed to fetch product data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, router]);

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: true,
  });

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleVariantChange = (idx, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  };

  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      { option1: "", option2: "", price: "", stock: "" },
    ]);
  const removeVariant = (idx) =>
    setVariants((prev) => prev.filter((_, i) => i !== idx));

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      toast.error("Product name and category are required.");
      return;
    }
    setSaving(true);

    try {
      const updatedImageUrls = [];
      for (const image of images) {
        if (typeof image === "string") {
          updatedImageUrls.push(image);
        } else {
          const refPath = `products/${
            authUser.uid
          }/main_${Date.now()}_${safeFileName(image.name)}`;
          const storageRef = ref(storage, refPath);
          const snap = await uploadBytesResumable(storageRef, image);
          const url = await getDownloadURL(snap.ref);
          updatedImageUrls.push(url);
        }
      }

      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        ...form,
        price: Number(form.priceTiers?.[0]?.price) || 0,
        stock: Number(form.stock) || 0,
        weight: Number(form.weight) || 0,
        length: Number(form.length) || 0,
        width: Number(form.width) || 0,
        height: Number(form.height) || 0,
        images: updatedImageUrls,
        mainImage: updatedImageUrls[0] || null,
        variants,
        updatedAt: serverTimestamp(),
      });

      toast.success("Product updated successfully!");
      router.push("/seller-dashboard/products");
    } catch (err) {
      toast.error("Failed to update product.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-48'>
        <Loader2 className='w-8 h-8 animate-spin text-gray-400' />
      </div>
    );
  }

  if (!form) {
    return (
      <div className='text-center py-10'>Product could not be loaded.</div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto bg-white rounded-xl shadow p-4'>
      <div className='mb-2 flex flex-col items-start'>
        <button
          type='button'
          onClick={() => router.back()}
          className='flex items-center gap-1 text-blue-600 text-xs font-medium hover:underline mb-2'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Products
        </button>
        <h2 className='text-lg font-bold ml-1'>Edit Product</h2>
      </div>

      <form onSubmit={handleUpdate} className='space-y-6'>
        {/* BASIC INFO */}
        <div className='grid grid-cols-1 gap-4'>
          <Input
            name='name'
            placeholder='Product Name*'
            value={form.name || ""}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <select
            name='category'
            value={form.category || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className='w-full border rounded px-3 py-2 text-sm'
            required
          >
            <option value=''>Select a Category*</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          name='description'
          placeholder='Product Description'
          value={form.description || ""}
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
            value={form.priceTiers?.[0]?.price || ""}
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
            value={form.stock || ""}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          />
          <Input
            name='sku'
            placeholder='SKU (Optional)'
            value={form.sku || ""}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          />
          <Input
            name='barcode'
            placeholder='Barcode (Optional)'
            value={form.barcode || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, barcode: e.target.value }))
            }
          />
        </div>

        {/* --- ADDED SHIPPING & DIMENSIONS SECTION --- */}
        <div className='grid grid-cols-1 gap-4'>
          <Label className='font-semibold'>Shipping & Dimensions</Label>
          <select
            name='shippingClass'
            value={form.shippingClass || ""}
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
            value={form.weight || ""}
            onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
          />
          <Input
            name='length'
            placeholder='Length (cm)'
            type='number'
            min={0}
            value={form.length || ""}
            onChange={(e) => setForm((f) => ({ ...f, length: e.target.value }))}
          />
          <Input
            name='width'
            placeholder='Width (cm)'
            type='number'
            min={0}
            value={form.width || ""}
            onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
          />
          <Input
            name='height'
            placeholder='Height (cm)'
            type='number'
            min={0}
            value={form.height || ""}
            onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
          />
        </div>

        {/* IMAGES */}
        <div>
          <Label className='block font-semibold mb-2'>Product Images*</Label>
          <div
            {...getRootProps()}
            className={clsx(
              "border-2 border-dashed rounded-lg py-6 px-4 text-center bg-gray-50 cursor-pointer",
              isDragActive && "border-blue-500 bg-blue-50"
            )}
          >
            <input {...getInputProps()} />
            <p className='text-sm text-gray-500'>
              Drag & drop new images here, or click to select.
            </p>
            <div className='flex gap-2 mt-4 flex-wrap justify-center'>
              {images.map((img, i) => (
                <div key={i} className='relative group'>
                  <Image
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt={`Product image ${i + 1}`}
                    width={80}
                    height={80}
                    className='rounded border object-cover'
                  />
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(i);
                    }}
                    className='absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full p-1 leading-none text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100'
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
            <Label className='font-semibold'>Variants</Label>
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
                  className='border rounded p-3 bg-gray-50 space-y-3'
                >
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
                  <div className='flex items-center justify-end pt-1'>
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

        <Button type='submit' className='w-full h-10' disabled={saving}>
          {saving ? <Loader2 className='animate-spin' /> : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
