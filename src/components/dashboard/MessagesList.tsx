"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, MailOpen, Mail, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Import French locale for date formatting
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils"; // Import cn utility

interface Message {
  id: string;
  created_at: string;
  site_id: string;
  sender_name: string | null;
  sender_email: string | null;
  sender_phone: string | null;
  service_interested: string | null;
  message: string;
  read_status: boolean;
  // New fields
  product_name: string | null;
  product_price: number | null;
  product_currency: string | null;
  quantity: number | null;
}

interface MessagesListProps {
  siteId: string;
}

export function MessagesList({ siteId }: MessagesListProps) {
  const supabase = createClient();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = React.useState<string | null>(null);
  const [updatingReadStatusId, setUpdatingReadStatusId] = React.useState<string | null>(null);

  const fetchMessages = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('site_messages')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      setError("Erreur lors du chargement des messages.");
      toast.error("Erreur lors du chargement des messages.");
    } else {
      setMessages(data as Message[]);
    }
    setLoading(false);
  }, [siteId, supabase]);

  React.useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleToggleReadStatus = async (messageId: string, currentStatus: boolean) => {
    setUpdatingReadStatusId(messageId);
    const { error } = await supabase
      .from('site_messages')
      .update({ read_status: !currentStatus })
      .eq('id', messageId);

    if (error) {
      toast.error("Erreur lors de la mise à jour du statut du message.");
      console.error("Error updating read status:", error);
    } else {
      toast.success(`Message marqué comme ${!currentStatus ? 'lu' : 'non lu'}.`);
      fetchMessages(); // Re-fetch messages to update UI
    }
    setUpdatingReadStatusId(null);
  };

  const handleDeleteMessage = async (messageId: string) => {
    setDeletingMessageId(messageId);
    const { error } = await supabase
      .from('site_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      toast.error("Erreur lors de la suppression du message.");
      console.error("Error deleting message:", error);
    } else {
      toast.success("Message supprimé avec succès.");
      fetchMessages(); // Re-fetch messages to update UI
    }
    setDeletingMessageId(null);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Boîte de Réception</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des messages...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Boîte de Réception</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-red-500">
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Boîte de Réception ({messages.filter(m => !m.read_status).length} non lus)</CardTitle>
        <Button onClick={fetchMessages} variant="outline" size="sm">
          <Loader2 className={cn("mr-2 h-4 w-4", loading && "animate-spin")} /> Actualiser
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg">Aucun message reçu pour ce site pour le moment.</p>
            <p className="text-sm">Partagez votre site pour commencer à recevoir des contacts !</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "border rounded-lg p-4 shadow-sm transition-all duration-200",
                  !message.read_status ? "bg-blue-50/50 border-blue-200" : "bg-background"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {!message.read_status ? (
                      <Mail className="h-5 w-5 text-blue-600" />
                    ) : (
                      <MailOpen className="h-5 w-5 text-gray-500" />
                    )}
                    <h4 className="font-semibold text-lg">
                      {message.sender_name || "Anonyme"}
                      {!message.read_status && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Nouveau</span>}
                    </h4>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(message.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  {message.sender_email && `Email: ${message.sender_email}`}
                  {message.sender_email && message.sender_phone && " | "}
                  {message.sender_phone && `Téléphone: ${message.sender_phone}`}
                </p>
                {message.service_interested && (
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Intéressé par :</span> {message.service_interested}
                  </p>
                )}
                {message.product_name && (
                  <div className="text-sm text-gray-700 mb-2 p-2 border rounded-md bg-gray-50">
                    <p><span className="font-medium">Commande :</span> {message.product_name}</p>
                    {message.quantity && <p><span className="font-medium">Quantité :</span> {message.quantity}</p>}
                    {message.product_price !== null && message.product_price !== undefined && (
                      <p><span className="font-medium">Prix :</span> {message.product_price} {message.product_currency}</p>
                    )}
                  </div>
                )}
                <p className="text-gray-800 leading-relaxed mb-4">{message.message}</p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleReadStatus(message.id, message.read_status)}
                    disabled={updatingReadStatusId === message.id}
                  >
                    {updatingReadStatusId === message.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : message.read_status ? (
                      <Mail className="mr-2 h-4 w-4" />
                    ) : (
                      <MailOpen className="mr-2 h-4 w-4" />
                    )}
                    {message.read_status ? "Marquer comme non lu" : "Marquer comme lu"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={deletingMessageId === message.id}>
                        {deletingMessageId === message.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement ce message de votre boîte de réception.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteMessage(message.id)}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}