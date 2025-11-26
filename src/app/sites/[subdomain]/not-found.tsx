import React from 'react';
import Link from 'next/link';
import { Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted text-center p-4">
      <Frown className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-4xl font-bold mb-4">Site Non Trouvé (404)</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Désolé, le site que vous recherchez n'existe pas ou n'est pas accessible.
      </p>
      <Link href="/" passHref>
        <Button asChild>
          <div>Retour à la page d'accueil</div>
        </Button>
      </Link>
    </div>
  );
}