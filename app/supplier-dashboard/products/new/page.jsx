"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { toast } from "sonner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

// --- Attribute config ---
const ATTRIBUTE_CONFIG = [
  {
    name: "Size",
    type: "measurement",
    fields: [
      { label: "Length", units: ["cm", "mm", "inch", "meter"] },
      { label: "Width", units: ["cm", "mm", "inch", "meter"] },
      { label: "Height", units: ["cm", "mm", "inch", "meter"] },
    ],
  },
  {
    name: "Weight",
    type: "measurement",
    fields: [{ label: "Weight", units: ["g", "kg", "lb", "oz"] }],
  },
  { name: "Color", type: "choice" },
  { name: "Material", type: "choice" },
  { name: "Brand", type: "choice" },
];

export default function NewProductPage() {
  const router = useRouter();

  // Which accordion section is open
  const [openAccordion, setOpenAccordion] = useState("info");

  // === Images Drag & Drop ===
  const [images, setImages] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImgs = files.map((f) => ({
      id: URL.createObjectURL(f),
      url: URL.createObjectURL(f),
    }));
    setImages((imgs) => [...imgs, ...newImgs]);
  };

  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setVariants((v) =>
        v.map((vt) =>
          vt.id === over.id
            ? { ...vt, imageUrl: images.find((i) => i.id === active.id).url }
            : vt
        )
      );
    }
    setActiveId(null);
  };
  const handleDragCancel = () => setActiveId(null);

  function DraggableImage({ img }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({ id: img.id });
    const style = {
      zIndex: isDragging ? 9999 : 0,
      ...(transform && {
        transform: `translate3d(${transform.x}px,${transform.y}px,0)`,
      }),
    };
    return (
      <img
        ref={setNodeRef}
        src={img.url}
        {...listeners}
        {...attributes}
        style={style}
        className='w-16 h-16 object-cover rounded cursor-grab'
      />
    );
  }

  function VariantDropZone({ variant }) {
    const { isOver, setNodeRef } = useDroppable({ id: variant.id });
    return (
      <div
        ref={setNodeRef}
        className={`h-20 border-2 rounded flex items-center justify-center ${
          isOver ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}
      >
        {variant.imageUrl ? (
          <img src={variant.imageUrl} className='h-full object-contain' />
        ) : (
          <span className='text-gray-400'>Drop image</span>
        )}
      </div>
    );
  }

  // === Product Form ===
  const [form, setForm] = useState({ name: "", description: "" });
  const handleFormChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // === Attribute State ===
  const [attributes, setAttributes] = useState({
    Size: {},
    Weight: {},
    Color: [],
    Material: [],
    Brand: [],
  });

  const [measurementFields, setMeasurementFields] = useState({
    Size: {
      Length: { value: "", unit: "cm" },
      Width: { value: "", unit: "cm" },
      Height: { value: "", unit: "cm" },
    },
    Weight: {
      Weight: { value: "", unit: "g" },
    },
  });
  const [choiceInput, setChoiceInput] = useState({
    Color: "",
    Material: "",
    Brand: "",
  });

  // Show values as tags/summary
  function AttributeDisplay({ attr }) {
    if (ATTRIBUTE_CONFIG.find((a) => a.name === attr).type === "measurement") {
      return (
        <span className='text-xs text-gray-700'>
          {Object.entries(attributes[attr])
            .filter(([_, v]) => v.value)
            .map(([k, v]) => `${k}: ${v.value} ${v.unit}`)
            .join(", ")}
        </span>
      );
    }
    // choice type
    return (
      <>
        {(attributes[attr] || []).map((v) => (
          <span
            key={v}
            className='bg-gray-200 px-2 py-0.5 rounded text-xs mr-1'
          >
            {v}
            <button
              className='ml-1 text-red-600'
              onClick={() =>
                setAttributes((prev) => ({
                  ...prev,
                  [attr]: prev[attr].filter((x) => x !== v),
                }))
              }
            >
              ×
            </button>
          </span>
        ))}
      </>
    );
  }

  // === Variants Matrix Generation ===
  const attrsForVariants = useMemo(() => {
    // Format for variant matrix
    return ATTRIBUTE_CONFIG.map((attr) => {
      if (attr.type === "measurement") {
        const vals = Object.entries(attributes[attr.name] || {})
          .filter(([_, v]) => v.value)
          .map(([k, v]) => `${k}: ${v.value} ${v.unit}`);
        return vals.length ? { name: attr.name, values: vals } : null;
      }
      // choice type
      const vals = attributes[attr.name] || [];
      return vals.length ? { name: attr.name, values: vals } : null;
    }).filter(Boolean);
  }, [attributes]);

  const matrix = useMemo(() => {
    if (!attrsForVariants.length) return [];
    return attrsForVariants.reduce(
      (acc, { name, values }) =>
        acc.flatMap((item) => values.map((val) => ({ ...item, [name]: val }))),
      [{}]
    );
  }, [attrsForVariants]);

  const [variants, setVariants] = useState([]);
  useEffect(() => {
    setVariants(
      matrix.map((comb, i) => {
        const autoSku = Object.values(comb).join("-");
        return {
          id: variants[i]?.id || `row-${i}-${Date.now()}`,
          attributes: comb,
          sku: variants[i]?.sku ?? autoSku,
          price: variants[i]?.price ?? "",
          stock: variants[i]?.stock ?? "",
          imageUrl: variants[i]?.imageUrl ?? "",
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrix]);

  const updateVariantField = (i, field, val) =>
    setVariants((v) => {
      const c = [...v];
      c[i][field] = val;
      return c;
    });

  const bulkFill = (field, fn) =>
    setVariants((v) => v.map((vt) => ({ ...vt, [field]: fn(vt) })));

  // === Shipping ===
  const [shippingMethods, setShippingMethods] = useState([]);
  const addShipping = () =>
    setShippingMethods((s) => [
      ...s,
      { id: `s-${Date.now()}`, name: "", cost: "", deliveryTime: "" },
    ]);
  const updateShipping = (i, f, val) =>
    setShippingMethods((s) => {
      const c = [...s];
      c[i][f] = val;
      return c;
    });
  const removeShipping = (i) =>
    setShippingMethods((s) => s.filter((_, idx) => idx !== i));

  // === Submission State & Handler ===
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic product validation
    if (!form.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Product description is required.");
      return;
    }

    if (!attrsForVariants.length) {
      toast.error("Please enter at least one attribute value.");
      return;
    }

    if (!variants.length) {
      toast.error("No variants generated—check your attributes.");
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      const { sku, price, stock } = variants[i];
      if (!sku.trim()) {
        toast.error(`Variant ${i + 1}: SKU is required.`);
        return;
      }
      if (isNaN(parseFloat(price)) || price.trim() === "") {
        toast.error(`Variant ${i + 1}: Price is invalid.`);
        return;
      }
      if (isNaN(parseInt(stock, 10)) || stock.trim() === "") {
        toast.error(`Variant ${i + 1}: Stock is invalid.`);
        return;
      }
    }

    if (!shippingMethods.length) {
      toast.error("Please add at least one shipping method.");
      return;
    }

    for (let i = 0; i < shippingMethods.length; i++) {
      const { name, cost, deliveryTime } = shippingMethods[i];
      if (!name.trim()) {
        toast.error(`Shipping method ${i + 1}: Carrier name is required.`);
        return;
      }
      if (isNaN(parseFloat(cost)) || cost === "") {
        toast.error(`Shipping method ${i + 1}: Cost is invalid.`);
        return;
      }
      if (!deliveryTime.trim()) {
        toast.error(`Shipping method ${i + 1}: Delivery time is required.`);
        return;
      }
    }

    setIsLoading(true);

    const payload = {
      ...form,
      attributes,
      variants: variants.map((v) => ({
        attributes: v.attributes,
        sku: v.sku,
        price: parseFloat(v.price),
        stock: parseInt(v.stock, 10),
        imageUrl: v.imageUrl,
      })),
      shippingMethods,
    };

    try {
      await addDoc(collection(db, "products"), payload);
      toast.success("Product created successfully!");
      router.push("/supplier-dashboard/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product. Please try again.");
      setIsLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <form onSubmit={handleSubmit}>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <DragOverlay>
          {activeId && (
            <img
              src={images.find((i) => i.id === activeId)?.url}
              className='w-16 h-16 object-cover rounded'
            />
          )}
        </DragOverlay>

        <div className='min-h-screen bg-gray-50 flex justify-center p-4'>
          {/* LEFT: Accordion sections */}
          <div className='flex-1 max-w-2xl bg-white rounded shadow p-6 mr-6'>
            <Accordion
              type='single'
              collapsible
              value={openAccordion}
              onValueChange={setOpenAccordion}
              className='w-full'
            >
              {/* Product Info */}
              <AccordionItem value='info'>
                <AccordionTrigger className='text-lg'>
                  Product Information
                </AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-3'>
                    <input
                      name='name'
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder='Product Name'
                      className='w-full border rounded px-2 py-1'
                    />
                    <textarea
                      name='description'
                      value={form.description}
                      onChange={handleFormChange}
                      rows={3}
                      placeholder='Description'
                      className='w-full border rounded px-2 py-1'
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Attributes */}
              <AccordionItem value='attributes'>
                <AccordionTrigger className='text-lg'>
                  Attributes
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    <p className='text-xs text-gray-600 mb-4'>
                      Add attribute values or measurements below.
                    </p>
                    {ATTRIBUTE_CONFIG.map((attr) => (
                      <div
                        key={attr.name}
                        className='mb-4 border-b pb-4 last:border-b-0'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='font-semibold'>{attr.name}</span>
                          <AttributeDisplay attr={attr.name} />
                        </div>
                        {attr.type === "choice" && (
                          <div className='mb-2'>
                            <div className='flex flex-wrap gap-1 mb-2'>
                              {(attributes[attr.name] || []).map((v) => (
                                <span
                                  key={v}
                                  className='bg-gray-200 px-2 py-0.5 rounded text-xs'
                                >
                                  {v}
                                  <button
                                    className='ml-1 text-red-600'
                                    onClick={() =>
                                      setAttributes((prev) => ({
                                        ...prev,
                                        [attr.name]: prev[attr.name].filter(
                                          (x) => x !== v
                                        ),
                                      }))
                                    }
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              className='flex-1 px-2 py-1 outline-none border rounded text-xs'
                              placeholder={`Add ${attr.name} and press Enter`}
                              value={choiceInput[attr.name]}
                              onChange={(e) =>
                                setChoiceInput((ci) => ({
                                  ...ci,
                                  [attr.name]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (
                                  (e.key === "Enter" || e.key === ",") &&
                                  choiceInput[attr.name].trim()
                                ) {
                                  e.preventDefault();
                                  const val = choiceInput[attr.name].trim();
                                  if (!attributes[attr.name].includes(val)) {
                                    setAttributes((prev) => ({
                                      ...prev,
                                      [attr.name]: [
                                        ...(prev[attr.name] || []),
                                        val,
                                      ],
                                    }));
                                  }
                                  setChoiceInput((ci) => ({
                                    ...ci,
                                    [attr.name]: "",
                                  }));
                                }
                              }}
                            />
                          </div>
                        )}
                        {attr.type === "measurement" && (
                          <div>
                            {attr.fields.map((f) => (
                              <div
                                className='flex items-center gap-2 mb-2'
                                key={f.label}
                              >
                                <label className='w-16'>{f.label}</label>
                                <input
                                  type='number'
                                  className='border rounded px-2 py-1 w-20'
                                  placeholder={f.label}
                                  value={
                                    measurementFields[attr.name][f.label].value
                                  }
                                  onChange={(e) =>
                                    setMeasurementFields((flds) => ({
                                      ...flds,
                                      [attr.name]: {
                                        ...flds[attr.name],
                                        [f.label]: {
                                          ...flds[attr.name][f.label],
                                          value: e.target.value,
                                        },
                                      },
                                    }))
                                  }
                                />
                                <select
                                  className='border rounded px-2 py-1'
                                  value={
                                    measurementFields[attr.name][f.label].unit
                                  }
                                  onChange={(e) =>
                                    setMeasurementFields((flds) => ({
                                      ...flds,
                                      [attr.name]: {
                                        ...flds[attr.name],
                                        [f.label]: {
                                          ...flds[attr.name][f.label],
                                          unit: e.target.value,
                                        },
                                      },
                                    }))
                                  }
                                >
                                  {f.units.map((u) => (
                                    <option key={u}>{u}</option>
                                  ))}
                                </select>
                              </div>
                            ))}
                            <div className='flex gap-2 mt-2'>
                              <Button
                                type='button'
                                size='sm'
                                onClick={() => {
                                  setAttributes((prev) => ({
                                    ...prev,
                                    [attr.name]: {
                                      ...measurementFields[attr.name],
                                    },
                                  }));
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Variant Matrix */}
                    {attrsForVariants.length > 0 && (
                      <div className='mb-6 overflow-x-auto'>
                        <h3 className='font-semibold mb-2'>
                          Variants ({variants.length})
                        </h3>
                        <div className='flex gap-2 mb-2'>
                          <button
                            onClick={() =>
                              bulkFill("sku", (vt) =>
                                Object.values(vt.attributes).join("-")
                              )
                            }
                            className='px-2 py-1 bg-gray-200 rounded'
                            type='button'
                          >
                            Auto-SKU
                          </button>
                          <button
                            onClick={() => bulkFill("price", () => "0.00")}
                            className='px-2 py-1 bg-gray-200 rounded'
                            type='button'
                          >
                            Price 0.00
                          </button>
                          <button
                            onClick={() => bulkFill("stock", () => "0")}
                            className='px-2 py-1 bg-gray-200 rounded'
                            type='button'
                          >
                            Stock 0
                          </button>
                        </div>
                        <table className='min-w-full table-auto border'>
                          <thead>
                            <tr className='bg-gray-100'>
                              {Object.keys(variants[0]?.attributes || {}).map(
                                (k) => (
                                  <th
                                    key={k}
                                    className='px-2 py-1 border text-left text-sm'
                                  >
                                    {k}
                                  </th>
                                )
                              )}
                              <th className='px-2 py-1 border text-left text-sm'>
                                SKU
                              </th>
                              <th className='px-2 py-1 border text-left text-sm'>
                                Price
                              </th>
                              <th className='px-2 py-1 border text-left text-sm'>
                                Stock
                              </th>
                              <th className='px-2 py-1 border text-left text-sm'>
                                Image
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((vt, i) => (
                              <tr key={vt.id}>
                                {Object.values(vt.attributes).map(
                                  (val, idx) => (
                                    <td
                                      key={idx}
                                      className='px-2 py-1 border text-sm'
                                    >
                                      {val}
                                    </td>
                                  )
                                )}
                                <td className='px-2 py-1 border'>
                                  <input
                                    value={vt.sku}
                                    onChange={(e) =>
                                      updateVariantField(
                                        i,
                                        "sku",
                                        e.target.value
                                      )
                                    }
                                    className='w-full border rounded px-1 py-0.5 text-sm'
                                  />
                                </td>
                                <td className='px-2 py-1 border'>
                                  <input
                                    value={vt.price}
                                    onChange={(e) =>
                                      updateVariantField(
                                        i,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                    className='w-full border rounded px-1 py-0.5 text-sm'
                                  />
                                </td>
                                <td className='px-2 py-1 border'>
                                  <input
                                    value={vt.stock}
                                    onChange={(e) =>
                                      updateVariantField(
                                        i,
                                        "stock",
                                        e.target.value
                                      )
                                    }
                                    className='w-full border rounded px-1 py-0.5 text-sm'
                                  />
                                </td>
                                <td className='px-2 py-1 border'>
                                  <VariantDropZone variant={vt} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Shipping */}
              <AccordionItem value='shipping'>
                <AccordionTrigger className='text-lg'>
                  Shipping Details
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    {shippingMethods.map((m, i) => (
                      <div
                        key={m.id}
                        className='grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2'
                      >
                        <input
                          placeholder='Carrier'
                          value={m.name}
                          onChange={(e) =>
                            updateShipping(i, "name", e.target.value)
                          }
                          className='border rounded px-2 py-1'
                        />
                        <input
                          placeholder='Cost'
                          type='number'
                          step='0.01'
                          value={m.cost}
                          onChange={(e) =>
                            updateShipping(i, "cost", e.target.value)
                          }
                          className='border rounded px-2 py-1'
                        />
                        <input
                          placeholder='Delivery Time'
                          value={m.deliveryTime}
                          onChange={(e) =>
                            updateShipping(i, "deliveryTime", e.target.value)
                          }
                          className='border rounded px-2 py-1'
                        />
                        <button
                          type='button'
                          className='text-red-500 text-xs ml-2'
                          onClick={() => removeShipping(i)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addShipping}
                      className='text-sm text-primary underline'
                      type='button'
                    >
                      + Add Shipping
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className='pt-6'>
              <button
                type='submit'
                disabled={isLoading}
                className={`w-full py-2 rounded text-white ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {isLoading ? "Uploading..." : "Create Product"}
              </button>
            </div>
          </div>

          {/* RIGHT: Image upload/check panel */}
          <div className='w-80 bg-white rounded shadow p-6 flex flex-col items-start min-h-[320px]'>
            <label className='block font-medium mb-1'>
              Upload Product Images
            </label>
            <input
              type='file'
              multiple
              accept='image/*'
              onChange={handleUpload}
            />
            <div className='mt-4 flex flex-wrap gap-2'>
              {images.length === 0 && (
                <div className='text-gray-400 text-sm'>No images uploaded</div>
              )}
              {images.map((img) => (
                <DraggableImage key={img.id} img={img} />
              ))}
            </div>
            <div className='mt-2 text-xs text-gray-500'>
              You can drag images to variants in the Attributes section.
            </div>
          </div>
        </div>
      </DndContext>
    </form>
  );
}
