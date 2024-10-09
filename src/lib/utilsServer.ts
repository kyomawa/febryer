"use server";

import { revalidateTag } from "next/cache";

// ==========================================================================================================

export const formDataStringToArray = async (fieldValue: FormDataEntryValue | null): Promise<string[] | []> => {
  if (typeof fieldValue === "string" && fieldValue.trim() !== "") {
    return fieldValue.split(",").map((value) => value.trim());
  }
  return [];
};

// ==========================================================================================================

export const generatePassword = async (length: number) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// ==========================================================================================================

export const RevalidateSpecificTag = (tagName: string) => {
  revalidateTag(tagName);
};
