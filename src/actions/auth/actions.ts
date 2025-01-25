"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { checkRateLimit, getIp, resetRateLimit } from "@/lib/rateLimiter";
import { createSession, deleteSession } from "@/lib/session";
import { MessageProps } from "@/lib/utils";
import { schemaLoginForm } from "./schemas";

// =========================================================================================================================================

export const login = async (formData: FormData): Promise<MessageProps> => {
  const ip = await getIp();

  if (!checkRateLimit(ip)) {
    return {
      success: false,
      message: "Trop de tentatives de connexion. Réessayez plus tard.",
    };
  }

  const validateFields = schemaLoginForm.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return errorMessage;
  }

  const { credential, password } = validateFields.data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: credential }, { name: credential }],
    },
  });

  if (!user) {
    return errorMessage;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return errorMessage;
  }

  resetRateLimit(ip);

  await createSession(user.id);

  return {
    success: true,
    message: "Bienvenue sur le panel d'administation.",
  };
};

// ==========================================================================================================

export const logout = async () => {
  deleteSession();
};

// ==========================================================================================================

const errorMessage: MessageProps = {
  success: false,
  message: "Seul l'administrateur de ce site peut se connecter.",
};

// ==========================================================================================================
