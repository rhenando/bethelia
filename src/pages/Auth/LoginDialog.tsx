import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Smartphone,
  LogIn,
  Facebook,
  Chrome,
  QrCode,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginDialog() {
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState("password");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <button className='flex items-center gap-1 text-sm hover:text-[#2980b9] transition'>
          <LogIn size={18} />
          <span>Login</span>
        </button>
      </DialogTrigger>

      {/* Dialog Content */}
      <AnimatePresence>
        {open && (
          <DialogContent className='sm:max-w-sm rounded-xl p-0 overflow-hidden bg-white shadow-xl border border-gray-100 [&>button]:hidden'>
            <motion.div
              key='dialog'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Header - QR Code + Full-width Tabs */}
              <div className='flex items-center gap-4 px-5 py-3 border-b border-gray-200'>
                <QrCode size={38} className='text-[#2980b9]' />

                <Tabs value={tab} onValueChange={setTab} className='flex-1'>
                  <TabsList className='flex w-full bg-transparent border-0 justify-between'>
                    <TabsTrigger
                      value='password'
                      className={`flex-1 text-sm font-medium py-1 rounded-md transition-all ${
                        tab === "password"
                          ? "bg-white shadow text-gray-800 font-semibold border border-gray-200"
                          : "text-gray-400 hover:text-[#2980b9]"
                      }`}
                    >
                      Password
                    </TabsTrigger>

                    <div className='w-px h-5 bg-gray-200 mx-2 self-center' />

                    <TabsTrigger
                      value='phone'
                      className={`flex-1 text-sm font-medium py-1 rounded-md transition-all ${
                        tab === "phone"
                          ? "bg-white shadow text-gray-800 font-semibold border border-gray-200"
                          : "text-gray-400 hover:text-[#2980b9]"
                      }`}
                    >
                      Phone Number
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Login Form */}
              <div className='px-5 pt-4'>
                <Tabs value={tab}>
                  {/* Password Login */}
                  <TabsContent value='password' className='space-y-3'>
                    <input
                      type='text'
                      placeholder='Please enter your Phone or Email'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#2980b9] focus:outline-none'
                    />

                    <div className='relative'>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder='Please enter your password'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#2980b9] focus:outline-none pr-9'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-2.5 text-gray-400 hover:text-[#2980b9]'
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>

                    <div className='text-right'>
                      <Link
                        to='/forgot-password'
                        className='text-sm text-[#2980b9] hover:underline'
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button className='w-full bg-[#2980b9] hover:bg-[#2471a3] text-white font-semibold py-2 rounded-md transition flex items-center justify-center gap-2 shadow-sm'>
                      <LogIn size={17} />
                      LOGIN
                    </button>

                    <p className='text-center text-xs text-gray-600'>
                      Don’t have an account?{" "}
                      <Link
                        to='/register'
                        className='text-[#2980b9] font-medium hover:underline'
                      >
                        Sign up
                      </Link>
                    </p>
                  </TabsContent>

                  {/* Phone Login */}
                  <TabsContent value='phone' className='space-y-3'>
                    <input
                      type='text'
                      placeholder='Enter your phone number'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#2980b9] focus:outline-none'
                    />
                    <button className='w-full bg-[#2980b9] hover:bg-[#2471a3] text-white font-semibold py-2 rounded-md transition flex items-center justify-center gap-2 shadow-sm'>
                      <Smartphone size={17} />
                      Send Code
                    </button>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Divider + Social Login */}
              <div className='px-5 pb-4'>
                <div className='my-4 flex items-center'>
                  <div className='grow border-t border-gray-200'></div>
                  <span className='px-3 text-xs text-gray-400'>
                    Or, login with
                  </span>
                  <div className='grow border-t border-gray-200'></div>
                </div>

                <div className='flex justify-center gap-3'>
                  <button className='flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition text-sm'>
                    <Chrome className='w-4 h-4 text-[#db4437]' />
                    Google
                  </button>
                  <button className='flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition text-sm'>
                    <Facebook className='w-4 h-4 text-[#1877F2]' />
                    Facebook
                  </button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
