"use client";

import React from "react";
import { UserProfileSettings } from "@/components/dashboard/UserProfileSettings";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchUserEmail() {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("Veuillez vous connecter pour gérer votre profil.");
        router.push('/login');
        return;
      }
      setUserEmail(user.email ?? null); // Fix: Convert undefined to null
      setLoading(false);
    }
    fetchUserEmail();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Mon Profil</h1>
        <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">Mon Profil</h1>
      <div className="max-w-3xl mx-auto lg:mx-0 space-y-8">
        <UserProfileSettings initialEmail={userEmail || ""} />
      </div>
    </div>
  );
}