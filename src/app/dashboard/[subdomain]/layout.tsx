import React from "react";

// @ts-ignore: Next.js génère parfois des types incorrects pour les params de page dynamique (Promise<any> au lieu de l'objet direct).
export default function Layout({
  children,
  params, // params est toujours disponible ici si nécessaire par les enfants, mais pas pour DashboardLayout
}: { children: React.ReactNode; params: any }) {
  // Le DashboardLayout est maintenant rendu par le parent /dashboard/layout.tsx
  // Ce layout passe simplement ses enfants.
  return <>{children}</>;
}