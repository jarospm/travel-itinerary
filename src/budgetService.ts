import { Trip } from './models.js';

/** Sets a budget limit for a trip. Returns the updated budget. */
export const setBudget = (trip: Trip, amount: number): number => {
  // TODO: Implement
  return 0;
};

/** Returns remaining budget (limit minus total activity costs). */
export const getRemainingBudget = (trip: Trip): number => {
  // TODO: Implement
  return 0;
};

/** Checks if adding an activity cost would exceed the budget. */
export const wouldExceedBudget = (trip: Trip, cost: number): boolean => {
  // TODO: Implement
  return false;
};

/** Returns total spending grouped by activity category. */
export const getSpendingByCategory = (
  trip: Trip,
): Record<string, number> => {
  // TODO: Implement
  return {};
};
