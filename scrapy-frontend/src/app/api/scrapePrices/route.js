// src/app/api/scrapePrices/route.js
import { NextResponse } from 'next/server';
import { schedulePriceCheck } from '../../../scheduler/priceChecker.js'; // Import your schedule function

export async function GET() {
  try {
    // Run the price-checking logic
    schedulePriceCheck();
    return NextResponse.json({ message: 'Price check initiated successfully.' });
  } catch (error) {
    console.error('Error initiating price check:', error);
    return NextResponse.json({ error: 'Failed to initiate price check.' }, { status: 500 });
  }
}
