import { Trip, Activity } from './models.js';

export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce((sum, activity) => {
    return sum + activity.cost;
  }, 0);
};

export const getHighCostActivities = (
  trip: Trip,
  minimumCost: number,
): Activity[] => {
  return trip.activities.filter((activity) => activity.cost >= minimumCost);
};
