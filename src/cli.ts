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
