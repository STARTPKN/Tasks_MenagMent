import { z } from "zod";
import { validate } from "../auth/auth.validation.js";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "USER"]).optional().default("USER"),
  title: z.string().optional().default("Member"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  title: z.string().optional(),
  isActive: z.boolean().optional(),
});

export { validate };
