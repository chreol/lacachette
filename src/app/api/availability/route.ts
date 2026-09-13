import { NextResponse } from 'next/server';
import { ymdInYaounde } from '@/lib/opening-hours';
import { getAvailableSlots, getDateAvailability, ZONE_CONFIG } from '@/lib/availability';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const space = searchParams.get('space');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    if (!space || !ZONE_CONFIG[space]) {
      return NextResponse.json({ error: 'Invalid or missing space' }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T12:00:00Z`))) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (date < ymdInYaounde()) {
      return NextResponse.json({ error: 'Date cannot be in the past' }, { status: 400 });
    }

    const slots = await getAvailableSlots(date, space);
    const dateStatus = await getDateAvailability(date, space);

    return NextResponse.json({
      slots,
      dateStatus
    });

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Availability API Error:', error);
    return NextResponse.json({ error: 'Internal server error', detail: msg }, { status: 500 });
  }
}
