import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateServices } from "@/actions/gestion/action";
import { serviceSchema, ServiceFormValues } from "@/actions/gestion/schemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServiceModalProps {
  service: ServiceFormValues | null;
  addModal?: boolean;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {},
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      await updateServices(data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (!service) return null;

  return (
    <Dialog open={!!service} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails de la réservation</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <label htmlFor="service-name" className="mb-0 text-sm">
              Nom du service
            </label>
            <input
              id="service-name"
              className="block w-full rounded border p-2"
              type="text"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="service-price" className="mb-0 text-sm">
              Prix
            </label>
            <input
              id="service-price"
              className="block w-full rounded border p-2"
              type="number"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <span className="text-sm text-red-500">
                {errors.price.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="service-duration" className="mb-0 text-sm">
              Durée de la prestation
            </label>
            <input
              id="service-duration"
              className="block w-full rounded border p-2"
              type="text"
              {...register("duration")}
            />
            {errors.duration && (
              <span className="text-sm text-red-500">
                {errors.duration.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="service-description" className="mb-0 text-sm">
              Description
            </label>
            <textarea
              id="service-description"
              className="block w-full rounded border p-2"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-sm text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" variant="default">
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button onClick={onClose} variant="secondary">
              Fermer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
