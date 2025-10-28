"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface UserProfileButtonProps {
  onLinkClick?: () => void; // Callback for mobile menu closure
}

export function UserProfileButton({ onLinkClick }: UserProfileButtonProps) {
  const supabase = createClient();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchUserProfile() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        toast.error("Erreur lors du chargement du profil utilisateur.");
        return;
      }
      if (user) {
        setUserEmail(user.email || null); // Ensure it's string | null
        // Assuming avatar_url is stored in user_metadata
        setUserAvatarUrl(user.user_metadata?.avatar_url || null);
      }
    }
    fetchUserProfile();

    // Listen for auth state changes to update profile info
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUserEmail(session?.user?.email || null);
        setUserAvatarUrl(session?.user?.user_metadata?.avatar_url || null);
      } else if (event === 'SIGNED_OUT') {
        setUserEmail(null);
        setUserAvatarUrl(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe(); // Corrected access to unsubscribe
    };
  }, [supabase]);

  const getInitials = (email: string | null) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <Link href="/dashboard/profile" onClick={onLinkClick} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors">
      <Avatar className="h-9 w-9">
        {userAvatarUrl ? (
          <AvatarImage src={userAvatarUrl} alt="User Avatar" />
        ) : (
          <AvatarFallback>
            {userEmail ? getInitials(userEmail) : <UserIcon className="h-5 w-5" />}
          </AvatarFallback>
        )}
      </Avatar>
      <span className="text-sm font-medium text-foreground">
        {userEmail || "Mon Profil"}
      </span>
    </Link>
  );
}