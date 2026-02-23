import type { Trip } from '../models.js';
import { pause } from './helpers.js';

/**
 * Store en memoria del CLI.
 * Nota: esto se resetea cada vez que el proceso termina.
 */
export const trips: Trip[] = [];
export let activeTripId: string | null = null;

/**
 * Setea el viaje activo por id.
 *
 * @param tripId - ID del trip a marcar como activo
 */
export const setActiveTripId = (tripId: string | null): void => {
  activeTripId = tripId;
};

/**
 * Obtiene el trip activo actual.
 *
 * @returns Trip activo o undefined si no hay seleccionado
 */
export const getActiveTrip = (): Trip | undefined => {
  if (activeTripId === null) return undefined;
  return trips.find((t) => t.id === activeTripId);
};

/**
 * Garantiza que exista un trip activo.
 * - Si ya hay uno, lo retorna.
 * - Si no hay trips, muestra mensaje y retorna undefined.
 * - Si hay trips pero no activo, invoca el selector para que el usuario elija.
 *
 * @param selectActiveTrip - Callback que muestra el prompt y setea el trip activo.
 * @returns Trip activo o undefined si no se pudo obtener
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
