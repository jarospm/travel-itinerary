// Note imports
import inquirer from 'inquirer';
import { randomUUID } from 'node:crypto';

import type { Activity, Trip } from './models.js';

import {
  addActivity,
  calculateTotalCost,
  createTrip,
  filterActivitiesByCategory,
  getActivitiesByDate,
  getHighCostActivities,
  sortActivitiesChronologically,
} from './itineraryService.js';

import {
  getRemainingBudget,
  getSpendingByCategory,
  setBudget,
  wouldExceedBudget,
} from './budgetService.js';

import { getDestinationInfo } from './destinationService.js';

type Category = Activity['category'];

// STATE (In-Memory Store)
const trips: Trip[] = [];
let activeTripId: string | null = null;

const pause = async (): Promise<void> => {
  await inquirer.prompt([
    { type: 'input', name: 'pause', message: 'Press Enter to continue...' },
  ]);
};

const formatDateTime = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};

const parseDateOnly = (value: string): Date => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error('Invalid date format. Use YYYY-MM-DD.');
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const d = new Date(year, monthIndex, day, 0, 0, 0, 0);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date.');
  return d;
};

const parseDateTimeLocal = (value: string): Date => {
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

const printActivities = (activities: Activity[]): void => {
  if (activities.length === 0) {
    console.log('\nNo activities found.\n');
    return;
  }

  console.log('');
  activities.forEach((a, i) => {
    console.log(
      `${i + 1}. ${a.name} | ${a.category} | ${a.cost} | ${formatDateTime(
        a.startTime,
      )}`,
    );
  });
  console.log('');
};
