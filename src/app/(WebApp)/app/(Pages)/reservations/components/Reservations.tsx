"use client";
import { getReservations } from "@/actions/gestion/action";
import React from "react";
import ContentHeader from "../../components/ContentHeader";
import { CircleDashed, CircleDotDashed } from "lucide-react";
import FilterAndSortControls from "../../components/Filter/page";
import { is } from "date-fns/locale";

export default function Reservations() {
  const [reservations, setReservations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    status: "",
    startTime: "",
  });
  const [selectedReservation, setSelectedReservation] = React.useState<
    any | null
  >(null);
  const [sortOrder, setSortOrder] = React.useState("asc");

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

  const filteredReservations = reservations
    .filter((reservation) => {
      if (filters.status && reservation.status !== filters.status) return false;
      if (
        filters.startTime &&
        new Date(reservation.startTime).toISOString().split("T")[0] !==
          filters.startTime
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <section className="relative flex min-h-[calc(100vh-7rem)] flex-col gap-y-6">
      {/* Header */}
      {selectedReservation && (
        <div>
          <div> {selectedReservation.customer.name}</div>
          <div> {selectedReservation.customer.email}</div>
          <div> {selectedReservation.customer.phone}</div>
          <div> {selectedReservation.customer.address}</div>
          <div> {selectedReservation.customer.message}</div>
          <div> {selectedReservation.status}</div>
          <div>{selectedReservation.createdAt.toLocaleString()}</div>
          <div>
            {new Date(selectedReservation.startTime).toLocaleString("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
          <div>
            {new Date(selectedReservation.endTime).toLocaleString("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
        </div>
      )}

      <ContentHeader title="Réservations" refreshTagNameButton="reservations" />
      <FilterAndSortControls
        filters={filters}
        setFilters={setFilters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      {/* Content */}
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-center text-gray-500">
              Chargement des réservations...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="rounded-lg border border-gray-300 p-6 shadow-lg transition-all duration-200 hover:cursor-pointer hover:bg-primary-100 hover:shadow-xl"
                onClick={() => setSelectedReservation(reservation)}
              >
                <h3 className="mb-2 flex flex-row justify-between text-xl font-bold text-gray-800">
                  <div>N° #{reservation.id}</div>
                  <div>{reservation.service.price}€</div>
                </h3>

                <p className="text-md mb-1 flex justify-between text-gray-600">
                  <div>
                    <span className="font-semibold">Client :</span>{" "}
                    {reservation.customer.name}
                  </div>
                  <p className="flex items-center gap-2">
                    {reservation.status}
                    {(reservation.status === "PENDING" && (
                      <CircleDashed className="h-6 w-6 text-yellow-500" />
                    )) ||
                      (reservation.status === "ACCEPTED" && (
                        <CircleDotDashed className="h-6 w-6 text-green-500" />
                      )) || (
                        <CircleDotDashed className="h-6 w-6 text-red-500" />
                      )}
                  </p>
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <span className="font-semibold">Service :</span>{" "}
                  {reservation.service.name}
                </p>

                <p className="mb-1 text-sm text-gray-600">
                  <span className="font-semibold">Téléphone :</span>{" "}
                  {reservation.customer.phone}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <span className="font-semibold">Adresse :</span>{" "}
                  {reservation.customer.address}
                </p>
                <div className="flex flex-row gap-4">
                  <p className="mb-1 text-sm text-gray-600">
                    <span className="font-semibold">Début :</span>{" "}
                    {new Date(reservation.startTime).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="mb-1 text-sm text-gray-600">
                    <span className="font-semibold">Fin :</span>{" "}
                    {new Date(reservation.endTime).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Aucune réservation disponible.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
