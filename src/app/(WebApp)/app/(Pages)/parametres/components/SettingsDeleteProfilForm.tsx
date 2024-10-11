"use client";

import { deleteConnectedUser } from "@/actions/users/actions";
import TooltipComponent from "@/components/TooltipComponent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// ===================================================================================================

export default function SettingsDeleteProfilForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await deleteConnectedUser();
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipComponent side="bottom" label="Supprimer le compte">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-primary-600 p-2 text-white transition-colors duration-300 hover:bg-primary-700 dark:bg-primary-700/35 dark:hover:bg-primary-800/35"
        >
          <Trash className="size-6" strokeWidth={1.5} />
        </button>
      </TooltipComponent>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression de votre compte</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Êtes-vous sûr de vouloir supprimer
            votre compte ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDelete} isLoading={isLoading} type="submit">
              Supprimer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
