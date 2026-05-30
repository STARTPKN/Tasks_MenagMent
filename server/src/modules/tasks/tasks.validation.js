import { z } from "zod";
import { validate } from "../auth/auth.validation.js";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "NORMAL", "LOW"]).optional().default("NORMAL"),
  stage: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional().default("TODO"),
  team: z.array(z.string()).optional().default([]),
  assets: z.array(z.string()).optional().default([]),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  date: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "NORMAL", "LOW"]).optional(),
  stage: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
  team: z.array(z.string()).optional(),
});

export const createSubTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().optional(),
  tag: z.string().min(1, "Tag is required"),
});

export const createActivitySchema = z.object({
  type: z.enum(["started", "completed", "in_progress", "commented", "bug", "assigned"]),
  activity: z.string().min(1, "Activity description is required"),
});

export { validate };
