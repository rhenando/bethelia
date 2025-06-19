"use client";

import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

export default function AddProduct() {
  const authUser = useSelector((state) => state.auth.user);

  // Example category list
  const categoryOptions = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Toys",
    "Beauty",
    "Others",
  ];

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    priceTiers: [{ minQty: 1, price: "" }],
    stock: "",
    imageUrl: "", // Will become downloadURL after upload
    additionalImages: [],
    shippingMethods: [{ method: "", cost: "", deliveryTime: "" }],
    attributes: [{ name: "", value: "" }],
  });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [mainImageUploading, setMainImageUploading] = useState(false);

  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [additionalImagesUploading, setAdditionalImagesUploading] = useState(
    [] // tracks progress for each
  );

  const [loading, setLoading] = useState(false);

  // ---- HANDLERS ----

  // General input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Main Image File Input
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // Additional Images (multi-file upload)
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImageFiles(files);
    setAdditionalImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // Price Tiers
  const handleTierChange = (idx, field, value) => {
    const updated = form.priceTiers.map((t, i) =>
      i === idx ? { ...t, [field]: value } : t
    );
    setForm((f) => ({ ...f, priceTiers: updated }));
  };
  const addPriceTier = () =>
    setForm((f) => ({
      ...f,
      priceTiers: [...f.priceTiers, { minQty: "", price: "" }],
    }));
  const removePriceTier = (idx) =>
    setForm((f) => ({
      ...f,
      priceTiers: f.priceTiers.filter((_, i) => i !== idx),
    }));

  // Shipping
  const handleShippingChange = (idx, field, value) => {
    const updated = form.shippingMethods.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s
    );
    setForm((f) => ({ ...f, shippingMethods: updated }));
  };
  const addShippingMethod = () =>
    setForm((f) => ({
      ...f,
      shippingMethods: [
        ...f.shippingMethods,
        { method: "", cost: "", deliveryTime: "" },
      ],
    }));
  const removeShippingMethod = (idx) =>
    setForm((f) => ({
      ...f,
      shippingMethods: f.shippingMethods.filter((_, i) => i !== idx),
    }));

  // Attributes
  const handleAttrChange = (idx, field, value) => {
    const updated = form.attributes.map((a, i) =>
      i === idx ? { ...a, [field]: value } : a
    );
    setForm((f) => ({ ...f, attributes: updated }));
  };
  const addAttribute = () =>
    setForm((f) => ({
      ...f,
      attributes: [...f.attributes, { name: "", value: "" }],
    }));
  const removeAttribute = (idx) =>
    setForm((f) => ({
      ...f,
      attributes: f.attributes.filter((_, i) => i !== idx),
    }));

  // ---- IMAGE UPLOAD HELPERS ----

  // Returns a Promise with the download URL
  const uploadImage = (file, path) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        null,
        (err) => reject(err),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  // ---- SUBMIT ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      toast.error("Name, price, and category are required.");
      return;
    }
    if (!authUser?.uid) {
      toast.error("Please login as a supplier.");
      return;
    }
    if (!mainImageFile) {
      toast.error("Please upload a main image.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload main image
      setMainImageUploading(true);
      const mainImageUrl = await uploadImage(
        mainImageFile,
        `products/${authUser.uid}/${Date.now()}_main_${mainImageFile.name}`
      );
      setMainImageUploading(false);

      // 2. Upload additional images (if any)
      setAdditionalImagesUploading(additionalImageFiles.map(() => true));
      let additionalImageUrls = [];
      if (additionalImageFiles.length > 0) {
        additionalImageUrls = await Promise.all(
          additionalImageFiles.map((file, idx) =>
            uploadImage(
              file,
              `products/${authUser.uid}/${Date.now()}_${file.name}`
            )
          )
        );
      }
      setAdditionalImagesUploading(additionalImageFiles.map(() => false));

      // 3. Save to Firestore
      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        priceTiers: form.priceTiers.map((t) => ({
          minQty: Number(t.minQty),
          price: Number(t.price),
        })),
        stock: Number(form.stock || 0),
        imageUrl: mainImageUrl,
        additionalImages: additionalImageUrls,
        supplierId: authUser.uid,
        createdAt: serverTimestamp(),
      });

      toast.success("Product added!");
      // Reset
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        priceTiers: [{ minQty: 1, price: "" }],
        stock: "",
        imageUrl: "",
        additionalImages: [],
        shippingMethods: [{ method: "", cost: "", deliveryTime: "" }],
        attributes: [{ name: "", value: "" }],
      });
      setMainImageFile(null);
      setMainImagePreview("");
      setAdditionalImageFiles([]);
      setAdditionalImagePreviews([]);
    } catch (err) {
      toast.error("Failed to add product.");
      console.error(err);
    }
    setLoading(false);
  };

  // ---- UI ----
  return (
    <div
      className='max-w-xl mx-auto p-4 bg-white rounded-xl shadow mt-4 overflow-y-auto'
      style={{ maxHeight: "calc(100vh - 32px)" }}
    >
      <h2 className='text-xl font-bold mb-4'>Add Product</h2>
      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Name, Description, Category */}
        <Input
          name='name'
          placeholder='Product Name'
          value={form.name}
          onChange={handleChange}
        />
        <textarea
          name='description'
          placeholder='Description'
          value={form.description}
          onChange={handleChange}
          className='w-full border rounded px-3 py-2 min-h-[80px]'
        />
        <select
          name='category'
          value={form.category}
          onChange={handleChange}
          className='w-full border rounded px-3 py-2'
        >
          <option value=''>Select Category</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Price & Price Tiers */}
        <div>
          <label className='block mb-1 font-semibold'>Base Price (₱)</label>
          <Input
            name='price'
            type='number'
            value={form.price}
            onChange={handleChange}
            min={0}
          />
          <div className='mt-2 mb-2'>
            <div className='flex justify-between items-center mb-1'>
              <span className='font-semibold text-sm'>Bulk Price Tiers</span>
              <button
                type='button'
                className='text-primary text-xs'
                onClick={addPriceTier}
              >
                + Add Tier
              </button>
            </div>
            {form.priceTiers.map((tier, i) => (
              <div key={i} className='flex gap-2 mb-1'>
                <Input
                  type='number'
                  min={1}
                  placeholder='Min Qty'
                  value={tier.minQty}
                  onChange={(e) =>
                    handleTierChange(i, "minQty", e.target.value)
                  }
                />
                <Input
                  type='number'
                  min={0}
                  placeholder='Tier Price'
                  value={tier.price}
                  onChange={(e) => handleTierChange(i, "price", e.target.value)}
                />
                {form.priceTiers.length > 1 && (
                  <button
                    type='button'
                    className='text-xs text-red-500'
                    onClick={() => removePriceTier(i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stock */}
        <Input
          name='stock'
          placeholder='Stock'
          type='number'
          min={0}
          value={form.stock}
          onChange={handleChange}
        />

        {/* Main Image */}
        <div>
          <label className='block mb-1 font-semibold'>Main Image</label>
          <input
            type='file'
            accept='image/*'
            onChange={handleMainImageChange}
            className='block'
          />
          {mainImagePreview && (
            <Image
              src={mainImagePreview}
              alt='Preview'
              width={80}
              height={80}
              className='mt-2 rounded shadow'
            />
          )}
          {mainImageUploading && (
            <div className='text-xs text-gray-500 mt-1'>Uploading...</div>
          )}
        </div>

        {/* Additional Images */}
        <div>
          <label className='block mb-1 font-semibold'>Additional Images</label>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleAdditionalImagesChange}
            className='block'
          />
          <div className='flex gap-2 flex-wrap mt-2'>
            {additionalImagePreviews.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Additional Preview ${i + 1}`}
                width={60}
                height={60}
                className='rounded shadow'
              />
            ))}
          </div>
          {additionalImagesUploading.some(Boolean) && (
            <div className='text-xs text-gray-500 mt-1'>Uploading...</div>
          )}
        </div>

        {/* Shipping Methods */}
        <div>
          <div className='flex justify-between items-center mb-1'>
            <span className='font-semibold text-sm'>Shipping Methods</span>
            <button
              type='button'
              className='text-primary text-xs'
              onClick={addShippingMethod}
            >
              + Add Method
            </button>
          </div>
          {form.shippingMethods.map((ship, i) => (
            <div key={i} className='flex gap-2 mb-1'>
              <Input
                placeholder='Method'
                value={ship.method}
                onChange={(e) =>
                  handleShippingChange(i, "method", e.target.value)
                }
              />
              <Input
                type='number'
                min={0}
                placeholder='Cost'
                value={ship.cost}
                onChange={(e) =>
                  handleShippingChange(i, "cost", e.target.value)
                }
              />
              <Input
                type='number'
                min={0}
                placeholder='Delivery (days)'
                value={ship.deliveryTime}
                onChange={(e) =>
                  handleShippingChange(i, "deliveryTime", e.target.value)
                }
              />
              {form.shippingMethods.length > 1 && (
                <button
                  type='button'
                  className='text-xs text-red-500'
                  onClick={() => removeShippingMethod(i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Attributes (custom properties) */}
        <div>
          <div className='flex justify-between items-center mb-1'>
            <span className='font-semibold text-sm'>Custom Attributes</span>
            <button
              type='button'
              className='text-primary text-xs'
              onClick={addAttribute}
            >
              + Add Attribute
            </button>
          </div>
          {form.attributes.map((attr, i) => (
            <div key={i} className='flex gap-2 mb-1'>
              <Input
                placeholder='Attribute Name'
                value={attr.name}
                onChange={(e) => handleAttrChange(i, "name", e.target.value)}
              />
              <Input
                placeholder='Value'
                value={attr.value}
                onChange={(e) => handleAttrChange(i, "value", e.target.value)}
              />
              {form.attributes.length > 1 && (
                <button
                  type='button'
                  className='text-xs text-red-500'
                  onClick={() => removeAttribute(i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <Button type='submit' className='w-full h-12' disabled={loading}>
          {loading ? "Saving..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
