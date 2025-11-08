"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

interface AIRewriteButtonProps {
  fieldName: string; // The name of the form field to rewrite
  currentText: string; // The current text content of the field
  onRewrite: (newText: string) => void; // Callback to update the form field
  subdomain?: string; // Optional: for context if AI needs to know which site
}

export function AIRewriteButton({ fieldName, currentText, onRewrite, subdomain }: AIRewriteButtonProps) {
  const [isRewriting, setIsRewriting] = React.useState(false);
  const pathname = usePathname();

  const currentSiteSubdomain = subdomain || React.useMemo(() => {
    const match = pathname.match(/^\/dashboard\/([^\/]+)/);
    return match ? match[1] : undefined;
  }, [pathname]);

  const handleRewrite = async () => {
    if (!currentText || currentText.trim() === '') {
      toast.info("Veuillez saisir du texte à réécrire.");
      return;
    }

    setIsRewriting(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_code: "generate_rewritten_text",
          tool_args: {
            current_text: currentText,
            field_name: fieldName,
            subdomain: currentSiteSubdomain,
          },
          // No 'message' or 'history' needed for direct tool call
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la réécriture par l\'IA.');
      }

      const data = await response.json();
      if (data.response) {
        onRewrite(data.response);
        toast.success("Texte réécrit avec succès par Maître Control !");
      } else {
        toast.error("L'IA n'a pas pu générer de nouveau texte.");
      }
    } catch (error: any) {
      console.error("AI Rewrite Error:", error);
      toast.error(error.message || "Une erreur inattendue est survenue lors de la réécriture.");
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleRewrite}
      disabled={isRewriting}
      className="flex items-center gap-1"
    >
      {isRewriting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Réécrire avec l'IA
    </Button>
  );
}