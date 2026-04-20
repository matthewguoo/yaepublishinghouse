import { NextResponse } from 'next/server';
import { prepareHandleReservation } from '../../../../lib/data';

export async function POST(request) {
  try {
    const { email = '', handle = '' } = await request.json();
    const reservation = await prepareHandleReservation({ email, rawHandle: handle });
    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Could not reserve that handle.' },
      { status: 400 }
    );
  }
}
