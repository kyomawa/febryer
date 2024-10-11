"use server";

import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { deleteSession, ensureAuthenticated } from "@/lib/session";
import { User } from "@prisma/client";
import { MessageProps } from "@/lib/utils";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";
import {
  schemaUpdateUserProfileEmailForm,
  schemaUpdateUserProfileImageForm,
  schemaUpdateUserProfileNameForm,
  schemaUpdateUserProfilePasswordForm,
} from "./schemas";

// ==================================================================================================================================

export const getConnectedUser = async (): Promise<User> => {
  const { userId } = await ensureAuthenticated();

  const fetchConnectedUser = unstable_cache(
    async (id: string) => {
      return await prisma.user.findUnique({
        where: { id },
      });
    },
    ["connectedUser"],
    {
      revalidate: 3600,
      tags: ["connectedUser", "users"],
    },
  );

  const user = await fetchConnectedUser(userId);
  if (!user) {
    throw new Error("Impossible de trouver le profil de l'utilisateur.");
  }
  return user;
};

// ==================================================================================================================================

export async function deleteConnectedUser(): Promise<MessageProps> {
  const { userId } = await ensureAuthenticated();
  const { name } = await getConnectedUser();

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    await deleteImageFromCloudinary(name);

    deleteSession();

    return {
      success: true,
      message: "Votre compte a été supprimé avec succès.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de la suppression de votre compte.",
    };
  }
}

// =========================================================================================================================================

export const updateUserImageProfile = async (
  formData: FormData,
): Promise<MessageProps> => {
  const { userId } = await ensureAuthenticated();
  const { name } = await getConnectedUser();

  const validateFields = schemaUpdateUserProfileImageForm.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      success: false,
      message: `Image non valide.`,
    };
  }

  const { image } = validateFields.data;

  const imgUrl = await uploadImageToCloudinary(image, name);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      image: imgUrl as string,
    },
  });

  if (!user) {
    return {
      success: false,
      message:
        "Une erreur est survenue lors de la mise à jour de l'image de profil.",
    };
  }

  return {
    success: true,
    message: `Image de profil mise à jour avec succès.`,
  };
};

// ==========================================================================================================

export const updateUserProfileName = async (
  formData: FormData,
): Promise<MessageProps> => {
  const { userId } = await ensureAuthenticated();

  const validateFields = schemaUpdateUserProfileNameForm.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      success: false,
      message: `Les champs ne sont pas valides.`,
    };
  }

  const { name } = validateFields.data;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
    },
  });

  if (!user) {
    return {
      success: false,
      message:
        "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
    };
  }

  return {
    success: true,
    message: `Votre nom a été mis à jour avec succès.`,
  };
};

// ==========================================================================================================

export const updateUserProfileEmail = async (
  formData: FormData,
): Promise<MessageProps> => {
  const { userId } = await ensureAuthenticated();

  const validateFields = schemaUpdateUserProfileEmailForm.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      success: false,
      message: `Les champs ne sont pas valides.`,
    };
  }

  const { email } = validateFields.data;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      email,
    },
  });

  if (!user) {
    return {
      success: false,
      message:
        "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
    };
  }

  return {
    success: true,
    message: `Vote email a été mis à jour avec succès.`,
  };
};

// ==========================================================================================================

export const updateUserProfilePassword = async (
  formData: FormData,
): Promise<MessageProps> => {
  const { userId } = await ensureAuthenticated();

  const validateFields = schemaUpdateUserProfilePasswordForm.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      success: false,
      message: `Les champs ne sont pas valides.`,
    };
  }

  const { password } = validateFields.data;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      password,
    },
  });

  if (!user) {
    return {
      success: false,
      message:
        "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
    };
  }

  return {
    success: true,
    message: `Votre mot de passe a été mis à jour avec succès.`,
  };
};

// ==========================================================================================================
