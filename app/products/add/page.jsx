"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddProduct() {
  const authUser = useSelector((state) => state.auth.user);

  // For categories, attributes, etc. (would be fetched from DB in real app)
  const categoryOptions = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Toys",
    "Beauty",
    "Others",
  ];

  // Main product state
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    priceTiers: [{ minQty: 1, price: "" }],
    stock: "",
    imageUrl: "",
    additionalImages: [""],
    shippingMethods: [{ method: "", cost: "", deliveryTime: "" }],
    attributes: [{ name: "", value: "" }],
  });
  const [loading, setLoading] = useState(false);

  // ------- Form Handlers -------

  // Basic input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Price tiers
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

  // Images
  const handleAdditionalImage = (idx, value) => {
    const updated = form.additionalImages.map((img, i) =>
      i === idx ? value : img
    );
    setForm((f) => ({ ...f, additionalImages: updated }));
  };

  const addAdditionalImage = () =>
    setForm((f) => ({
      ...f,
      additionalImages: [...f.additionalImages, ""],
    }));

  const removeAdditionalImage = (idx) =>
    setForm((f) => ({
      ...f,
      additionalImages: f.additionalImages.filter((_, i) => i !== idx),
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

  // ------- Submit Handler -------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation (customize as needed)
    if (!form.name || !form.price || !form.category) {
      toast.error("Name, price, and category are required.");
      return;
    }

    if (!authUser?.uid) {
      toast.error("Please login as a supplier.");
      return;
    }

    setLoading(true);
    try {
      // Attach supplierId and timestamp
      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        priceTiers: form.priceTiers.map((t) => ({
          minQty: Number(t.minQty),
          price: Number(t.price),
        })),
        stock: Number(form.stock || 0),
        supplierId: authUser.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Product added!");
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        priceTiers: [{ minQty: 1, price: "" }],
        stock: "",
        imageUrl: "",
        additionalImages: [""],
        shippingMethods: [{ method: "", cost: "", deliveryTime: "" }],
        attributes: [{ name: "", value: "" }],
      });
    } catch (err) {
      toast.error("Failed to add product.");
      console.error(err);
    }
    setLoading(false);
  };

  // ------- UI -------
  return (
    <div className='max-w-xl mx-auto p-4 bg-white rounded-xl shadow mt-4'>
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

        {/* Image Fields */}
        <Input
          name='imageUrl'
          placeholder='Main Image URL'
          value={form.imageUrl}
          onChange={handleChange}
        />
        <div className='mb-2'>
          <div className='flex justify-between items-center mb-1'>
            <span className='font-semibold text-sm'>Additional Images</span>
            <button
              type='button'
              className='text-primary text-xs'
              onClick={addAdditionalImage}
            >
              + Add Image
            </button>
          </div>
          {form.additionalImages.map((img, i) => (
            <div key={i} className='flex gap-2 mb-1'>
              <Input
                placeholder='Image URL'
                value={img}
                onChange={(e) => handleAdditionalImage(i, e.target.value)}
              />
              {form.additionalImages.length > 1 && (
                <button
                  type='button'
                  className='text-xs text-red-500'
                  onClick={() => removeAdditionalImage(i)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Shipping Methods */}
        <div className='mb-2'>
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
        <div className='mb-2'>
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

        {/* Submit */}
        <Button type='submit' className='w-full h-12' disabled={loading}>
          {loading ? "Saving..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
