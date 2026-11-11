import { z } from "zod";

export const CreateMediaSchema = z.object({
  modelType: z.string().min(1),
  modelId: z.string().min(1),
  collectionName: z.string().default("default"),
  fileName: z.string().min(1),
  storageKey: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().nonnegative(),
  customProperties: z.record(z.string(), z.unknown()).default({}),
});

export const MediaDtoSchema = z.object({
  id: z.uuid(),
  modelType: z.string(),
  modelId: z.string(),
  collectionName: z.string(),
  fileName: z.string(),
  storageKey: z.string(),
  mimeType: z.string(),
  size: z.number().int().nonnegative(),
  customProperties: z.record(z.string(), z.unknown()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type MediaDto = z.infer<typeof MediaDtoSchema>;
export type CreateMediaInput = z.infer<typeof CreateMediaSchema>;
