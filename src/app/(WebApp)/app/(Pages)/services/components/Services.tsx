"use client";

import React from "react";
import ContentHeader from "../../components/ContentHeader";
import { deleteServices, getServices } from "@/actions/gestion/action";
import { ServiceModal } from "./ServiceModal";
import { Button } from "@/components/ui/button";
import { AddServiceModal } from "./AddServiceModal";
import { X } from "lucide-react";
import Image from "next/image";

export default function Services() {
  const [services, setServices] = React.useState<
    {
      id: string;
      name: string;
      description: string;
      price: number;
      duration: string;
      image?: string;
      createdAt: Date;
    }[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingServiceId, setDeletingServiceId] = React.useState<
    string | null
  >(null);
  const [addSelectedService, setAddSelectedService] =
    React.useState<boolean>(false);
  const [selectedService, setSelectedService] = React.useState<{
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    createdAt: Date;
  } | null>(null);

  // Gérer la fermeture des modales
  const handleClose = () => setSelectedService(null);

  // Suppression d'un service avec verrouillage pour éviter plusieurs suppressions simultanées
  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Empêche la propagation du clic

    if (deletingServiceId) return; // Empêche les suppressions multiples en parallèle

    setDeletingServiceId(id);
    try {
      console.log("Suppression du service avec l'ID :", id);

      await deleteServices(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (error) {
      setError("Erreur lors de la suppression du service.");
    } finally {
      setDeletingServiceId(null);
    }
  };

  // Récupération des services au montage du composant
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(
          data.map((service) => ({
            ...service,
            createdAt: new Date(service.createdAt),
            duration: service.duration,
            image: service.image || undefined,
          })),
        );
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      {/* Afficher les modales si nécessaires */}
      {selectedService && (
        <ServiceModal service={selectedService} onClose={handleClose} />
      )}
      {addSelectedService && (
        <AddServiceModal
          isOpen={addSelectedService}
          onClose={() => setAddSelectedService(false)}
        />
      )}

      <section className="relative flex min-h-[calc(100vh-7rem)] flex-col gap-y-6">
        <ContentHeader title="Services" refreshTagNameButton="services" />
        <div>
          <Button onClick={() => setAddSelectedService(true)}>
            Créer un service
          </Button>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <p>Chargement des services...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div
                  onClick={() => setSelectedService(service)}
                  key={service.id}
                  className="rounded-lg border border-gray-300 p-4 shadow-lg transition-all duration-200 hover:bg-primary-100 hover:shadow-xl"
                >
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">{service.name}</h3>
                      </div>
                      <p>{service.description}</p>
                      <p>Prix : {service.price}€</p>
                      <p>Durée : {service.duration}</p>
                      <p>
                        Créé le :{" "}
                        {new Date(service.createdAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row gap-x-4">
                      {service.image && (
                        <div className="h-32 w-32 overflow-hidden rounded">
                          <Image
                            src={service.image}
                            alt={service.name}
                            className="h-full w-full object-cover"
                            width={200}
                            height={200}
                          />
                        </div>
                      )}
                      <div
                        className="h-fit w-fit cursor-pointer rounded-full px-1 py-1 hover:backdrop-brightness-95"
                        onClick={(e) => handleDelete(service.id, e)}
                      >
                        {deletingServiceId === service.id ? (
                          <span className="text-gray-500">Suppression...</span>
                        ) : (
                          <X className="text-red-600" width={"20px"} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Aucun service disponible. Créez-en un pour commencer !</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
