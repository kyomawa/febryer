import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "@/constants/data";
import { z } from "zod";

// =========================================================================================================================================

export const schemaUpdateUserProfileImageForm = z.object({
  image: z
    .instanceof(File, {
      message: "Merci de bien vouloir insérer une image !",
    })
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "Votre image doit faire moins de 10MB")
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file?.type as string);
    }, "Votre image doit être de type : PNG / JPG / JPEG / WEBP / SVG"),
});

// =========================================================================================================================================

export const schemaUpdateUserProfileNameForm = z.object({
  name: z
    .string({ message: "Saisis un nom valide." })
    .trim()
    .min(1, { message: "Saisis ton nom." })
    .max(65, { message: "Ton nom doit être plus court." }),
});

// =========================================================================================================================================

export const schemaUpdateUserProfileEmailForm = z.object({
  email: z
    .string({ message: "Saisis un email valide." })
    .email({ message: "Saisis un email valide." })
    .trim()
    .min(1, { message: "Saisis ton email." })
    .max(50, { message: "Ton email est invalide." }),
});

// =========================================================================================================================================

export const schemaUpdateUserProfilePasswordForm = z.object({
  password: z
    .string({ message: "Saisis un mot de passe valide." })
    .trim()
    .min(6, { message: "Ton mot de passe doit faire au moins 8 caractères." })
    .max(40, {
      message: "Ton mot de passe ne peut pas excéder 40 caractères.",
    }),
});

// =========================================================================================================================================
