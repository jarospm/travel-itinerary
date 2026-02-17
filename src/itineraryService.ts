import { Trip, Activity } from './models.js';

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

export const getHighCostActivities = (
  trip: Trip,
  minimumCost: number,
): Activity[] => {
  return trip.activities.filter((activity) => activity.cost >= minimumCost);
};

export const getActivitiesByDate = (trip: Trip, date: Date): Activity[] => {
  return trip.activities.filter((activity) => {
    return (
      activity.startTime.getFullYear() === date.getFullYear() &&
      activity.startTime.getMonth() === date.getMonth() &&
      activity.startTime.getDate() === date.getDate()
    );
  });
};

export const filterActivitiesByCategory = (
  trip: Trip,
  category: 'food' | 'transport' | 'sightseeing',
): Activity[] => {
  return trip.activities.filter((activity) => activity.category === category);
};

export const sortActivitiesChronologically = (trip: Trip): Activity[] => {
  return [...trip.activities].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime(),
  );
};

export const addActivity = (trip: Trip, activity: Activity): Activity[] => {
  trip.activities.push(activity);
  return trip.activities;
};
