"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-8 bg-card text-card-foreground border-t px-4"> {/* Added px-4 */}
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"> {/* Removed px-4 md:px-6, using container mx-auto */}
        <div className="text-center sm:text-left">
          <Link href="/" className="font-bold text-xl">Miabesite</Link>
          <p className="text-sm text-muted-foreground mt-2">
            Création automatique de sites web pour tous.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-sm">
          <Link href="#legal" className="hover:text-primary transition-colors">
            Mentions légales
          </Link>
          <Link href="#privacy" className="hover:text-primary transition-colors">
            Politique de confidentialité
          </Link>
        </nav>
      </div>
      <div className="container mx-auto text-center text-xs text-muted-foreground mt-6"> {/* Removed px-4 md:px-6, using container mx-auto */}
        © 2025 Miabesite. Tous droits réservés.
      </div>
    </footer>
  );
}