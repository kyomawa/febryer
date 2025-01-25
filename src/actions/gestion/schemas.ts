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
// ==========================================================================================================

export const bookingSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  email: z.string().email("L'email doit être valide."),
  phone: z.string().min(10, "Le numéro de téléphone est requis."),
  address: z.string().optional(),
  message: z.string().optional(),
  serviceId: z.string().optional(),
  startTime: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "La date de début doit être valide.",
    ),
  endTime: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "La date de fin doit être valide.",
    ),
});
