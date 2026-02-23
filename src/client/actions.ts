import inquirer from 'inquirer';
import { randomUUID } from 'node:crypto';

import type { Activity } from '../models.js';
import type { Activity as ActivityType } from '../models.js';

import {
  addActivity,
  calculateTotalCost,
  createTrip,
  filterActivitiesByCategory,
  getActivitiesByDate,
  getHighCostActivities,
  sortActivitiesChronologically,
} from '../itineraryService.js';

import {
  getRemainingBudget,
  getSpendingByCategory,
  setBudget,
  wouldExceedBudget,
} from '../budgetService.js';

import { getDestinationInfo } from '../destinationService.js';

import {
  parseDateOnly,
  parseDateTimeLocal,
  pause,
  printActivities,
} from './helpers.js';
import {
  trips,
  setActiveTripId,
  getActiveTrip,
  requireActiveTrip,
} from './state.js';

type Category = ActivityType['category'];

/**
 * Allows the user to select the active trip from a list.
 * If no trips exist, a message is displayed and the function returns.
 */
export const selectActiveTrip = async (): Promise<void> => {
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

  setActiveTripId(answer.tripId);
  const active = getActiveTrip();
  console.log(`\nActive trip: ${active ? active.destination : 'None'}\n`);
  await pause();
};

/**
 * Creates a new trip, adds it to the in-memory store,
 * and sets it as the active trip.
 */
export const actionCreateTrip = async (): Promise<void> => {
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
  setActiveTripId(trip.id);

  console.log(
    `\nCreated trip "${trip.destination}" starting ${trip.startDate.toDateString()}.\nActive trip set.\n`,
  );
  await pause();
};

export const actionViewTrips = async (): Promise<void> => {
  if (trips.length === 0) {
    console.log('\nNo trips yet.\n');
    await pause();
    return;
  }

  const activeId = getActiveTrip()?.id ?? null;

  console.log('');
  trips.forEach((t, i) => {
    const activeMark = t.id === activeId ? ' (active)' : '';
    console.log(
      `${i + 1}. ${t.destination} | ${t.startDate.toDateString()}${activeMark}`,
    );
  });
  console.log('');
  await pause();
};

// ACTIVITY ACTIONS
export const actionAddActivity = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  const answers = (await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Activity name:',
      validate: (v: string) => (v.trim().length > 0 ? true : 'Required.'),
    },
    {
      type: 'input',
      name: 'cost',
      message: 'Cost (number):',
      validate: (v: string) => {
        const n = Number(v);
        if (Number.isNaN(n)) return 'Must be a number.';
        if (n < 0) return 'Must be >= 0.';
        return true;
      },
      filter: (v: string) => Number(v),
    },
    {
      type: 'rawlist',
      name: 'category',
      message: 'Category:',
      choices: [
        { name: 'food', value: 'food' },
        { name: 'transport', value: 'transport' },
        { name: 'sightseeing', value: 'sightseeing' },
      ],
    },
    {
      type: 'input',
      name: 'startTime',
      message: 'Start time (YYYY-MM-DD HH:mm):',
      validate: (v: string) => {
        try {
          parseDateTimeLocal(v.trim());
          return true;
        } catch (e) {
          return e instanceof Error ? e.message : 'Invalid datetime.';
        }
      },
    },
  ])) as { name: string; cost: number; category: Category; startTime: string };

  const activity: Activity = {
    id: randomUUID(),
    name: answers.name.trim(),
    cost: Number(answers.cost),
    category: answers.category,
    startTime: parseDateTimeLocal(answers.startTime.trim()),
  };

  if (wouldExceedBudget(trip, activity)) {
    const remaining = (() => {
      try {
        return getRemainingBudget(trip);
      } catch {
        return undefined;
      }
    })();

    const message =
      remaining !== undefined
        ? `This activity would exceed your remaining budget (${remaining}). Add anyway?`
        : 'This activity would exceed your budget. Add anyway?';

    const confirm = (await inquirer.prompt([
      { type: 'confirm', name: 'proceed', message, default: false },
    ])) as { proceed: boolean };

    if (!confirm.proceed) {
      console.log('\nCancelled.\n');
      await pause();
      return;
    }
  }

  const activities = addActivity(trip, activity);
  console.log(`\nAdded! You now have ${activities.length} activities.\n`);
  await pause();
};

