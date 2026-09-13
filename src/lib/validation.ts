import { z } from "zod";
import { addDaysYmd, isClosedDate, ymdInYaounde } from "@/lib/opening-hours";

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
  const today = ymdInYaounde();
  if (data.date < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La date ne peut pas être dans le passé",
      path: ["date"],
    });
  }
  if (data.date > addDaysYmd(today, 90)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Les réservations sont ouvertes jusqu'à 90 jours",
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

  if (isClosedDate(data.date)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Le restaurant est fermé ce jour-là",
      path: ["date"],
    });
  }
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

export const menuCategoryValues = [
  "grillades",
  "specialites",
  "cocktails",
  "boissons",
] as const;

export const menuBadgeValues = [
  "Incontournable",
  "Nouveau",
  "Chef",
  "Signature",
] as const;

export const menuDishSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(8).max(500),
  price: z.coerce.number().int().min(0).max(1_000_000),
  category: z.enum(menuCategoryValues),
  badge: z.union([z.enum(menuBadgeValues), z.literal(""), z.null()]).optional(),
  spices: z.string().trim().max(200).optional(),
  isVegetarian: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
  image: z.string().trim().max(300).optional(),
});

export const liveEventSchema = z.object({
  title: z.string().trim().min(2).max(120),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().min(1).max(20),
  artist: z.string().trim().min(2).max(120),
  genre: z.string().trim().min(2).max(80),
  description: z.string().trim().min(8).max(500),
  image: z.string().trim().max(300).optional(),
  isPublished: z.boolean().optional(),
});
