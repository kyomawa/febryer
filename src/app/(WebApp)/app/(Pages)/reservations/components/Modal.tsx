import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReservationModalProps {
  reservation: {
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      message: string;
    };
    status: string;
    createdAt: string;
    startTime: string;
    endTime: string;
  } | null;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export function ReservationModal({
  reservation,
  onClose,
  onAccept,
  onReject,
}: ReservationModalProps) {
  if (!reservation) return null;

  return (
    <Dialog open={!!reservation} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails de la réservation</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
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
        </div>
        <DialogFooter>
          {reservation.status === "PENDING" && (
            <>
              <Button onClick={onReject} variant="destructive">
                Rejeter
              </Button>
              <Button onClick={onAccept} variant="default">
                Accepter
              </Button>
            </>
          )}
          <Button onClick={onClose} variant="secondary">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
