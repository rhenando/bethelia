"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

// --- Main Component ---
export default function AddProduct() {
  const authUser = useSelector((state) => state.auth.user);

  // Main form fields
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
  });

  // Product images (main gallery)
  const [mainImages, setMainImages] = useState([]);
  const [mainPreviews, setMainPreviews] = useState([]);

  // Variants
  const [variants, setVariants] = useState([
    {
      sku: "",
      barcode: "",
      option1: "", // e.g. Color
      option2: "", // e.g. Size
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

  // Category and shipping class options
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

  // --- Main image dropzone
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

  // --- Variant image upload
  const handleVariantImage = (idx, file) => {
    const preview = file ? URL.createObjectURL(file) : null;
    setVariants((prev) =>
      prev.map((v, i) =>
        i === idx ? { ...v, image: file, imagePreview: preview } : v
      )
    );
  };

  // --- Variant change handlers
  const handleVariantChange = (idx, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  };

  // --- Add/Remove variants
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

  // --- Remove main image
  const handleRemoveMainImage = (idx) => {
    setMainImages((prev) => prev.filter((_, i) => i !== idx));
    setMainPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Handle submit ---
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

      // --- Firestore save ---
      await addDoc(collection(db, "products"), {
        ...form,
        price: undefined, // price is now per variant
        images: mainImageUrls,
        mainImage: mainImageUrls[0],
        variants: variantsWithUrls,
        supplierId: authUser.uid,
        createdAt: serverTimestamp(),
      });

      toast.success("Product added!");
      // Reset form
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
      });
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
    } catch (err) {
      toast.error("Failed to add product.");
      console.error(err);
    }
    setSaving(false);
  };

  // --- Render ---
  return (
    <div
      className='max-w-3xl mx-auto p-4 bg-white rounded-xl shadow mt-4 overflow-y-auto'
      style={{ maxHeight: "calc(100vh - 32px)" }}
    >
      <h2 className='text-xl font-bold mb-4'>Add Product</h2>
      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* MAIN INFO */}
        <Input
          name='name'
          placeholder='Product Name'
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <textarea
          name='description'
          placeholder='Description'
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className='w-full border rounded px-3 py-2 min-h-[80px]'
        />

        <select
          name='category'
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className='w-full border rounded px-3 py-2'
        >
          <option value=''>Select Category</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          name='shippingClass'
          value={form.shippingClass}
          onChange={(e) =>
            setForm((f) => ({ ...f, shippingClass: e.target.value }))
          }
          className='w-full border rounded px-3 py-2'
        >
          <option value=''>Shipping Class</option>
          {shippingClassOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Product-level shipping (default for all variants, can be overridden per variant) */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
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

        {/* MAIN PRODUCT IMAGES */}
        <div>
          <label className='block font-semibold mb-1'>Product Images *</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl py-8 px-4 text-center bg-gray-50 cursor-pointer transition ${
              isDragActive ? "border-blue-500 bg-blue-50" : ""
            }`}
          >
            <input {...getInputProps()} />
            <p className='text-sm text-gray-500'>
              Drag and drop images here, or click to select up to 8 images.
            </p>
            <div className='flex gap-3 mt-4 flex-wrap justify-center'>
              {mainPreviews.map((src, i) => (
                <div key={i} className='relative group'>
                  <Image
                    src={src}
                    alt={`Preview ${i + 1}`}
                    width={90}
                    height={90}
                    className='rounded-lg border shadow'
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMainImage(i);
                    }}
                    className='absolute top-1 right-1 bg-white bg-opacity-60 rounded-full p-1 hover:bg-red-600 hover:text-white transition'
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
            <span className='font-semibold text-sm'>
              Variants (e.g. Color/Size)
            </span>
            <button
              type='button'
              className='text-primary text-xs'
              onClick={addVariant}
            >
              + Add Variant
            </button>
          </div>
          <div className='space-y-4'>
            {variants.map((variant, i) => (
              <div
                key={i}
                className='border rounded-lg p-3 bg-gray-50 space-y-2'
              >
                <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                  <Input
                    placeholder='Color/Option 1'
                    value={variant.option1}
                    onChange={(e) =>
                      handleVariantChange(i, "option1", e.target.value)
                    }
                  />
                  <Input
                    placeholder='Size/Option 2'
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
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
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
                  <Input
                    placeholder='Weight (kg)'
                    type='number'
                    min={0}
                    value={variant.weight}
                    onChange={(e) =>
                      handleVariantChange(i, "weight", e.target.value)
                    }
                  />
                  <Input
                    placeholder='Length (cm)'
                    type='number'
                    min={0}
                    value={variant.length}
                    onChange={(e) =>
                      handleVariantChange(i, "length", e.target.value)
                    }
                  />
                  <Input
                    placeholder='Width (cm)'
                    type='number'
                    min={0}
                    value={variant.width}
                    onChange={(e) =>
                      handleVariantChange(i, "width", e.target.value)
                    }
                  />
                  <Input
                    placeholder='Height (cm)'
                    type='number'
                    min={0}
                    value={variant.height}
                    onChange={(e) =>
                      handleVariantChange(i, "height", e.target.value)
                    }
                  />
                </div>
                <div className='flex items-center gap-3'>
                  <label className='block font-semibold text-xs'>
                    Variant Image:
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleVariantImage(i, e.target.files[0])}
                  />
                  {variant.imagePreview && (
                    <Image
                      src={variant.imagePreview}
                      alt='Variant'
                      width={50}
                      height={50}
                      className='rounded border'
                    />
                  )}
                  {variants.length > 1 && (
                    <button
                      type='button'
                      className='text-xs text-red-500 ml-2'
                      onClick={() => removeVariant(i)}
                    >
                      Remove Variant
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <Button type='submit' className='w-full h-12' disabled={saving}>
          {saving ? "Saving..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
