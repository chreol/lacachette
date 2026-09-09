-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'RESCHEDULED', 'OTHER');

-- CreateEnum
CREATE TYPE "SpaceChoice" AS ENUM ('terrasse', 'salle', 'vip', 'privatisation_vip');

-- CreateTable
CREATE TABLE "StaffUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "space" "SpaceChoice" NOT NULL,
    "message" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "statusNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_email_key" ON "StaffUser"("email");
