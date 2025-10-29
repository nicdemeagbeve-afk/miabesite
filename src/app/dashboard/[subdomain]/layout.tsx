import React from "react";

// @ts-ignore: Next.js génère parfois des types incorrects pour les params de page dynamique (Promise<any> au lieu de l'objet direct).
export default function Layout({
  children,
  params, // params est toujours disponible ici si nécessaire par les enfants
}: { children: React.ReactNode; params: any }) {
  // Ce layout passe simplement ses enfants.
  // Le DashboardLayout est rendu par le layout parent (/dashboard/layout.tsx).
  return <>{children}</>;
}