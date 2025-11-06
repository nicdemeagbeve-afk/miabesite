"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation'; // Import usePathname

interface AIChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  parts?: { text: string }[];
  functionCall?: { name: string; args: any };
  functionResponse?: { name: string; response: any };
}

export function AIChatDialog({ isOpen, onClose }: AIChatDialogProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // Initialize usePathname

  // Extract subdomain from the current path if it's a dashboard site page
  const currentSubdomain = React.useMemo(() => {
    const match = pathname.match(/^\/dashboard\/([^\/]+)/);
    return match ? match[1] : undefined;
  }, [pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessageText = input;
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: userMessageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const historyForGemini = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessageText, 
          history: historyForGemini,
          current_site_subdomain: currentSubdomain, // Pass the current subdomain
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur de l\'IA : ' + response.statusText);
      }

      const data = await response.json();
      const aiMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Erreur lors de la communication avec l\'IA:', error);
      toast.error('Impossible de contacter l\'IA. Veuillez réessayer.');
      const errorMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: "Désolé, une erreur est survenue. Veuillez réessayer." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" /> Chat IA Miabesite
          </DialogTitle>
          <DialogDescription>
            Posez vos questions ou demandez des modifications pour votre compte ou vos sites.
            {currentSubdomain && (
              <span className="block text-xs text-muted-foreground mt-1">
                Contexte actuel : Site <span className="font-semibold text-primary">{currentSubdomain}</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 p-4 border rounded-md bg-muted/20 mb-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground italic">
                Bonjour ! Comment puis-je vous aider aujourd'hui ?
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3",
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'ai' && (
                  <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                )}
                <div
                  className={cn(
                    "max-w-[70%] p-3 rounded-lg shadow-sm",
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground border'
                  )}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-background text-foreground border">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Tapez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || input.trim() === ''}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Envoyer</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}