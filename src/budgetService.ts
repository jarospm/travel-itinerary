import { Trip, Activity } from './models.js';
import { calculateTotalCost } from './itineraryService.js';

/** Sets a budget limit for a trip. Returns the updated budget. */
export const setBudget = (trip: Trip, amount: number): number => {
  trip.budget = amount;
  return trip.budget;
};

/** Returns remaining budget (limit minus total activity costs). */
export const getRemainingBudget = (trip: Trip): number => {
  if (trip.budget === undefined) {
    throw new Error('No budget set for this trip');
  }

  return trip.budget - calculateTotalCost(trip);
};

/** Checks if adding an activity would exceed the budget. */
export const wouldExceedBudget = (trip: Trip, activity: Activity): boolean => {
  if (trip.budget === undefined) {
    return false;
  }

  return calculateTotalCost(trip) + activity.cost > trip.budget;
};

/** Returns total spending grouped by activity category. */
export const getSpendingByCategory = (
  trip: Trip,
): Record<Activity['category'], number> => {
  // Start with zero for each category, then accumulate costs
  return trip.activities.reduce(
    (breakdown, activity) => {
      breakdown[activity.category] += activity.cost;
      return breakdown;
    },
    { food: 0, transport: 0, sightseeing: 0 },
  );
};
