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

    // Transformation des données si nécessaire
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
      service: {
        id: reservation.service.id,
        name: reservation.service.name,
        price: reservation.service.price,
      },
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

// A Voir si on peut pas directement chopper ça depuis une api tripadvisor ou google
// export const getTestimonial = async () => {
//   return await prisma.service.findMany();
// };
