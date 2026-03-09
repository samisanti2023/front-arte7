import { z } from "zod";

export const genreFormSchema = z.object({
  type: z.string().trim().min(2, "Tipo requerido"),
});

export type GenreFormSchema = z.infer<typeof genreFormSchema>;
