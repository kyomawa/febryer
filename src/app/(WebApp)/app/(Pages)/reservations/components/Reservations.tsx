"use client";
import { getReservations } from "@/actions/gestion/action";
import React from "react";
import ContentHeader from "../../components/ContentHeader";

export default function Reservations() {
  const [reservations, setReservations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getReservations();
        setReservations(data);
      } catch (err) {
        setError(
          "Une erreur est survenue lors du chargement des réservations.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-7rem)] flex-col gap-y-6">
      {/* Header */}
      <ContentHeader title="Réservations" refreshTagNameButton="reservations" />

      {/* Content */}
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p>Chargement des réservations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : reservations.length > 0 ? (
            reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="rounded-lg border border-gray-300 p-4 shadow-sm"
              >
                <h3 className="text-lg font-bold">
                  Réservation #{reservation.id}
                </h3>
                <p>Service : {reservation.service.name}</p>
                <p>Prix : {reservation.service.price} €</p>
                <p>Client : {reservation.customer.name}</p>
                <p>Email : {reservation.customer.email}</p>
                <p>Téléphone : {reservation.customer.phone}</p>
                <p>Adresse : {reservation.customer.address}</p>
                <p>Message : {reservation.customer.message}</p>
                <p>
                  Début :{" "}
                  {new Date(reservation.startTime).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  Fin :{" "}
                  {new Date(reservation.endTime).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
                <p>Status : {reservation.status}</p>
                <p>
                  Créée le :{" "}
                  {new Date(reservation.createdAt).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p>Aucune réservation disponible.</p>
          )}
        </div>
      </div>
    </section>
  );
}
