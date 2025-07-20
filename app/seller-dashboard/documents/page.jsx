"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FileText, Briefcase, Store, Banknote, Shield } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Helper to create a safe key for Firestore maps
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
];

export default function SellerDocumentsPage() {
  const authUser = useSelector((state) => state.auth.user);
  const uid = authUser?.uid;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    phoneNumber: "",
    email: "",
    businessDetails: {
      legalName: "",
      businessType: "individual",
      registrationNumber: "",
      vatNumber: "",
    },
    policies: {
      returnPeriod: 14,
      refundPolicy: "",
      warrantyInfo: "",
    },
    bankAccount: "",
  });
  const [documents, setDocuments] = useState([]);

  // Fetch data from the 'sellers' collection
  useEffect(() => {
    if (!uid) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const sellerRef = doc(db, "sellers", uid);
        const snap = await getDoc(sellerRef);

        if (snap.exists()) {
          const data = snap.data();
          setFormData({
            storeName: data.storeName || "",
            storeDescription: data.storeDescription || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            businessDetails: {
              legalName: data.businessDetails?.legalName || "",
              businessType: data.businessDetails?.businessType || "individual",
              registrationNumber:
                data.businessDetails?.registrationNumber || "",
              vatNumber: data.businessDetails?.vatNumber || "",
            },
            policies: {
              returnPeriod: data.policies?.returnPeriod || 14,
              refundPolicy: data.policies?.refundPolicy || "",
              warrantyInfo: data.policies?.warrantyInfo || "",
            },
            bankAccount: data.bankAccount || "",
          });

          const sellerDocs = data.verificationDocuments || {};
          setDocuments(
            DEFAULT_DOCS.map((name) => {
              const key = getDocKey(name);
              const entry = sellerDocs[key];
              return entry
                ? { name, ...entry }
                : { name, status: "Not Uploaded", url: null, uploaded: null };
            })
          );
        }
      } catch (err) {
        toast.error("Failed to fetch seller data.");
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [uid]);

  const handleFormChange = (section, field, value) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleInfoSave = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      const sellerRef = doc(db, "sellers", uid);
      await updateDoc(sellerRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      toast.success("Information updated successfully!");
    } catch (err) {
      toast.error("Failed to update information.");
      console.error(err);
    }
    setSaving(false);
  };

  // --- UPDATED: Complete file upload logic is now here ---
  const handleUpload = async (docName, file) => {
    if (!uid || !file) {
      toast.error("No file selected.");
      return;
    }
    setSaving(true);
    const toastId = toast.loading(`Uploading ${docName}...`);

    try {
      const safeName = getDocKey(docName);
      const storageRef = ref(
        storage,
        `sellers/${uid}/documents/${safeName}_${Date.now()}`
      );

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const uploaded = new Date().toISOString();

      const sellerRef = doc(db, "sellers", uid);
      await updateDoc(sellerRef, {
        [`verificationDocuments.${safeName}`]: {
          status: "Uploaded",
          url,
          uploaded,
        },
        updatedAt: serverTimestamp(),
      });

      // Update local state to reflect the change immediately
      setDocuments((prevDocs) =>
        prevDocs.map((d) =>
          d.name === docName ? { ...d, status: "Uploaded", url, uploaded } : d
        )
      );

      toast.success(`${docName} uploaded!`, { id: toastId });
    } catch (err) {
      toast.error("Failed to upload document.", { id: toastId });
      console.error(err);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className='text-gray-400 text-center py-12'>Loading...</div>;
  }

  return (
    <div className='space-y-8'>
      {/* Store Information Section */}
      <div className='space-y-4'>
        <h2 className='font-bold text-lg flex items-center gap-2'>
          <Store className='w-5 h-5 text-blue-600' />
          Store Information
        </h2>
        <div className='bg-gray-50 border rounded-lg p-4 space-y-3'>
          <div>
            <Label htmlFor='storeName'>Store Name</Label>
            <Input
              id='storeName'
              value={formData.storeName}
              onChange={(e) =>
                handleFormChange(null, "storeName", e.target.value)
              }
              placeholder='e.g. Bethelia Official Store'
            />
          </div>
          <div>
            <Label htmlFor='storeDescription'>Store Description</Label>
            <Textarea
              id='storeDescription'
              value={formData.storeDescription}
              onChange={(e) =>
                handleFormChange(null, "storeDescription", e.target.value)
              }
              placeholder='A short description of your store'
            />
          </div>
        </div>
      </div>

      {/* Business Details Section */}
      <div className='space-y-4'>
        <h2 className='font-bold text-lg flex items-center gap-2'>
          <Briefcase className='w-5 h-5 text-blue-600' />
          Business Details
        </h2>
        <div className='bg-gray-50 border rounded-lg p-4 space-y-3'>
          <div>
            <Label htmlFor='legalName'>Legal Name / Representative</Label>
            <Input
              id='legalName'
              value={formData.businessDetails.legalName}
              onChange={(e) =>
                handleFormChange("businessDetails", "legalName", e.target.value)
              }
              placeholder='Full legal name'
            />
          </div>
          <div>
            <Label htmlFor='businessType'>Business Type</Label>
            <select
              id='businessType'
              value={formData.businessDetails.businessType}
              onChange={(e) =>
                handleFormChange(
                  "businessDetails",
                  "businessType",
                  e.target.value
                )
              }
              className='w-full border rounded px-3 py-2 text-sm'
            >
              <option value='individual'>Individual</option>
              <option value='sole_proprietorship'>Sole Proprietorship</option>
              <option value='partnership'>Partnership</option>
              <option value='corporation'>Corporation</option>
            </select>
          </div>
          <div>
            <Label htmlFor='regNumber'>Registration Number (DTI/SEC)</Label>
            <Input
              id='regNumber'
              value={formData.businessDetails.registrationNumber}
              onChange={(e) =>
                handleFormChange(
                  "businessDetails",
                  "registrationNumber",
                  e.target.value
                )
              }
            />
          </div>
          <div>
            <Label htmlFor='vatNumber'>VAT/TIN Number</Label>
            <Input
              id='vatNumber'
              value={formData.businessDetails.vatNumber}
              onChange={(e) =>
                handleFormChange("businessDetails", "vatNumber", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Policies Section */}
      <div className='space-y-4'>
        <h2 className='font-bold text-lg flex items-center gap-2'>
          <Shield className='w-5 h-5 text-blue-600' />
          Store Policies
        </h2>
        <div className='bg-gray-50 border rounded-lg p-4 space-y-3'>
          <div>
            <Label htmlFor='returnPeriod'>Return Period (in days)</Label>
            <Input
              id='returnPeriod'
              type='number'
              value={formData.policies.returnPeriod}
              onChange={(e) =>
                handleFormChange(
                  "policies",
                  "returnPeriod",
                  Number(e.target.value)
                )
              }
            />
          </div>
          <div>
            <Label htmlFor='refundPolicy'>Refund Policy</Label>
            <Textarea
              id='refundPolicy'
              value={formData.policies.refundPolicy}
              onChange={(e) =>
                handleFormChange("policies", "refundPolicy", e.target.value)
              }
              placeholder='Describe your refund policy'
            />
          </div>
          <div>
            <Label htmlFor='warrantyInfo'>Warranty Information</Label>
            <Textarea
              id='warrantyInfo'
              value={formData.policies.warrantyInfo}
              onChange={(e) =>
                handleFormChange("policies", "warrantyInfo", e.target.value)
              }
              placeholder='Describe your warranty policy'
            />
          </div>
        </div>
      </div>

      {/* Payout Information Section */}
      <div className='space-y-4'>
        <h2 className='font-bold text-lg flex items-center gap-2'>
          <Banknote className='w-5 h-5 text-blue-600' />
          Payout Information
        </h2>
        <div className='bg-gray-50 border rounded-lg p-4 space-y-3'>
          <div>
            <Label htmlFor='bankAccount'>Bank Account Details</Label>
            <Textarea
              id='bankAccount'
              value={formData.bankAccount}
              onChange={(e) =>
                handleFormChange(null, "bankAccount", e.target.value)
              }
              placeholder='Bank Name, Account Number, Account Name'
            />
          </div>
        </div>
      </div>

      <Button onClick={handleInfoSave} disabled={saving} className='w-full'>
        {saving ? "Saving All Information..." : "Save All Information"}
      </Button>

      {/* Document Uploads Section */}
      <div className='space-y-4 mt-8'>
        <h2 className='font-bold text-lg flex items-center gap-2'>
          <FileText className='w-5 h-5 text-blue-600' />
          Required Documents
        </h2>
        <div className='space-y-3'>
          {documents.map((docItem) => (
            <div
              key={docItem.name}
              className='border rounded-lg p-3 flex justify-between items-center bg-white'
            >
              <div>
                <div className='font-medium text-sm'>{docItem.name}</div>
                <div className='text-xs text-gray-400'>
                  {docItem.uploaded
                    ? `Uploaded: ${new Date(
                        docItem.uploaded
                      ).toLocaleDateString()}`
                    : "Not uploaded yet"}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {docItem.status === "Uploaded" && docItem.url && (
                  <a
                    href={docItem.url}
                    className='text-xs text-green-700 underline'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    View
                  </a>
                )}
                <Label className='px-3 py-1.5 rounded text-xs font-semibold cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition'>
                  {docItem.status === "Uploaded" ? "Replace" : "Upload"}
                  <input
                    type='file'
                    accept='application/pdf,image/*'
                    className='hidden'
                    onChange={(e) =>
                      handleUpload(docItem.name, e.target.files?.[0])
                    }
                    disabled={saving}
                  />
                </Label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
