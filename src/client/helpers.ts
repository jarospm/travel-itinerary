import inquirer from 'inquirer';
import type { Activity } from '../models.js';

/**
 * Pausa la ejecución del CLI hasta que el usuario presione Enter.
 *
 * @returns Promise<void>
 */
export const pause = async (): Promise<void> => {
  await inquirer.prompt([
    { type: 'input', name: 'pause', message: 'Press Enter to continue...' },
  ]);
};

/**
 * Formatea un Date en string legible para consola.
 * Formato: YYYY-MM-DD HH:mm
 *
 * @param d - Fecha a formatear
 * @returns String con el formato YYYY-MM-DD HH:mm
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
 * Parsea una fecha en formato YYYY-MM-DD (hora local 00:00).
 *
 * @param value - Texto con formato YYYY-MM-DD
 * @returns Date válido
 * @throws Error si el formato o el valor no es válido
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
 * Parsea un datetime en formato local: "YYYY-MM-DD HH:mm".
 *
 * @param value - Texto con formato YYYY-MM-DD HH:mm
 * @returns Date válido en hora local
 * @throws Error si el formato o el valor no es válido
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
 * Imprime una lista de actividades con índice y campos clave.
 *
 * @param activities - Actividades a imprimir
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
