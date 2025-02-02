"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm, Controller } from "react-hook-form";
import { createBooking, getServices } from "@/actions/gestion/action";

interface AddReservationModalProps {
  addReservation: boolean | null;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  serviceId: string;
  startTime: string;
  endTime: string;
}

export default function AddReservationModal({
  addReservation,
  onClose,
}: AddReservationModalProps) {
  const { handleSubmit, control } = useForm<FormData>();
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        setServices(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
      }
    };
    fetchServices();
  }, []);

  const onSubmit = (data: FormData) => {
    createBooking(data);
    onClose();
    window.location.reload();
  };

  return (
    <Dialog open={!!addReservation} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] md:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Créer une réservation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row gap-4">
            <div className="flex w-full flex-col">
              <div className="w-full">
                <Label htmlFor="name">Nom</Label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input id="name" {...field} type="text" placeholder="Nom" />
                  )}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      id="email"
                      {...field}
                      type="email"
                      placeholder="Email"
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="phone">Téléphone</Label>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      id="phone"
                      {...field}
                      type="text"
                      placeholder="Téléphone"
                    />
                  )}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="address">Adresse</Label>
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      id="address"
                      {...field}
                      type="text"
                      placeholder="Adresse"
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex w-full flex-col">
              <div className="w-full">
                <Label htmlFor="message">Description</Label>
                <Controller
                  name="message"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Textarea
                      id="message"
                      {...field}
                      placeholder="Description de la réservation"
                      className="h-24"
                    />
                  )}
                />
              </div>
              <div className="mt-2 w-full">
                <Label htmlFor="service">Service</Label>
                <Controller
                  name="serviceId"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                      name="serviceId"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Services disponibles</SelectLabel>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex w-full flex-row gap-x-2">
                <div className="w-full">
                  <Label className="text-nowrap" htmlFor="startTime">
                    Heure début réservation
                  </Label>
                  <Controller
                    name="startTime"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        id="startTime"
                        {...field}
                        type="datetime-local"
                        placeholder="Début"
                      />
                    )}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="endTime">Heure fin réservation</Label>
                  <Controller
                    name="endTime"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        id="endTime"
                        {...field}
                        type="datetime-local"
                        placeholder="Fin"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button type="submit">Créer</Button>
            <Button onClick={onClose} variant="secondary" type="button">
              Fermer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
