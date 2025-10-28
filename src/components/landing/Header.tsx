"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg">Miabesite</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="#about"
            className="text-sm font-medium transition-colors hover:text-primary hidden sm:inline-block"
          >
            À propos
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium transition-colors hover:text-primary hidden sm:inline-block"
          >
            Services
          </Link>
          <Button asChild variant="ghost" className="text-sm font-medium hidden sm:inline-flex">
            <Link href="/login">Connexion</Link>
          </Button>
          <Button asChild className="text-sm font-medium">
            <Link href="/signup">Inscription</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}