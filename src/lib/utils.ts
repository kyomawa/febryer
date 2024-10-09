import { clsx, type ClassValue } from "clsx";
import { Dispatch } from "react";
import { twMerge } from "tailwind-merge";
import imageCompression from "browser-image-compression";

// ==========================================================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==========================================================================================================

export function createFormData<T extends Record<string, unknown>>(values: T): FormData {
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    const value = values[key];

    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return formData;
}

// ==========================================================================================================

export type MessageProps = { success: boolean; message: string };

// ==========================================================================================================

export function updateScrollState(latest: number, prev: number, setter: Dispatch<React.SetStateAction<boolean>>): void {
  if (latest < prev) {
    setter(false);
  } else if (latest > 64 && latest > prev) {
    setter(true);
  }
}

// ==========================================================================================================

const imageCompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
};

export const onImageChangeCompress = async (
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: (...event: unknown[]) => void,
  setCompressedFile: React.Dispatch<React.SetStateAction<File | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  enableSubmit?: () => void
) => {
  setIsLoading(true);
  const file = event?.target?.files?.[0];
  if (file) {
    try {
      const compressedBlob: Blob = await imageCompression(file, imageCompressionOptions);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
      setCompressedFile(compressedFile);
      onChange(compressedFile);
      if (enableSubmit) {
        enableSubmit();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
};
