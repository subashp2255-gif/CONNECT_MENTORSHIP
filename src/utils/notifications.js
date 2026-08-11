import { useStore } from '../store/useStore';

/**
 * Simulates triggering session reminders without backend polling.
 * For development/testing purposes, the times are compressed:
 * - 24h reminder triggers in 5 seconds
 * - 15min reminder triggers in 2 seconds (after the 24h one, or just set both to short intervals)
 */
export const triggerSimulatedReminders = (mentorName, dateText, timeText) => {
  const { addNotification } = useStore.getState();

  // Compressed 24h reminder (5 seconds)
  setTimeout(() => {
    addNotification(`Reminder: Session with ${mentorName} tomorrow at ${timeText}`);
  }, 5000);

  // Compressed 15min reminder (7 seconds to trigger after the "24h" one)
  setTimeout(() => {
    addNotification(`Your session starts in 15 minutes!`);
  }, 7000);
};
