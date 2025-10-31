import { Suspense } from "react";
import HomePageClient from "@/components/HomePageClient";

// Ce composant s'affichera pendant que le contenu principal charge
function LoadingFallback() {
  return <div>Chargement de la page, veuillez patienter un peu...</div>;
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePageClient />
    </Suspense>
  );
}