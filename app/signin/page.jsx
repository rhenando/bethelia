"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquareText, Smartphone } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUpDialog() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSMSCode = () => {
    if (!agreed) {
      toast.error("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }
    if (!phone) {
      toast.error("Please enter your phone number.");
      return;
    }
    toast.success(`SMS code sent to ${phone}`);
  };

  const handleWhatsAppCode = () => {
    if (!agreed) {
      toast.error("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }
    if (!phone) {
      toast.error("Please enter your phone number.");
      return;
    }
    toast.success(`WhatsApp code sent to ${phone}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-blue-600 text-white'>Sign Up</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px] rounded-lg'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            Sign up
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 mt-2'>
          {/* Phone Number */}
          <div>
            <div className='flex items-center border border-gray-300 rounded-md overflow-hidden'>
              <span className='bg-gray-100 px-3 text-sm text-gray-600'>
                PH+63
              </span>
              <Input
                type='tel'
                placeholder='Please enter your phone number'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='flex-1 border-0 focus:ring-0'
              />
            </div>
          </div>

          {/* Terms */}
          <div className='flex items-start space-x-2 text-sm'>
            <input
              id='terms'
              type='checkbox'
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className='mt-1'
            />
            <label htmlFor='terms'>
              By creating and/or using your account, you agree to our{" "}
              <a href='#' className='text-blue-600 underline'>
                Terms of Use
              </a>{" "}
              and{" "}
              <a href='#' className='text-blue-600 underline'>
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* SMS & WhatsApp */}
          <div className='space-y-2'>
            <Button
              className='w-full bg-orange-500 hover:bg-orange-600 text-white'
              onClick={handleSMSCode}
            >
              <Smartphone className='w-4 h-4 mr-2' />
              Send code via SMS
            </Button>
            <Button
              variant='outline'
              className='w-full text-green-600 border-green-600 hover:bg-green-50'
              onClick={handleWhatsAppCode}
            >
              <MessageSquareText className='w-4 h-4 mr-2 text-green-600' />
              Send code via WhatsApp
            </Button>
          </div>

          <p className='text-sm text-center'>
            Already have an account?{" "}
            <Link href='/login' className='text-blue-600 underline'>
              Log in Now
            </Link>
          </p>

          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Separator className='flex-1' />
            <span>Or, sign up with</span>
            <Separator className='flex-1' />
          </div>

          {/* Social Buttons */}
          <div className='flex justify-center gap-4'>
            <button className='p-2 border rounded-full hover:bg-gray-100'>
              <img src='/google-icon.svg' alt='Google' className='w-5 h-5' />
            </button>
            <button className='p-2 border rounded-full hover:bg-gray-100'>
              <img
                src='/facebook-icon.svg'
                alt='Facebook'
                className='w-5 h-5'
              />
            </button>
          </div>
        </div>

        <DialogFooter className='mt-4' />
      </DialogContent>
    </Dialog>
  );
}
