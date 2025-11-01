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
  const [userName, setUserName] = React.useState<string | null>(null);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = React.useState<string | null>(null);

  const fetchUserProfile = React.useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      setUserName(null);
      setUserEmail(null);
      setUserAvatarUrl(null);
      return;
    }
    if (user) {
      // Fetch additional profile data from the 'profiles' table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile data:", profileError);
        // Fallback to auth.user.email if profile data is not available
        setUserName(user.email || null);
        setUserEmail(user.email || null);
        setUserAvatarUrl(null);
      } else {
        setUserName(profile?.full_name || user.email || null);
        setUserEmail(user.email || null);
        setUserAvatarUrl(profile?.avatar_url || null);
      }
    } else {
      setUserName(null);
      setUserEmail(null);
      setUserAvatarUrl(null);
    }
  }, [supabase]);

  React.useEffect(() => {
    fetchUserProfile();

    // Listen for auth state changes to update profile info
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUserName(null);
        setUserEmail(null);
        setUserAvatarUrl(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);

  const getInitials = (nameOrEmail: string | null) => {
    if (!nameOrEmail) return "U";
    return nameOrEmail.charAt(0).toUpperCase();
  };

  return (
    <Link href="/dashboard/profile" onClick={onLinkClick} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
      <Avatar className="h-9 w-9">
        {userAvatarUrl ? (
          <AvatarImage src={userAvatarUrl} alt="User Avatar" />
        ) : (
          <AvatarFallback>
            {userName ? getInitials(userName) : <UserIcon className="h-5 w-5" />}
          </AvatarFallback>
        )}
      </Avatar>
      <span className="text-sm font-medium text-foreground">
        {userName || "Mon Profil"}
      </span>
    </Link>
  );
}