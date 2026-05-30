import { z } from "zod";

export const uploadFileSchema = z.object({
  folder: z.string().optional().default("task-manager/files"),
  publicId: z.string().optional(),
});

export const validateUploadFile = (data) => {
  return uploadFileSchema.parse(data);
};
