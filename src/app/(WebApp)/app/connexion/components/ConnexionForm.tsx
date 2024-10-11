"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { schemaLoginForm } from "@/actions/auth/schemas";
import { login } from "@/actions/auth/actions";

export default function ConnexionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof schemaLoginForm>>({
    resolver: zodResolver(schemaLoginForm),
    defaultValues: {
      credential: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schemaLoginForm>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("credential", values.credential);
      formData.append("password", values.password);

      const response = await login(formData);

      if (response.success) {
        toast.success(response.message);
        router.replace("/app/services");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8"
      >
        <div className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="credential"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identifiant</FormLabel>
                <FormControl>
                  <Input
                    placeholder="febryer ou febryer@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*************"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full" isLoading={isLoading} type="submit">
          Se Connecter
        </Button>
      </form>
    </Form>
  );
}
