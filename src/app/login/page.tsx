import type { Metadata } from "next";
import { FusionLogin } from "@/components/features/login/fusion-login";

export const metadata: Metadata = {
  title: "Entrar · DevJr 120",
};

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <FusionLogin />
    </div>
  );
}
