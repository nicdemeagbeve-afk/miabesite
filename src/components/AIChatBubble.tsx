"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { AIChatDialog } from './AIChatDialog'; // Import the chat dialog
import { useAIChatTrigger } from '@/hooks/use-ai-chat-trigger'; // Import the new hook

export function AIChatBubble() {
  const [isOpen, setIsOpen] = React.useState(false);
  const initialMessage = useAIChatTrigger(); // Get the triggered message

  // Automatically open the chat if an initial message is triggered and the chat is not already open
  React.useEffect(() => {
    if (initialMessage && !isOpen) {
      setIsOpen(true);
    }
  }, [initialMessage, isOpen]);

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-7 w-7" />
        <span className="sr-only">Ouvrir le chat IA</span>
      </Button>
      <AIChatDialog isOpen={isOpen} onClose={() => setIsOpen(false)} initialMessage={initialMessage} />
    </>
  );
}