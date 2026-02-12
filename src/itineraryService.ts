import { Trip } from './models.js';

export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce((sum, activity) => {
    return sum + activity.cost;
  }, 0);
};

export const createTrip = (
  id: string,
  destination: string,
  startDate: Date,
): Trip => ({
  id,
  destination,
  startDate,
  activities: [],
});
