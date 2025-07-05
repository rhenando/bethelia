// components/SupplierDocuments.jsx
"use client";
import React, { useState } from "react";
import { Package } from "lucide-react";

const docs = [
  {
    name: "Business Permit",
    status: "Not Uploaded",
    url: null,
    uploaded: null,
  },
  {
    name: "BIR Certificate (2303)",
    status: "Not Uploaded",
    url: null,
    uploaded: null,
  },
  {
    name: "DTI/SEC Registration",
    status: "Not Uploaded",
    url: null,
    uploaded: null,
  },
  { name: "Mayor’s Permit", status: "Not Uploaded", url: null, uploaded: null },
  {
    name: "Valid Government ID (Owner/Rep)",
    status: "Not Uploaded",
    url: null,
    uploaded: null,
  },
  {
    name: "Company Profile/Certification (optional)",
    status: "Not Uploaded",
    url: null,
    uploaded: null,
  },
  {
    name: "Banking Information (for payouts)",
    status: "Not Uploaded",
    url: null,
    uploaded: null,
  },
  {
    name: "Platform-specific Docs (e.g., signed agreement, product liability insurance)",
    status: "Not Uploaded",
    url: null,
    uploaded: null,
  },
];

function SupplierDocuments() {
  const [rep, setRep] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div>
      <h2 className='font-bold text-lg mb-2 flex items-center gap-2'>
        <Package className='w-5 h-5 text-[var(--primary)]' />
        Company Legal & Business Documents
      </h2>

      <div className='mb-2 text-gray-500'>
        Upload/manage your required documents and keep your authorized
        representative’s info up to date for supplier verification and payouts.
      </div>

      {/* Basic Info Fields */}
      <div className='bg-gray-50 border rounded-lg p-4 mb-6'>
        <div className='mb-3'>
          <label className='text-xs font-semibold text-gray-700 mb-1 block'>
            Representative Name
          </label>
          <input
            type='text'
            className='w-full rounded px-3 py-2 border text-sm'
            placeholder='e.g. Maria Reyes'
            value={rep}
            onChange={(e) => setRep(e.target.value)}
          />
        </div>
        <div className='mb-3'>
          <label className='text-xs font-semibold text-gray-700 mb-1 block'>
            Contact Number
          </label>
          <input
            type='tel'
            className='w-full rounded px-3 py-2 border text-sm'
            placeholder='e.g. 09xx-xxx-xxxx'
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div>
          <label className='text-xs font-semibold text-gray-700 mb-1 block'>
            Email Address
          </label>
          <input
            type='email'
            className='w-full rounded px-3 py-2 border text-sm'
            placeholder='e.g. supplier@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Documents Upload List */}
      <div className='space-y-3'>
        {docs.map((doc, i) => (
          <div
            key={i}
            className='border rounded-lg p-3 flex justify-between items-center'
          >
            <div>
              <div className='font-medium'>{doc.name}</div>
              <div className='text-xs text-gray-400'>
                {doc.uploaded
                  ? `Uploaded: ${doc.uploaded}`
                  : "Not uploaded yet"}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {doc.status === "Uploaded" ? (
                <a
                  href={doc.url}
                  className='text-xs text-green-700 underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View
                </a>
              ) : null}
              <button
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  doc.status === "Uploaded"
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[var(--primary)] text-white hover:bg-blue-700"
                }`}
              >
                {doc.status === "Uploaded" ? "Replace" : "Upload"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupplierDocuments;
