"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { AIChatDialog } from './AIChatDialog'; // Import the chat dialog

export function AIChatBubble() {
  const [isOpen, setIsOpen] = React.useState(false);

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
      <AIChatDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}