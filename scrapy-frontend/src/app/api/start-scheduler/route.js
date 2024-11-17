// pages/api/start-scheduler.js
import startPriceCheckScheduler from '../../../scheduler/scheduleInterval'; // Adjust path if necessary

let schedulerStarted = false; // To prevent multiple starts

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (!schedulerStarted) {
      startPriceCheckScheduler(); // Start the scheduler
      schedulerStarted = true; // Ensure it only starts once
      res.status(200).json({ message: 'Scheduler started' });
    } else {
      res.status(400).json({ message: 'Scheduler is already running' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
