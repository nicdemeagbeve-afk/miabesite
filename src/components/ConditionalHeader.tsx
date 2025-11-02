"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/landing/Header";
import React from "react";

export function ConditionalHeader() {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (hideHeader) {
    return null;
  }

  return <Header />;
}