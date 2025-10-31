import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Chargement...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    );
}