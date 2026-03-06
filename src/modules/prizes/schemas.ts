import { z } from "zod";

export const prizeFormSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido"),
  category: z.string().trim().min(2, "Categoria requerida"),
  year: z.coerce.number().int("Anio invalido").min(1900, "Anio invalido"),
  status: z.enum(["won", "nominated"]),
});

export type PrizeFormSchema = z.infer<typeof prizeFormSchema>;
