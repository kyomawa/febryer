"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Form } from "react-hook-form";

export default function AddReservationModal() {
  const [reservation, setReservation] = useState(null);

  const onClose = () => {
    setReservation(null);
  };
  return (
    <>
      <Dialog open={!!reservation} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
          </DialogHeader>
          {/* <div className="space-y-2">
          <div>
            <span className="font-semibold">Nom :</span>{" "}
            {reservation.customer.name}
          </div>
          <div>
            <span className="font-semibold">Email :</span>{" "}
            {reservation.customer.email}
          </div>
          <div>
            <span className="font-semibold">Téléphone :</span>{" "}
            {reservation.customer.phone}
          </div>
          <div>
            <span className="font-semibold">Adresse :</span>{" "}
            {reservation.customer.address}
          </div>
          <div>
            <span className="font-semibold">Message :</span>{" "}
            {reservation.customer.message}
          </div>
          <div>
            <span className="font-semibold">Statut :</span> {reservation.status}
          </div>
          <div>
            <span className="font-semibold">Créée le :</span>{" "}
            {new Date(reservation.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Début :</span>{" "}
            {new Date(reservation.startTime).toLocaleString("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
          <div>
            <span className="font-semibold">Fin :</span>{" "}
            {new Date(reservation.endTime).toLocaleString("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
        </div> */}
          <Form>
            <input type="text" />
          </Form>
          <DialogFooter>
            <Button onClick={onClose} variant="secondary">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
