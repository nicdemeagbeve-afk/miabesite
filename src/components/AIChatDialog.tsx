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
import { Bot, User, Send, Loader2, Mic, StopCircle } from 'lucide-react'; // Import Mic and StopCircle
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  // Audio recording states
  const [isRecording, setIsRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);

  const currentSubdomain = React.useMemo(() => {
    const match = pathname.match(/^\/dashboard\/([^\/]+)/);
    return match ? match[1] : undefined;
  }, [pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioChunks([]); // Clear chunks for next recording
        await sendAudioForTranscription(audioBlob);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.info("Enregistrement audio démarré...");
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      toast.error("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop()); // Stop microphone access
      setIsRecording(false);
      toast.info("Enregistrement audio terminé. Transcription en cours...");
    }
  };

  const sendAudioForTranscription = async (audioBlob: Blob) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');

    try {
      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur de transcription audio : ' + response.statusText);
      }

      const data = await response.json();
      if (data.transcribedText) {
        setInput(data.transcribedText); // Set transcribed text to input field
        // Automatically send the message after transcription
        // We need to ensure handleSendMessage is called with the new input state
        // A small delay or direct call with the text is needed.
        handleSendMessage({ preventDefault: () => {} } as React.FormEvent, data.transcribedText);
      } else {
        toast.error("Aucun texte transcrit reçu.");
      }
    } catch (error: any) {
      console.error('Erreur lors de la transcription audio:', error);
      toast.error('Impossible de transcrire l\'audio. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent, transcribedText?: string) => {
    e.preventDefault();
    const messageToSend = transcribedText || input;
    if (messageToSend.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Clear input after sending

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
          message: messageToSend, 
          history: historyForGemini,
          current_site_subdomain: currentSubdomain,
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
            disabled={isLoading || isRecording}
            className="flex-1"
          />
          {isRecording ? (
            <Button type="button" onClick={stopRecording} disabled={isLoading} variant="destructive">
              <StopCircle className="h-4 w-4 mr-2 animate-pulse" /> Arrêter
            </Button>
          ) : (
            <Button type="button" onClick={startRecording} disabled={isLoading} variant="outline">
              <Mic className="h-4 w-4" />
              <span className="sr-only">Enregistrer audio</span>
            </Button>
          )}
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