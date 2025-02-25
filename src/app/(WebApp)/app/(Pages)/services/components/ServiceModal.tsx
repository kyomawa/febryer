"use client";
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
import Image from "next/image";
import { useState } from "react";
import { onImageChangeCompress } from "@/lib/utils";

interface ServiceModalProps {
  service: ServiceFormValues | null;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {},
  });

  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await onImageChangeCompress(
      event,
      (file: unknown) => {
        const imageFile = file as File;
        setValue("image", imageFile); // Mettre à jour le champ "image" du formulaire
        setCompressedFile(imageFile);
        setSelectedImage(URL.createObjectURL(imageFile)); // Afficher l'image sélectionnée
      },
      setCompressedFile,
      async () => {},
    );
  };

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const formData = new FormData();
      formData.append("id", service?.id || ""); // Assurez-vous d'envoyer l'ID du service
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("duration", data.duration);
      formData.append("description", data.description);
      if (compressedFile) {
        formData.append("image", compressedFile);
      }

      await updateServices(formData);
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
          <DialogTitle>Modifier le service</DialogTitle>
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
          <div>
            <label htmlFor="service-image" className="cursor-pointer">
              {selectedImage || service.image ? (
                <Image
                  src={selectedImage || service.image}
                  alt="Preview"
                  className="w-full rounded border object-cover transition-all duration-150 hover:brightness-90"
                  width={200}
                  height={200}
                />
              ) : (
                <div className="flex w-full items-center justify-center rounded border bg-gray-100 text-gray-400">
                  Click to upload
                </div>
              )}
            </label>
            <input
              id="service-image"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
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
