"use server";
import prisma from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../cloudinary/action";
import { revalidateTag } from "next/cache";
import { createServiceSchema, updateServiceSchema } from "./schemas";

//=================================================

export const getServices = async () => {
  return await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      image: true, // Inclure l'image
      createdAt: true,
    },
  });
};

//=================================================
export const getReservations = async () => {
  try {
    const reservations = await prisma.booking.findMany({
      include: {
        customer: true, // Inclut les informations du client
        service: true, // Inclut les informations du service
      },
    });

    // Transformation des données pour éviter les erreurs sur les services nulls
    return reservations.map((reservation) => ({
      id: reservation.id,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      status: reservation.status,
      createdAt: reservation.createdAt,
      customer: {
        id: reservation.customer.id,
        name: reservation.customer.name,
        email: reservation.customer.email,
        phone: reservation.customer.phone,
        address: reservation.customer.address,
        message: reservation.customer.message,
      },
      service: reservation.service
        ? {
            id: reservation.service.id,
            name: reservation.service.name,
            price: reservation.service.price,
          }
        : null, // Si le service est nul
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    throw new Error("Impossible de récupérer les réservations");
  }
};

//=================================================
export const updateReservationStatus = async (
  id: string,
  status: BookingStatus,
) => {
  try {
    await prisma.booking.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation :", error);
    throw new Error("Impossible de mettre à jour la réservation");
  }
};

//=================================================
export const updateServices = async (formData: FormData) => {
  const validateFields = updateServiceSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    throw new Error("Validation des champs échouée", validateFields.error);
  }

  const { id, name, price, duration, description, image } = validateFields.data;

  try {
    let imageUrl: string | null = null;

    // Si une nouvelle image est fournie, on l'upload vers Cloudinary
    if (image) {
      imageUrl =
        image instanceof File
          ? ((await uploadImageToCloudinary(image)) ?? null)
          : null;

      const service = await prisma.service.findUnique({
        where: { id: id },
      });

      // Supprimer l'ancienne image si elle existe
      if (service?.image) {
        const publicId = service.image.split("/").pop()?.split(".")[0];
        if (publicId) {
          await deleteImageFromCloudinary(publicId);
        }
      }
    }

    // Mettre à jour le service avec l'URL de l'image
    await prisma.service.update({
      where: { id: id },
      data: {
        name: name,
        price: Number(price),
        duration: duration,
        description: description,
        image: imageUrl,
      },
    });

    return { success: true, message: "Service mis à jour avec succès" };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du service :", error);
    return {
      success: false,
      message: "Impossible de mettre à jour le service",
    };
  }
};

//=================================================
export const createServices = async (
  formData: FormData,
): Promise<{ success: boolean; message: string }> => {
  const validateFields = createServiceSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    console.error("Validation des champs échouée :", validateFields.error);
    return {
      success: false,
      message: "Les champs ne sont pas valides.",
    };
  }

  const { name, price, duration, description, image } = validateFields.data;

  try {
    let imageUrl: string | null = null;

    if (image) {
      console.log("Upload de l'image vers Cloudinary...");
      imageUrl = (await uploadImageToCloudinary(image)) ?? null;
      console.log("URL de l'image :", imageUrl);
    }

    console.log("Création du service dans la base de données...");
    await prisma.service.create({
      data: {
        name,
        price: Number(price), // Convertir en nombre
        duration,
        description: description || "",
        image: imageUrl,
      },
    });

    console.log("Service créé avec succès.");
    revalidateTag("services");

    return {
      success: true,
      message: "Service créé avec succès.",
    };
  } catch (error) {
    console.error("Erreur lors de la création du service :", error);
    return {
      success: false,
      message: "Impossible de créer le service.",
    };
  }
};

//=================================================
export const deleteServices = async (id: string) => {
  try {
    const service = await prisma.service.findUnique({ where: { id } });
    if (service?.image) {
      const publicId = service.image.split("/").pop()?.split(".")[0];
      if (publicId) {
        await deleteImageFromCloudinary(publicId);
      }
    }
    await prisma.service.delete({ where: { id } });

    return { success: true, message: "Service supprimé avec succès" };
  } catch (error) {
    console.error("Erreur lors de la suppression du service :", error);
    return { success: false, message: "Impossible de supprimer le service" };
  }
};

//=================================================

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function createBooking(input: any) {
  let customerLog;

  try {
    customerLog = await prisma.customerLog.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        address: input.address,
        message: input.message,
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        customerId: customerLog.id,
        serviceId: input.serviceId,
        createdAt: input.createdAt ?? new Date().toISOString(),
        startTime: new Date(input.startTime).toISOString(),
        endTime: new Date(input.endTime).toISOString(),
        status: BookingStatus.PENDING,
      },
    });

    return booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export async function changeColor(input: any) {
  try {
    const color = await prisma.theme.update({
      where: { id: "67bfaf0d99d221019ffd28f7" },
      data: {
        color: input.color,
      },
    });

    return color;
  } catch (error) {
    console.error("Error creating color:", error);
    throw error;
  }
}

export async function changeSecondaryColor(input: any) {
  try {
    const secondaryColor = await prisma.theme.update({
      where: { id: "67bfaf0d99d221019ffd28f7" },
      data: {
        secondaryColor: input.color,
      },
    });

    return secondaryColor;
  } catch (error) {
    console.error("Error creating color:", error);
    throw error;
  }
}

export async function getColor() {
  try {
    const theme = await prisma.theme.findMany();
    if (theme.length > 0 && theme[0].color) {
      return "#" + theme[0].color;
    }
    return "#000000"; // Valeur par défaut en cas d'erreur
  } catch (error) {
    console.error("Error getting colors:", error);
    throw error;
  }
}

export async function getSecondaryColor() {
  try {
    const theme = await prisma.theme.findMany();
    if (theme.length > 0 && theme[0].secondaryColor) {
      return "#" + theme[0].secondaryColor;
    }
    return "#000000"; // Valeur par défaut en cas d'erreur
  } catch (error) {
    console.error("Error getting secondary color:", error);
    throw error;
  }
}

export async function fetchReviews() {
  const featurableWidgetId = process.env.FEATURABLE_API_KEY;

  if (!featurableWidgetId) {
    throw new Error("Missing API Key");
  }

  try {
    const response = await fetch(
      `https://featurable.com/api/v1/widgets/${featurableWidgetId}`,
      {
        headers: {
          Authorization: `Bearer ${featurableWidgetId}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    const data = await response.json();
    return data.reviews;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching reviews:", error.message);
    } else {
      console.error("Error fetching reviews:", error);
    }
    return [];
  }
}

// A Voir si on peut pas directement chopper ça depuis une api tripadvisor ou google
// export const getTestimonial = async () => {
//   return await prisma.service.findMany();
// };
