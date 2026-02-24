import type { Trip } from '../models.js';
import { pause } from './helpers.js';

/**
 * In-memory store used by the CLI.
 * Note: this data is reset every time the process terminates.
 */
export const trips: Trip[] = [];
export let activeTripId: string | null = null;

/**
 * Sets the active trip by its ID.
 *
 * @param tripId - The ID of the trip to mark as active
 */
export const setActiveTripId = (tripId: string | null): void => {
  activeTripId = tripId;
};

/**
 * Returns the currently active trip.
 *
 * @returns The active Trip, or undefined if none is selected
 */
export const getActiveTrip = (): Trip | undefined => {
  if (activeTripId === null) return undefined;
  return trips.find((t) => t.id === activeTripId);
};

/**
 * Ensures that an active trip exists.
 * - If an active trip is already set, it returns it.
 * - If no trips exist, it displays a message and returns undefined.
 * - If trips exist but none is active, it invokes the selector
 *   so the user can choose one.
 *
 * @param selectActiveTrip - Callback that prompts the user
 * and sets the active trip.
 * @returns The active Trip, or undefined if one could not be obtained
 *
 * @example
 * const trip = await requireActiveTrip(selectActiveTrip);
 * if (!trip) return;
 */
export const requireActiveTrip = async (
  selectActiveTrip: () => Promise<void>,
): Promise<Trip | undefined> => {
  const active = getActiveTrip();
  if (active) return active;

  if (trips.length === 0) {
    console.log('\nYou have no trips yet. Create one first.\n');
    await pause();
    return undefined;
  }

  console.log('\nNo active trip selected.\n');
  await selectActiveTrip();
  return getActiveTrip();
};
