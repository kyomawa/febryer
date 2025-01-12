"use server";
import prisma from "@/lib/prisma";

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

// A Voir si on peut pas directement chopper ça depuis une api tripadvisor ou google
// export const getTestimonial = async () => {
//   return await prisma.service.findMany();
// };
