// src/scheduler/scheduleInterval.js
import { checkPrices } from './priceChecker'; // Your function to check prices

export default function startPriceCheckScheduler() {
  // This will run every 5 minutes (300000 milliseconds)
  setInterval(() => {
    console.log('Running price check...');
    checkPrices(); // Call your price-checking logic here
  }, 300000); // 5 minutes in milliseconds
}
