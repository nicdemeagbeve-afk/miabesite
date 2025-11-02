import { z } from 'zod';

export const CommunityCreationSchema = z.object({
  name: z.string().min(3, "Le nom de la communauté doit contenir au moins 3 caractères."),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
  utility: z.string().min(5, "L'utilité doit contenir au moins 5 caractères."),
  positioningDomain: z.string().min(3, "Le domaine de positionnement doit contenir au moins 3 caractères."),
});

export type CommunityCreationFormData = z.infer<typeof CommunityCreationSchema>;
