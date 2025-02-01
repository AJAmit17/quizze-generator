import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const careerSchema = z.object({
  interest: z.string().min(2, {
    message: "Career interest must be at least 2 characters.",
  }),
});

export const roleSchema = z.object({
  roles: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
});

export type CareerRole = {
  title: string;
  description: string;
};