import { Activity, Trip } from './models.js';

export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce((sum, activity) => {
    return sum + activity.cost;
  }, 0);
};

export const addActivity = (trip: Trip, activity: Activity): void => {
  trip.activities.push(activity);
};
