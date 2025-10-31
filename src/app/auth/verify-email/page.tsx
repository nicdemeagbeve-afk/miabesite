import { Suspense } from 'react';
import VerifyEmailClient from '@/components/auth/VerifyEmailClient';

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted py-8">
      <Suspense fallback={<div className="text-center">Chargement...</div>}>
        <VerifyEmailClient />
      </Suspense>
    </div>
  );
}