"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

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
  const [variants, setVariants] = useState([
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
  const [saving, setSaving] = useState(false);

  const categoryOptions = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Toys",
    "Beauty",
    "Books",
  ];
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
      toast.error("Login as supplier to add products.");
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
        const refPath = `products/${authUser.uid}/main_${Date.now()}_${i}_${
          file.name
        }`;
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
            }/variant_${Date.now()}_${idx}_${variant.image.name}`;
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
        supplierId: authUser.uid,
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
      setMainImages([]);
      setMainPreviews([]);
      setVariants([
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
      setForm({
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
    } catch (err) {
      toast.error("Failed to add product.");
      console.error(err);
    }
    setSaving(false);
  };

  // --- RENDER ---
  return (
    <div className='max-w-2xl mx-auto bg-white rounded-xl shadow p-4'>
      {/* Back Button on Top */}
      <div className='mb-2 flex flex-col items-start'>
        <button
          type='button'
          onClick={onBack || (() => router.back())}
          className='flex items-center gap-1 text-[var(--primary)] text-xs font-medium hover:underline mb-2'
        >
          <ArrowLeft className='w-4 h-4' />
          Back
        </button>
        <h2 className='text-lg font-bold ml-1'>Add Product</h2>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* BASIC INFO */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
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
            className='w-full border rounded px-3 py-1 text-xs'
            required
          >
            <option value=''>Category*</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <textarea
          name='description'
          placeholder='Description'
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className='w-full border rounded px-3 py-1 min-h-[60px] text-xs'
        />

        {/* PRICE, STOCK, STATUS */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          <Input
            name='stock'
            placeholder='Stock*'
            type='number'
            min={0}
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          />
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
            name='sku'
            placeholder='SKU'
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          />
          <Input
            name='barcode'
            placeholder='Barcode'
            value={form.barcode}
            onChange={(e) =>
              setForm((f) => ({ ...f, barcode: e.target.value }))
            }
          />
        </div>

        {/* SHIPPING CLASS & SIZE */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          <select
            name='shippingClass'
            value={form.shippingClass}
            onChange={(e) =>
              setForm((f) => ({ ...f, shippingClass: e.target.value }))
            }
            className='w-full border rounded px-3 py-1 text-xs'
          >
            <option value=''>Shipping Class</option>
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
          <label className='block font-semibold text-xs mb-1'>
            Product Images*
          </label>
          <div
            {...getRootProps()}
            className={clsx(
              "border-2 border-dashed rounded-lg py-4 px-2 text-center bg-gray-50 cursor-pointer",
              isDragActive && "border-blue-500 bg-blue-50"
            )}
          >
            <input {...getInputProps()} />
            <p className='text-xs text-gray-500'>
              Drag & drop images or click. (Max 8)
            </p>
            <div className='flex gap-2 mt-2 flex-wrap justify-center'>
              {mainPreviews.map((src, i) => (
                <div key={i} className='relative group'>
                  <Image
                    src={src}
                    alt={`Preview ${i + 1}`}
                    width={60}
                    height={60}
                    className='rounded border'
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMainImage(i);
                    }}
                    className='absolute top-1 right-1 bg-white rounded-full p-1 text-xs hover:bg-red-600 hover:text-white'
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
          <div className='flex items-center justify-between mb-1'>
            <span className='font-semibold text-xs'>
              Variants (Color/Size, optional)
            </span>
            <button
              type='button'
              className='text-primary text-xs font-bold'
              onClick={addVariant}
            >
              + Add
            </button>
          </div>
          <div className='space-y-2'>
            {variants.map((variant, i) => (
              <div
                key={i}
                className='border rounded p-2 bg-gray-50 space-y-1 text-xs'
              >
                <div className='grid grid-cols-2 md:grid-cols-6 gap-1'>
                  <Input
                    placeholder='Option 1'
                    value={variant.option1}
                    onChange={(e) =>
                      handleVariantChange(i, "option1", e.target.value)
                    }
                  />
                  <Input
                    placeholder='Option 2'
                    value={variant.option2}
                    onChange={(e) =>
                      handleVariantChange(i, "option2", e.target.value)
                    }
                  />
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
                  <Input
                    placeholder='SKU'
                    value={variant.sku}
                    onChange={(e) =>
                      handleVariantChange(i, "sku", e.target.value)
                    }
                  />
                  <Input
                    placeholder='Barcode'
                    value={variant.barcode}
                    onChange={(e) =>
                      handleVariantChange(i, "barcode", e.target.value)
                    }
                  />
                </div>
                <div className='flex items-center gap-2 mt-1'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleVariantImage(i, e.target.files[0])}
                    className='text-xs'
                  />
                  {variant.imagePreview && (
                    <Image
                      src={variant.imagePreview}
                      alt='Variant'
                      width={30}
                      height={30}
                      className='rounded border'
                    />
                  )}
                  {variants.length > 1 && (
                    <button
                      type='button'
                      className='text-xs text-red-500 ml-2'
                      onClick={() => removeVariant(i)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <Button type='submit' className='w-full h-10 mt-1' disabled={saving}>
          {saving ? "Saving..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
