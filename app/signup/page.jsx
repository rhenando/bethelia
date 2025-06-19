import SignupPage from "@/components/SignupPage"; // Desktop version
import MobileSignupPage from "@/components/mobile/MobileSignupPage"; // Mobile version

export default function SignupScreen() {
  return (
    <>
      <SignupPage />
      <MobileSignupPage />
    </>
  );
}
