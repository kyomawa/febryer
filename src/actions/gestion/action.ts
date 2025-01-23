"use server";
import prisma from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export const getServices = async () => {
  return await prisma.service.findMany();
};
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

export const updateServices = async (data: {
  id: string;
  name: string;
  price: number;
  duration: string;
  description?: string;
}) => {
  try {
    await prisma.service.update({
      where: { id: data.id },
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        description: data.description,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du service :", error);
    throw new Error("Impossible de mettre à jour le service");
  }
};

export const createServices = async (data: {
  id: string;
  name: string;
  price: number;
  duration: string;
  description?: string;
}) => {
  try {
    await prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        description: data.description ?? "",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création du service :", error);
    throw new Error("Impossible de créer le service");
  }
};

export const deleteServices = async (id: string) => {
  try {
    await prisma.service.delete({ where: { id } });
  } catch (error) {
    console.error("Erreur lors de la suppression du service :", error);
    throw new Error("Impossible de supprimer le service");
  }
};

// Nettoie les réservations avec des services supprimés
export async function getBookingsWithServices(filter?: {
  hasService: boolean;
}) {
  try {
    const whereCondition = filter
      ? filter.hasService
        ? { service: { isNot: null } } // Booking avec un service
        : { service: null } // Booking sans service
      : {};

    const bookings = await prisma.booking.findMany({
      where: whereCondition,
      include: {
        service: true, // Inclut les détails du service lié
      },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

// A Voir si on peut pas directement chopper ça depuis une api tripadvisor ou google
// export const getTestimonial = async () => {
//   return await prisma.service.findMany();
// };
