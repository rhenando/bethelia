"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function MyProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  // Load current profile
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(data.displayName || "");
          setEmail(data.email || user.email || "");
          setPhone(data.phone || "");
          setRole(data.role || "");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile.");
      }
    };
    load();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "users", user.uid);
      const updated = {
        displayName,
        email,
        phone,
        role,
        updatedAt: serverTimestamp(),
      };
      await setDoc(docRef, updated, { merge: true });
      dispatch(setUser({ ...user, ...updated }));
      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <h1 className='text-2xl font-bold mb-4'>My Profile</h1>
      <Card className='max-w-lg mx-auto'>
        <CardContent className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className='mt-1'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Phone
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='mt-1'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Role
            </label>
            <Input value={role} disabled className='mt-1 bg-gray-100' />
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className='w-full mt-4'
          >
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
