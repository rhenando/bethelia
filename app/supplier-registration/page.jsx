"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth, db, provider } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SupplierRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ownerName: "",
    businessName: "",
    businessAddress: "",
    mobileNumber: "",
    gcashNumber: "",
    dtiPermit: "",
    tinNumber: "",
    mayorPermit: "",
    nationalId: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numberRegex = /^[0-9]+$/;

    if (!formData.ownerName.trim())
      errors.ownerName = "Owner's name is required";

    if (!formData.businessName.trim())
      errors.businessName = "Business name is required";

    if (!formData.businessAddress.trim())
      errors.businessAddress = "Business address is required";

    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!numberRegex.test(formData.mobileNumber)) {
      errors.mobileNumber = "Mobile number must be numeric";
    }

    if (formData.gcashNumber && !numberRegex.test(formData.gcashNumber)) {
      errors.gcashNumber = "Gcash number must be numeric";
    }

    if (formData.tinNumber && !numberRegex.test(formData.tinNumber)) {
      errors.tinNumber = "TIN must be numeric";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Email format is invalid";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const isGoogleSignUpEnabled =
    formData.ownerName.trim() !== "" &&
    formData.businessName.trim() !== "" &&
    formData.mobileNumber.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        ...formData,
        role: "supplier",
        status: "approved",
        createdAt: serverTimestamp(),
      });

      toast.success("Registration successful! Redirecting...");
      router.push("/supplier/welcome");

      setFormData({
        ownerName: "",
        businessName: "",
        businessAddress: "",
        mobileNumber: "",
        gcashNumber: "",
        dtiPermit: "",
        tinNumber: "",
        mayorPermit: "",
        nationalId: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error("Registration error:", err.message);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isGoogleSignUpEnabled) {
      toast.error("Please fill the form before continuing with Google.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        ...formData,
        email: user.email,
        role: "supplier",
        status: "approved",
        createdAt: serverTimestamp(),
      });

      toast.success("Signed up successfully using Google!");
      router.push("/supplier/welcome");
      setFormData({
        ownerName: "",
        businessName: "",
        businessAddress: "",
        mobileNumber: "",
        gcashNumber: "",
        dtiPermit: "",
        tinNumber: "",
        mayorPermit: "",
        nationalId: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error("Google sign-in error:", err.message);
      toast.error(err.message || "Google sign-in failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (name, label, type = "text", required = false) => {
    if (name === "password") {
      return (
        <div>
          <label className='block text-sm font-medium mb-1'>{label}</label>
          <div className='relative'>
            <Input
              name='password'
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required={required}
              className='pr-16'
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-blue-600'
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {formErrors.password && (
            <p className='text-sm text-red-600 mt-1'>{formErrors.password}</p>
          )}
        </div>
      );
    }

    return (
      <div>
        <label className='block text-sm font-medium mb-1'>{label}</label>
        <Input
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleChange}
          required={required}
        />
        {formErrors[name] && (
          <p className='text-sm text-red-600 mt-1'>{formErrors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <main className='min-h-[80vh] w-full bg-white px-4 py-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-2xl font-semibold text-center sm:text-left mb-6'>
          Register as a Supplier
        </h1>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {renderInput(
              "ownerName",
              "Owner's/Representative Name",
              "text",
              true
            )}
            {renderInput("businessName", "Business Name", "text", true)}
            {renderInput("businessAddress", "Business Address", "text", true)}
            {renderInput("mobileNumber", "Mobile Number", "text", true)}
            {renderInput("gcashNumber", "Gcash Number")}
            {renderInput("dtiPermit", "DTI Permit")}
            {renderInput("tinNumber", "TIN Number")}
            {renderInput("mayorPermit", "Mayor's Permit")}
            {renderInput("nationalId", "National ID / Driver's License")}
            {renderInput("email", "Email / Username", "email", true)}
            {renderInput("password", "Password", "password", true)}
          </div>

          <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              type='submit'
              className='bg-blue-600 text-white w-full sm:w-auto'
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>

            <Button
              type='button'
              variant='outline'
              onClick={handleGoogleSignUp}
              className='w-full sm:w-auto'
              disabled={!isGoogleSignUpEnabled}
            >
              Sign Up with Google
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
