import LoginPage from "@/components/LoginPage"; // Desktop version
import MobileLoginPage from "@/components/mobile/MobileLoginPage"; // Mobile version

export default function LoginScreen() {
  return (
    <>
      <LoginPage />
      <MobileLoginPage />
    </>
  );
}
