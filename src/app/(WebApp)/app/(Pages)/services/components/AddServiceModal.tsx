"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { onImageChangeCompress } from "@/lib/utils";
import { createServices } from "@/actions/gestion/action";
import {
  createServiceSchema,
  ServiceFormValues,
} from "@/actions/gestion/schemas";
import Image from "next/image";

interface AddServiceModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export function AddServiceModal({ onClose, isOpen }: AddServiceModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(createServiceSchema),
  });

  const [compressedFile, setCompressedFile] = useState<File | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await onImageChangeCompress(
      event,
      (file: unknown) => {
        setValue("image", file as File); // Mettre à jour le champ "image" du formulaire
      },
      setCompressedFile,

      async () => {
        // Callback optionnel si besoin
      },
    );
  };

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString()); // Convertir en chaîne pour FormData
      formData.append("duration", data.duration);
      formData.append("description", data.description || "");

      if (compressedFile) {
        formData.append("image", compressedFile);
      }

      console.log("Données envoyées :", Object.fromEntries(formData.entries()));
      await createServices(formData);
      console.log("Data successfully submitted");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un service</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Nom du service */}
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

          {/* Prix */}
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

          {/* Durée */}
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

          {/* Description */}
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

          {/* Image du service */}
          <div className="flex flex-col">
            <label htmlFor="service-image" className="mb-0 text-sm">
              Image du service
            </label>
            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded border">
              {compressedFile ? (
                <Image
                  src={URL.createObjectURL(compressedFile)}
                  alt="Aperçu de l'image"
                  className="h-full w-full object-cover"
                  width={200}
                  height={200}
                />
              ) : (
                <span className="text-gray-500">Aucune image sélectionnée</span>
              )}
              <input
                id="service-image"
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleImageChange}
              />
            </div>
            {errors.image && (
              <span className="text-sm text-red-500">
                {errors.image.message as string}
              </span>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" variant="default" disabled={isSubmitting}>
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
