import inquirer from 'inquirer';
import type { Activity } from '../models.js';

/**
 * Pauses CLI execution until the user presses Enter.
 *
 * @returns A promise that resolves once the user continues.
 */
export const pause = async (): Promise<void> => {
  await inquirer.prompt([
    { type: 'input', name: 'pause', message: 'Press Enter to continue...' },
  ]);
};

/**
 * Formats a Date object into a human-readable string for console output.
 * Format: YYYY-MM-DD HH:mm
 *
 * @param d - The Date to format
 * @returns A string in the format YYYY-MM-DD HH:mm
 */
export const formatDateTime = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};

/**
 * Parses a date string in the format YYYY-MM-DD (local time at 00:00).
 *
 * @param value - A string in the format YYYY-MM-DD
 * @returns A valid Date object
 * @throws Error if the format is invalid or the date value is not valid
 *
 * @example
 * parseDateOnly("2026-02-23")
 */

export const parseDateOnly = (value: string): Date => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error('Invalid date format. Use YYYY-MM-DD.');

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);

  const d = new Date(year, monthIndex, day, 0, 0, 0, 0);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date.');

  return d;
};

/**
 * Parses a local datetime string in the format "YYYY-MM-DD HH:mm".
 *
 * @param value - A string in the format YYYY-MM-DD HH:mm
 * @returns A valid Date object in local time
 * @throws Error if the format is invalid or the datetime value is not valid
 *
 * @example
 * parseDateTimeLocal("2026-02-23 18:30")
 */

export const parseDateTimeLocal = (value: string): Date => {
  const match = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error('Invalid datetime format. Use YYYY-MM-DD HH:mm.');

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  const d = new Date(year, monthIndex, day, hour, minute, 0, 0);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid datetime.');

  return d;
};

/**
 * Prints a list of activities with an index and key fields.
 *
 * @param activities - The activities to display
 * @returns void
 */

export const printActivities = (activities: Activity[]): void => {
  if (activities.length === 0) {
    console.log('\nNo activities found.\n');
    return;
  }

  console.log('');
  activities.forEach((a, i) => {
    console.log(
      `${i + 1}. ${a.name} | ${a.category} | ${a.cost} | ${formatDateTime(a.startTime)}`,
    );
  });
  console.log('');
};
