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
import { schemaUpdateUserProfilePasswordForm } from "@/actions/users/schemas";
import { updateUserProfilePassword } from "@/actions/users/actions";

// ===================================================================================================

export default function SettingsProfilePasswordForm() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof schemaUpdateUserProfilePasswordForm>>({
    resolver: zodResolver(schemaUpdateUserProfilePasswordForm),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof schemaUpdateUserProfilePasswordForm>,
  ) => {
    setIsLoading(true);
    const formData = createFormData(values);
    const response = await updateUserProfilePassword(formData);
    if (response.success) {
      toast.success(response.message);
      setIsDisabled(true);
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-x-3">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="password"
                  placeholder="***********"
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
