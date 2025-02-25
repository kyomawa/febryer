import { z } from "zod";

// ==========================================================================================================

export const serviceSchema = z.object({
  id: z.string().min(0, "L'identifiant du service est requis."),
  name: z.string().min(0, "Le nom du service est requis."),
  price: z.number().min(0, "Le prix doit être supérieur ou égal à 0."),
  duration: z.string().min(1, "La durée de la prestation est requise."),
  description: z.string(),
  image: z.any().optional(),
});
export type ServiceFormValues = z.infer<typeof serviceSchema>;
// ==========================================================================================================

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 Mo
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

export const createServiceSchema = z.object({
  name: z.string().min(1, "Le nom du service est requis"),
  description: z.string().min(1, "La description du service est requise"),
  price: z.any(),
  duration: z.string().min(1, "La durée du service est requise"),
  image: z
    .instanceof(File, {
      message: "Merci de bien vouloir insérer une image !",
    })
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "Votre image doit faire moins de 10MB")
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file?.type as string);
    }, "Votre image doit être de type : PNG / JPG / JPEG / WEBP / SVG")
    .optional(),
});

export type CreateServiceFormValues = z.infer<typeof createServiceSchema>;
// ==========================================================================================================

export const updateServiceSchema = z.object({
  id: z.string().min(1, "L'identifiant du service est requis"),
  name: z.string().min(1, "Le nom du service est requis"),
  description: z.string().min(1, "La description du service est requise"),
  price: z.any(),
  duration: z.string().min(1, "La durée du service est requise"),
  image: z
    .instanceof(File, {
      message: "Merci de bien vouloir insérer une image !",
    })
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "Votre image doit faire moins de 10MB")
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file?.type as string);
    }, "Votre image doit être de type : PNG / JPG / JPEG / WEBP / SVG")
    .optional(),
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
