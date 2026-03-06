import { z } from "zod";

export const actorFormSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido"),
  photo: z.string().trim().url("La foto debe ser una URL valida"),
  nationality: z.string().trim().min(2, "Nacionalidad requerida"),
  birthDate: z
    .string()
    .trim()
    .min(1, "Fecha requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado YYYY-MM-DD"),
  biography: z.string().trim().min(10, "Biografia requerida"),
  movieIds: z.array(z.string()).min(1, "Debes asociar al menos una pelicula"),
});

export type ActorFormSchema = z.infer<typeof actorFormSchema>;
