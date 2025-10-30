"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image component
// Removed getSupabaseStorageUrl as it's no longer needed for this specific asset

export function Footer() {
  return (
    <footer className="w-full py-8 bg-card text-card-foreground border-t px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left flex items-center gap-2">
          <Image src="/miabesite-logo.png" alt="Miabesite Logo" width={24} height={24} className="h-6 w-6" />
          <Link href="/" className="font-bold text-xl">Miabesite</Link>
          <p className="text-sm text-muted-foreground mt-2 sm:mt-0 sm:ml-4">
            Création automatique de sites web pour tous.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-sm">
          <Link href="/about" className="hover:text-primary transition-colors">
            À propos
          </Link>
          <Link href="#legal" className="hover:text-primary transition-colors">
            Mentions légales
          </Link>
          <Link href="#privacy" className="hover:text-primary transition-colors">
            Politique de confidentialité
          </Link>
        </nav>
      </div>
      <div className="container mx-auto text-center text-xs text-muted-foreground mt-6">
        © 2025 Miabesite. Tous droits réservés.
      </div>
    </footer>
  );
}