import { z } from "zod";

export const messageSchema = z.object({
  sender_name: z.string().max(100, "Le nom ne peut pas dépasser 100 caractères.").optional().or(z.literal('')),
  sender_email: z.string().email("Veuillez entrer une adresse email valide.").max(100, "L'email ne peut pas dépasser 100 caractères.").optional().or(z.literal('')),
  sender_phone: z.string().regex(/^\+?\d{8,15}$/, "Veuillez entrer un numéro de téléphone valide.").max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères.").optional().or(z.literal('')),
  service_interested: z.string().max(200, "Le service ne peut pas dépasser 200 caractères.").optional().or(z.literal('')),
  message: z.string().min(10, "Le message est requis et doit contenir au moins 10 caractères.").max(1000, "Le message ne peut pas dépasser 1000 caractères."),
});

export type MessageFormData = z.infer<typeof messageSchema>;