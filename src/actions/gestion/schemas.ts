import { z } from "zod";

// ==========================================================================================================

export const serviceSchema = z.object({
  id: z.string().min(0, "L'identifiant du service est requis."),
  name: z.string().min(0, "Le nom du service est requis."),
  price: z.number().min(0, "Le prix doit être supérieur ou égal à 0."),
  duration: z.string().min(1, "La durée de la prestation est requise."),
  description: z.string(),
});
export type ServiceFormValues = z.infer<typeof serviceSchema>;
// ==========================================================================================================

export const createServiceSchema = z.object({
  name: z.string().min(0, "Le nom du service est requis."),
  price: z.number().min(0, "Le prix doit être supérieur ou égal à 0."),
  duration: z.string().min(1, "La durée de la prestation est requise."),
  description: z.string(),
});
