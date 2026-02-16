import { Trip, Activity } from './models.js';

export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce((sum, activity) => {
    return sum + activity.cost;
  }, 0);
};

export const filterActivitiesByCategory = (
  trip: Trip,
  category: 'food' | 'transport' | 'sightseeing',
): Activity[] => {
  return trip.activities.filter((activity) => activity.category === category);
};
