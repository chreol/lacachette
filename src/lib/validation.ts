import { z } from "zod";

export const spaceChoiceValues = ["terrasse", "salle", "vip", "privatisation-vip"] as const;

export const reservationInputSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s]{8,20}$/, "Numéro de téléphone invalide"),
  email: z
    .union([z.literal(""), z.string().trim().email("Email invalide")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  date: z.string().trim().min(1, "Date requise"),
  time: z.string().trim().min(1, "Heure requise"),
  guests: z.coerce.number().int().min(1).max(50),
  space: z.enum(spaceChoiceValues),
  message: z.string().trim().max(1000).optional(),
}).superRefine((data, ctx) => {
  // Validate that the date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(data.date);
  if (inputDate < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La date ne peut pas être dans le passé",
      path: ["date"],
    });
  }

  // Validate that the time matches HH:MM format
  if (!/^([01]?\d|2[0-3]):[0-5]\d$/.test(data.time)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Format d'heure invalide (HH:MM attendu)",
      path: ["time"],
    });
  }

  // Note: slot availability is checked at the API level (not in Zod)
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;

export const reservationStatusValues = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "RESCHEDULED",
  "OTHER",
] as const;

export const updateReservationSchema = z.object({
  status: z.enum(reservationStatusValues),
  statusNote: z.string().trim().max(500).optional(),
  date: z.string().trim().optional(),
  time: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const createStaffSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum"),
  name: z.string().trim().min(2).max(100),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
});
