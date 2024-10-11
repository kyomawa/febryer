"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, createFormData, onImageChangeCompress } from "@/lib/utils";
import { z } from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CldImage from "@/components/CldImage";
import { AnimatePresence, motion } from "framer-motion";
import { ImageUp, Loader, UserIcon } from "lucide-react";
import { User } from "@prisma/client";
import { schemaUpdateUserProfileImageForm } from "@/actions/users/schemas";
import { updateUserImageProfile } from "@/actions/users/actions";

// ===================================================================================================

type SettingsProfileImageFormProps = {
  connectedUser: User;
};

export default function SettingsProfileImageForm({
  connectedUser,
}: SettingsProfileImageFormProps) {
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { image } = connectedUser;
  const [isLoading, setIsLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const form = useForm<z.infer<typeof schemaUpdateUserProfileImageForm>>({
    resolver: zodResolver(schemaUpdateUserProfileImageForm),
    defaultValues: {
      image: undefined,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof schemaUpdateUserProfileImageForm>,
  ) => {
    setIsLoading(true);
    const imageFile = compressedFile || values.image;
    const formData = createFormData({
      image: imageFile,
    });
    const response = await updateUserImageProfile(formData);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: unknown[]) => void,
  ) => {
    await onImageChangeCompress(
      event,
      onChange,
      setCompressedFile,
      setIsLoading,
      async () => {
        await form.handleSubmit(onSubmit)();
        event.target.value = "";
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8 max-[500px]:size-full min-[500px]:items-center"
      >
        <div className="flex flex-col gap-y-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <FormItem>
                <FormControl>
                  <motion.div
                    onHoverStart={() => {
                      if (!isLoading) setIsHover(true);
                    }}
                    onHoverEnd={() => setIsHover(false)}
                    className={cn(
                      "relative aspect-square size-full rounded-md min-[500px]:size-64",
                      !isLoading && "cursor-pointer",
                      isImageLoading &&
                        image &&
                        "bg-primary-600/85 dark:bg-primary-300/85",
                    )}
                  >
                    <AnimatePresence>
                      {isLoading && (
                        <div className="absolute z-[2] flex size-full items-center justify-center rounded-md bg-primary-600 font-medium dark:bg-primary-700">
                          <Loader className="size-6 animate-loading text-white" />
                        </div>
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isHover && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, type: "spring" }}
                          className="pointer-events-none absolute z-[2] flex size-full items-center justify-center rounded-md bg-black/50 font-medium"
                        >
                          <ImageUp className="size-6 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {image ? (
                      <CldImage
                        src={image || ""}
                        alt={`Avatar de ${connectedUser.name}`}
                        fill
                        className="rounded-md object-cover"
                        quality={100}
                        sizes="100vw, (min-width: 768px) 50vw, (min-width: 1200px) 35vw"
                        priority
                        onLoad={() => setIsImageLoading(false)}
                      />
                    ) : (
                      <div className="relative size-full overflow-hidden rounded-md bg-black/5 dark:bg-white/10">
                        <UserIcon
                          className="absolute -bottom-20 left-1/2 size-full -translate-x-1/2 fill-neutral-500 text-neutral-500 dark:fill-white dark:text-white sm:-bottom-12 md:-bottom-10 xl:-bottom-12 2xl:-bottom-16 2k:-bottom-20"
                          strokeWidth={0.75}
                        />
                      </div>
                    )}
                    <Input
                      className="absolute inset-0 z-[1] size-full opacity-0"
                      variant="file"
                      type="file"
                      name={name}
                      ref={ref}
                      onChange={(e) => handleChange(e, onChange)}
                      onBlur={onBlur}
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

// ===================================================================================================
