import { z } from "zod";

export const movieFormSchema = z.object({
  title: z.string().trim().min(2, "Titulo requerido"),
  poster: z.string().trim().url("Poster invalido"),
  duration: z.coerce.number().min(1, "Duracion requerida"),
  country: z.string().trim().min(2, "Pais requerido"),
  releaseDate: z
    .string()
    .trim()
    .min(1, "Fecha requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado YYYY-MM-DD"),
  popularity: z.coerce.number().min(1, "Popularidad minima 1").max(5, "Popularidad maxima 5"),
});

export type MovieFormSchema = z.infer<typeof movieFormSchema>;
