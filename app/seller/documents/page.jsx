"use client";
import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { useSelector } from "react-redux";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";

// Encode any doc name to a safe Firestore key
const getDocKey = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

const DEFAULT_DOCS = [
  "Business Permit",
  "BIR Certificate (2303)",
  "DTI/SEC Registration",
  "Mayor’s Permit",
  "Valid Government ID (Owner/Rep)",
  "Company Profile/Certification (optional)",
  "Banking Information (for payouts)",
  "Platform-specific Docs (e.g., signed agreement, product liability insurance)",
];

function sellerDocuments() {
  const authUser = useSelector((state) => state.auth.user);
  const uid = authUser?.uid;
  const [loading, setLoading] = useState(true);
  const [rep, setRep] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [documents, setDocuments] = useState([]);

  // Always fetch from Firestore on mount!
  useEffect(() => {
    if (!uid) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setRep(data.rep || "");
          setContact(data.phone || "");
          setEmail(data.email || "");
          const userDocs = data.documents || {};
          setDocuments(
            DEFAULT_DOCS.map((name) => {
              const key = getDocKey(name);
              const entry = userDocs[key];
              return entry
                ? { name, ...entry }
                : { name, status: "Not Uploaded", url: null, uploaded: null };
            })
          );
        }
      } catch (err) {
        toast.error("Failed to fetch data.");
      }
      setLoading(false);
    };
    fetchData();
  }, [uid]);

  // Update rep/contact/email
  const handleInfoSave = async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        rep,
        phone: contact,
        email,
      });
      toast.success("Information updated!");
    } catch (err) {
      toast.error("Failed to update info.");
    }
    setLoading(false);
  };

  // Improved: Handle file upload with safe filenames and Firestore keys
  const handleUpload = async (docName, file) => {
    if (!uid || !file) {
      toast.error("No file selected.");
      return;
    }
    setLoading(true);

    try {
      const safeName = getDocKey(docName);
      const storageRef = ref(
        storage,
        `sellers/${uid}/documents/${safeName}_${Date.now()}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const uploaded = new Date().toISOString();

      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        [`documents.${safeName}`]: { status: "Uploaded", url, uploaded },
      });

      // Refetch from Firestore to ensure state is fresh after upload
      const snap = await getDoc(userRef);
      const userDocs = snap.exists() ? snap.data().documents || {} : {};
      setDocuments(
        DEFAULT_DOCS.map((name) => {
          const key = getDocKey(name);
          const entry = userDocs[key];
          return entry
            ? { name, ...entry }
            : { name, status: "Not Uploaded", url: null, uploaded: null };
        })
      );

      toast.success(`${docName} uploaded!`);
    } catch (err) {
      toast.error("Failed to upload document.");
    }
    setLoading(false);
  };

  if (loading)
    return <div className='text-gray-400 text-center py-12'>Loading...</div>;

  return (
    <div>
      <h2 className='font-bold text-lg mb-2 flex items-center gap-2'>
        <Package className='w-5 h-5 text-[var(--primary)]' />
        Company Legal & Business Documents
      </h2>

      <div className='mb-2 text-gray-500'>
        Upload/manage your required documents and keep your authorized
        representative’s info up to date for seller verification and payouts.
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
            placeholder='e.g. seller@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          onClick={handleInfoSave}
          className='mt-4 bg-[var(--primary)] text-white rounded px-6 py-2 text-sm font-semibold hover:bg-blue-700 transition'
        >
          Save Info
        </button>
      </div>

      {/* Documents Upload List */}
      <div className='space-y-3'>
        {documents.map((doc, i) => (
          <div
            key={doc.name}
            className='border rounded-lg p-3 flex justify-between items-center'
          >
            <div>
              <div className='font-medium'>{doc.name}</div>
              <div className='text-xs text-gray-400'>
                {doc.uploaded
                  ? `Uploaded: ${new Date(doc.uploaded).toLocaleDateString()}`
                  : "Not uploaded yet"}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {doc.status === "Uploaded" && doc.url ? (
                <a
                  href={doc.url}
                  className='text-xs text-green-700 underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View
                </a>
              ) : null}
              <label className='px-3 py-1 rounded text-xs font-semibold cursor-pointer bg-[var(--primary)] text-white hover:bg-blue-700 transition'>
                {doc.status === "Uploaded" ? "Replace" : "Upload"}
                <input
                  type='file'
                  accept='application/pdf,image/*'
                  className='hidden'
                  onChange={(e) => handleUpload(doc.name, e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default sellerDocuments;
