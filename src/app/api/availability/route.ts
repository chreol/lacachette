import { NextResponse } from 'next/server';
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

    // Validate date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (selectedDate < today) {
      return NextResponse.json({ error: 'Date cannot be in the past' }, { status: 400 });
    }

    const slots = await getAvailableSlots(date, space);
    const dateStatus = await getDateAvailability(date, space);

    return NextResponse.json({
      slots,
      dateStatus
    });

  } catch (error) {
    console.error('Availability API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
