import { SpaceChoice as PrismaSpaceChoice } from "@prisma/client";

/** Le front utilise des tirets ("privatisation-vip"), Prisma des underscores (contrainte des enums). */
export function toPrismaSpaceChoice(space: string): PrismaSpaceChoice {
  return space.replace(/-/g, "_") as PrismaSpaceChoice;
}

export function fromPrismaSpaceChoice(space: PrismaSpaceChoice): string {
  return space.replace(/_/g, "-");
}

export const spaceLabels: Record<string, string> = {
  terrasse: "Terrasse",
  salle: "Salle Principale",
  vip: "VIP Lounge",
  "privatisation-vip": "Privatisation VIP",
};

export const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  RESCHEDULED: "Décalée",
  OTHER: "Autre",
};
