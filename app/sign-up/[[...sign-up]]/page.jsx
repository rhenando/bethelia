// app/sign-up/[[...sign-up]]/page.jsx
"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <SignUp afterSignUpUrl='/dashboard' />;
}
