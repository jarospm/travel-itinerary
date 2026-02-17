import { Trip, Activity } from './models.js';

export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce((sum, activity) => {
    return sum + activity.cost;
  }, 0);
};

export const sortActivitiesChronologically = (trip: Trip): Activity[] => {
  return [...trip.activities].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime(),
  );
};
