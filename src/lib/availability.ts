import { prisma } from '@/lib/prisma';
import { toPrismaSpaceChoice } from '@/lib/reservation-mapping';
import {
  clockToMinutes,
  isClosedDate,
  nowMinutesInYaounde,
  slotsForDateAndSpace,
  ymdInYaounde,
} from '@/lib/opening-hours';
import { getSiteContent } from '@/lib/site-content';

export interface ZoneConfig {
  capacity: number;
  slots: string[];
  label: string;
  exclusive?: boolean;
}

export interface SlotAvailability {
  time: string;
  status: 'available' | 'limited' | 'full';
  remainingCapacity: number;
  totalCapacity: number;
}

export const RESERVATION_DURATION_MINUTES = 120;

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  // Treat 00:00 as 24:00 if it's likely an end time (not early morning)
  if (h === 0 && m === 0) return 24 * 60; 
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  if (mins === 24 * 60) return '00:00';
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function generateSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  for (let m = startMins; m <= endMins; m += intervalMinutes) {
    slots.push(minutesToTime(m));
  }
  return slots;
}

export const ZONE_CONFIG: Record<string, ZoneConfig> = {
  terrasse:           { capacity: 15, slots: [], label: 'Terrasse' },
  salle:              { capacity: 20, slots: [], label: 'Salle Principale' },
  vip:                { capacity: 4,  slots: [], label: 'VIP Lounge' },
  'privatisation-vip':{ capacity: 2,  slots: [], label: 'Privatisation VIP', exclusive: true },
};

export async function getAvailableSlots(date: string, space: string): Promise<SlotAvailability[]> {
  const config = ZONE_CONFIG[space];
  if (!config) throw new Error(`Invalid space: ${space}`);

  const site = await getSiteContent();
  if (isClosedDate(date, site.weekHours)) {
    return [];
  }

  const daySlots = slotsForDateAndSpace(date, space, site.weekHours);
  const prismaSpace = toPrismaSpaceChoice(space);
  
  const reservations = await prisma.reservation.findMany({
    where: {
      date: date,
      space: prismaSpace,
      status: {
        not: 'CANCELLED'
      }
    }
  });

  const todayStr = ymdInYaounde();
  const isToday = date === todayStr;
  let nowMinutes = isToday ? nowMinutesInYaounde() : -1;
  if (isToday && nowMinutes < 6 * 60) nowMinutes += 24 * 60;

  const slotsAvailability: SlotAvailability[] = [];
  const isPrivatisationVIPAllFull = space === 'privatisation-vip' && reservations.length > 0;

  for (const slotTime of daySlots) {
    let slotMins = clockToMinutes(slotTime, false);
    if (slotMins < 6 * 60) slotMins += 24 * 60;

    if (isToday && slotMins <= nowMinutes) {
      continue;
    }

    let overlappingGuests = 0;
    let hasExclusive = false;

    for (const res of reservations) {
      // timeToMinutes handles standard times. Note that DB time must be like '12:00'
      let resMins = 0;
      const [h, m] = res.time.split(':').map(Number);
      resMins = h * 60 + m;
      if (resMins < 6 * 60) resMins += 24 * 60;
      
      const resEndMins = resMins + RESERVATION_DURATION_MINUTES;

      // Overlaps if the slot falls within [resMins, resMins + duration)
      if (slotMins >= resMins && slotMins < resEndMins) {
        overlappingGuests += res.guests;
        if (config.exclusive) {
          hasExclusive = true;
        }
      }
    }

    let remainingCapacity = config.capacity - overlappingGuests;
    
    if (hasExclusive || isPrivatisationVIPAllFull) {
      remainingCapacity = 0;
    }

    let status: 'available' | 'limited' | 'full' = 'available';
    if (remainingCapacity <= 0) {
      status = 'full';
    } else if (remainingCapacity <= config.capacity / 2) {
      status = 'limited';
    }

    slotsAvailability.push({
      time: slotTime,
      status,
      remainingCapacity: Math.max(0, remainingCapacity),
      totalCapacity: config.capacity
    });
  }

  return slotsAvailability;
}

export async function isSlotAvailable(date: string, time: string, space: string, guests: number): Promise<boolean> {
  const slots = await getAvailableSlots(date, space);
  const targetSlot = slots.find(s => s.time === time);
  
  if (!targetSlot) return false;
  return targetSlot.remainingCapacity >= guests;
}

export async function getDateAvailability(date: string, space: string): Promise<'available' | 'limited' | 'full' | 'closed'> {
  const site = await getSiteContent();
  if (isClosedDate(date, site.weekHours)) return 'closed';

  const slots = await getAvailableSlots(date, space);
  
  if (slots.length === 0) return 'full';
  
  const allFull = slots.every(s => s.status === 'full');
  if (allFull) return 'full';
  
  const someLimited = slots.some(s => s.status === 'limited' || s.status === 'full');
  if (someLimited) return 'limited';
  
  return 'available';
}
