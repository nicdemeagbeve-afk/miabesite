import { z } from 'zod';

export const CommunityCreationSchema = z.object({
  name: z.string().min(3, "Le nom de la communauté doit contenir au moins 3 caractères."),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
  utility: z.string().min(5, "L'utilité doit contenir au moins 5 caractères."),
  positioningDomain: z.string().min(3, "Le domaine de positionnement doit contenir au moins 3 caractères."),
  template_1: z.string().min(1, "Veuillez choisir le premier template premium."),
  template_2: z.string().min(1, "Veuillez choisir le deuxième template premium."),
  category: z.string().min(1, "Veuillez choisir une catégorie pour votre communauté."),
  is_public: z.boolean().default(true), // New: Public/Private toggle
}).refine(data => data.template_1 !== data.template_2, {
  message: "Les deux templates choisis doivent être différents.",
  path: ["template_2"],
});

export type CommunityCreationFormData = z.infer<typeof CommunityCreationSchema>;