export const actionViewActivitiesForDay = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  const answers = (await inquirer.prompt([
    {
      type: 'input',
      name: 'date',
      message: 'Which day? (YYYY-MM-DD):',
      validate: (v: string) => {
        try {
          parseDateOnly(v.trim());
          return true;
        } catch (e) {
          return e instanceof Error ? e.message : 'Invalid date.';
        }
      },
    },
  ])) as { date: string };

  const date = parseDateOnly(answers.date.trim());
  const activities = getActivitiesByDate(trip, date);
  const sorted = [...activities].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime(),
  );

  console.log(`\nActivities on ${date.toDateString()}:\n`);
  printActivities(sorted);
  await pause();
};

export const actionFilterByCategory = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  const answers = (await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'category',
      message: 'Pick a category:',
      choices: [
        { name: 'food', value: 'food' },
        { name: 'transport', value: 'transport' },
        { name: 'sightseeing', value: 'sightseeing' },
      ],
    },
  ])) as { category: Category };

  const activities = filterActivitiesByCategory(trip, answers.category);
  console.log(`\nActivities in category "${answers.category}":\n`);
  printActivities(activities);
  await pause();
};

export const actionHighCost = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  const answers = (await inquirer.prompt([
    {
      type: 'input',
      name: 'threshold',
      message: 'Minimum cost (number):',
      validate: (v: string) => {
        const n = Number(v);
        if (Number.isNaN(n)) return 'Must be a number.';
        if (n < 0) return 'Must be >= 0.';
        return true;
      },
      filter: (v: string) => Number(v),
    },
  ])) as { threshold: number };

  const activities = getHighCostActivities(trip, Number(answers.threshold));
  const sorted = [...activities].sort((a, b) => b.cost - a.cost);

  console.log(`\nActivities costing >= ${answers.threshold}:\n`);
  printActivities(sorted);
  await pause();
};

export const actionViewSorted = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  const sorted = sortActivitiesChronologically(trip);
  console.log(`\nAll activities for "${trip.destination}" (sorted):\n`);
  printActivities(sorted);
  await pause();
};

export const actionTotalCost = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  const total = calculateTotalCost(trip);
  console.log(`\nTotal cost for "${trip.destination}": ${total}\n`);
  await pause();
};

// DESTINATION
export const actionDestinationInfo = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  try {
    const info = await getDestinationInfo(trip.destination);
    console.log(
      `\nDestination info for "${trip.destination}":\nCurrency: ${info.currency}\nFlag: ${info.flag}\n`,
    );
  } catch (e) {
    console.log(
      `\n${e instanceof Error ? e.message : 'Could not fetch info.'}\n`,
    );
  }

  await pause();
};

// BUDGET
export const actionSetBudget = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  const answers = (await inquirer.prompt([
    {
      type: 'input',
      name: 'budget',
      message: 'Set budget (number):',
      validate: (v: string) => {
        const n = Number(v);
        if (Number.isNaN(n)) return 'Must be a number.';
        if (n < 0) return 'Must be >= 0.';
        return true;
      },
      filter: (v: string) => Number(v),
    },
  ])) as { budget: number };

  const newBudget = setBudget(trip, Number(answers.budget));
  console.log(`\nBudget set to: ${newBudget}\n`);
  await pause();
};

export const actionRemainingBudget = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  try {
    const remaining = getRemainingBudget(trip);
    console.log(`\nRemaining budget: ${remaining}\n`);
  } catch (e) {
    console.log(`\n${e instanceof Error ? e.message : 'No budget set.'}\n`);
  }

  await pause();
};

export const actionSpendingBreakdown = async (): Promise<void> => {
  const trip = await requireActiveTrip(selectActiveTrip);
  if (!trip) return;

  const breakdown = getSpendingByCategory(trip);
  console.log(`\nSpending breakdown for "${trip.destination}":\n`);
  console.log(`food: ${breakdown.food}`);
  console.log(`transport: ${breakdown.transport}`);
  console.log(`sightseeing: ${breakdown.sightseeing}\n`);
  await pause();
};
