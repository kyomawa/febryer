"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EditButton from "./EditButton";
import toast from "react-hot-toast";
import { cn, createFormData } from "@/lib/utils";
import { User } from "@prisma/client";
import { schemaUpdateUserProfileNameForm } from "@/actions/users/schemas";
import { updateUserProfileName } from "@/actions/users/actions";

// ===================================================================================================

type SettingsProfileNameFormProps = {
  name: User["name"];
};

export default function SettingsProfileNameForm({
  name,
}: SettingsProfileNameFormProps) {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof schemaUpdateUserProfileNameForm>>({
    resolver: zodResolver(schemaUpdateUserProfileNameForm),
    defaultValues: {
      name,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof schemaUpdateUserProfileNameForm>,
  ) => {
    setIsLoading(true);
    const toastId: string = toast.loading("Modification du nom en cours...");
    const formData = createFormData(values);
    const response = await updateUserProfileName(formData);
    if (response.success) {
      toast.success(response.message, { id: toastId });
      setIsDisabled(true);
    } else {
      toast.error(response.message, { id: toastId });
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-x-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Nom"
                  className={cn(
                    "border-none py-2.5",
                    isDisabled
                      ? "bg-black/10 dark:bg-white/20"
                      : "bg-black/5 dark:bg-white/10",
                  )}
                  disabled={isDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <EditButton
          isLoading={isLoading}
          isDisabled={isDisabled}
          setIsDisabled={setIsDisabled}
        />
      </form>
    </Form>
  );
}
