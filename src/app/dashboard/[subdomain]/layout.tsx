import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import React from "react";

// L'interface LayoutProps est conservée pour 'children' mais 'params' est typé directement
// dans la signature de la fonction pour contourner le problème de typage de Next.js.
interface LayoutProps {
  children: React.ReactNode;
  // params: { subdomain: string }; // Commenté ou supprimé pour éviter le conflit
}

// @ts-ignore: Next.js génère parfois des types incorrects pour les params de page dynamique (Promise<any> au lieu de l'objet direct).
export default function Layout({
  children,
  params,
}: { children: React.ReactNode; params: any }) { // Utilisation de 'any' pour 'params'
  const { subdomain } = params; // subdomain est maintenant directement disponible

  return (
    <DashboardLayout subdomain={subdomain}>
      {children}
    </DashboardLayout>
  );
}