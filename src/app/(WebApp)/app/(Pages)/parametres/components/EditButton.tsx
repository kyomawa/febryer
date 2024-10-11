"use client";

import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";

type EditButtonProps = {
  isLoading: boolean;
  isDisabled: boolean;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditButton({ isDisabled, isLoading, setIsDisabled }: EditButtonProps) {
  return (
    <div>
      {isDisabled ? (
        <Button
          onClick={() => setIsDisabled(false)}
          type="button"
          className="p-2.5 bg-black/5 dark:bg-white/10 rounded-md hover:bg-primary-600 group/editbutton"
        >
          <Pencil
            className="size-5 text-black dark:text-white transition-colors duration-200 group-hover/editbutton:text-white"
            strokeWidth={1.5}
          />
        </Button>
      ) : (
        <div className="flex gap-x-1">
          <Button
            isLoading={isLoading}
            onClick={() => setIsDisabled(false)}
            type="submit"
            className="p-2.5 bg-black/5 dark:bg-white/10 rounded-md hover:bg-primary-600 group/editbutton"
          >
            <Check
              className="size-5 text-black dark:text-white transition-colors duration-200 group-hover/editbutton:text-white"
              strokeWidth={1.5}
            />
          </Button>
          <Button
            onClick={() => setIsDisabled(true)}
            type="button"
            className="p-2.5 bg-black/5 dark:bg-white/10 rounded-md hover:bg-primary-600 group/editbutton"
          >
            <X
              className="size-5 text-black dark:text-white transition-colors duration-200 group-hover/editbutton:text-white"
              strokeWidth={1.5}
            />
          </Button>
        </div>
      )}
    </div>
  );
}
