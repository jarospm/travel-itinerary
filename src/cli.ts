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

//Generic CLI helpers
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

// trip state helpers

const getActiveTrip = (): Trip | undefined => {
  if (activeTripId === null) return undefined;
  return trips.find((t) => t.id === activeTripId);
};

const requireActiveTrip = async (): Promise<Trip | undefined> => {
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

const actionCreateTrip = async (): Promise<void> => {
  const answers = (await inquirer.prompt([
    {
      type: 'input',
      name: 'destination',
      message: 'Destination (country/city name):',
      validate: (v: string) => (v.trim().length > 0 ? true : 'Required.'),
    },
    {
      type: 'input',
      name: 'startDate',
      message: 'Start date (YYYY-MM-DD):',
      validate: (v: string) => {
        try {
          parseDateOnly(v.trim());
          return true;
        } catch (e) {
          return e instanceof Error ? e.message : 'Invalid date.';
        }
      },
    },
  ])) as { destination: string; startDate: string };

  const trip = createTrip(
    randomUUID(),
    answers.destination.trim(),
    parseDateOnly(answers.startDate.trim()),
  );

  trips.push(trip);
  activeTripId = trip.id;

  console.log(
    `\nCreated trip "${trip.destination}" starting ${trip.startDate.toDateString()}.\nActive trip set.\n`,
  );
  await pause();
};

const actionViewTrips = async (): Promise<void> => {
  if (trips.length === 0) {
    console.log('\nNo trips yet.\n');
    await pause();
    return;
  }

  console.log('');
  trips.forEach((t, i) => {
    const activeMark = t.id === activeTripId ? ' (active)' : '';
    console.log(
      `${i + 1}. ${t.destination} | ${t.startDate.toDateString()}${activeMark}`,
    );
  });
  console.log('');
  await pause();
};

const selectActiveTrip = async (): Promise<void> => {
  if (trips.length === 0) {
    console.log('\nNo trips to select.\n');
    await pause();
    return;
  }

  const answer = (await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'tripId',
      message: 'Select active trip:',
      choices: trips.map((t) => ({
        name: `${t.destination} | ${t.startDate.toDateString()}`,
        value: t.id,
      })),
    },
  ])) as { tripId: string };

  activeTripId = answer.tripId;
  const active = getActiveTrip();
  console.log(`\nActive trip: ${active ? active.destination : 'None'}\n`);
  await pause();
};
