"use client";

import {
  getReservations,
  updateReservationStatus,
} from "@/actions/gestion/action";
import React, { useState, useEffect, useMemo } from "react";
import ContentHeader from "../../components/ContentHeader";
import { CircleDashed, CircleDotDashed } from "lucide-react";
import FilterAndSortControls from "../../components/Filter/Filter";
import { ReservationModal } from "./Modal";
import { Button } from "@/components/ui/button";
import AddReservationModal from "./AddReservationModal";

type Reservation = {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  service: {
    name?: string;
    price?: number;
  } | null;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    message: string;
  };
  createdAt: string;
};

type Filters = {
  status: string;
  startTime: string;
};

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: "",
    startTime: "",
  });
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [addReservationModal, setAddReservationModal] =
    useState<boolean>(false);

  const handleAccept = async () => {
    if (selectedReservation) {
      const confirm = window.confirm(
        `Êtes-vous sûr de vouloir accepter la réservation N°${selectedReservation.id} ?`,
      );
      if (!confirm) return;
      try {
        await updateReservationStatus(selectedReservation.id, "ACCEPTED");
        // Mettre à jour l'état local des réservations
        setReservations((prev) =>
          prev.map((res) =>
            res.id === selectedReservation.id
              ? { ...res, status: "ACCEPTED" }
              : res,
          ),
        );
      } catch (error) {
        console.error("Erreur lors de l'acceptation :", error);
        setError("Impossible de mettre à jour la réservation.");
      } finally {
        setSelectedReservation(null);
      }
    }
  };

  const handleReject = async () => {
    if (selectedReservation) {
      const confirm = window.confirm(
        `Êtes-vous sûr de vouloir refuser la réservation N°${selectedReservation.id} ?`,
      );
      if (!confirm) return;
      try {
        await updateReservationStatus(selectedReservation.id, "REFUSED");

        // Mettre à jour l'état local des réservations
        setReservations((prev) =>
          prev.map((res) =>
            res.id === selectedReservation.id
              ? { ...res, status: "REFUSED" }
              : res,
          ),
        );
      } catch (error) {
        console.error("Erreur lors du refus :", error);
        setError("Impossible de mettre à jour la réservation.");
      } finally {
        setSelectedReservation(null);
      }
    }
  };

  useEffect(() => {
    const fetchReservations = async (): Promise<void> => {
      try {
        const data = await getReservations();
        setReservations(
          data.map((reservation) => ({
            ...reservation,
            startTime: reservation.startTime.toISOString(),
            endTime: reservation.endTime.toISOString(),
            createdAt: reservation.createdAt.toISOString(),
          })),
        );
      } catch {
        setError(
          "Une erreur est survenue lors du chargement des réservations.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const filteredReservations = useMemo(() => {
    return reservations
      .filter((reservation) => {
        if (filters.status && reservation.status !== filters.status)
          return false;
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
  }, [reservations, filters, sortOrder]);

  return (
    <div>
      {/* Reservation Details Modal */}
      <ReservationModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      {addReservationModal ? <AddReservationModal /> : null}

      <section className="relative flex min-h-[calc(100vh-7rem)] flex-col gap-y-6">
        <ContentHeader
          title="Réservations"
          refreshTagNameButton="reservations"
        />
        <FilterAndSortControls
          filters={filters}
          setFilters={setFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <div>
          <Button
            className="btn btn-primary"
            onClick={() => setAddReservationModal(true)}
          >
            {" "}
            Ajouter une Réservation{" "}
          </Button>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <p className="absolute flex w-full justify-center text-center text-gray-500">
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
                    <div>{reservation.service?.price ?? "Non défini"}€</div>
                  </h3>
                  <p className="text-md mb-1 flex justify-between text-gray-600">
                    <span className="font-semibold">Client :</span>{" "}
                    {reservation.customer.name}
                    <span className="flex items-center gap-2">
                      {reservation.status}
                      {reservation.status === "PENDING" && (
                        <CircleDashed className="h-6 w-6 text-yellow-500" />
                      )}
                      {reservation.status === "ACCEPTED" && (
                        <CircleDotDashed className="h-6 w-6 text-green-500" />
                      )}
                      {reservation.status === "REFUSED" && (
                        <CircleDotDashed className="h-6 w-6 text-red-500" />
                      )}
                    </span>
                  </p>
                  <p className="mb-1 text-sm text-gray-600">
                    <span className="font-semibold">Service :</span>{" "}
                    {reservation.service?.name ?? "Non défini"}
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
              <p className="absolute flex w-full justify-center text-center text-gray-500">
                Aucune réservation disponible.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
