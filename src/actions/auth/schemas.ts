import { z } from "zod";

// ==========================================================================================================

export const schemaLoginForm = z.object({
  credential: z
    .string()
    .trim()
    .min(1, { message: "Saisis ton email ou ton nom d'utilisateur." })
    .max(50),
  password: z
    .string()
    .trim()
    .min(1, { message: "Saisis ton mot de passe." })
    .max(40, { message: "Ton vrai mot de passse." }),
});

// ==========================================================================================================
