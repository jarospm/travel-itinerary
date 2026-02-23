import inquirer from 'inquirer';
import { getActiveTrip } from './state.js';

import {
  actionAddActivity,
  actionCreateTrip,
  actionDestinationInfo,
  actionFilterByCategory,
  actionHighCost,
  actionRemainingBudget,
  actionSetBudget,
  actionSpendingBreakdown,
  actionTotalCost,
  actionViewActivitiesForDay,
  actionViewSorted,
  actionViewTrips,
  selectActiveTrip,
} from './actions.js';

/**
 * CLI entry point: displays the main menu and dispatches actions
 * based on the user's selection.
 */
const mainMenu = async (): Promise<void> => {
  console.log('\nTravel Itinerary CLI\n');

  let exit = false;
  while (!exit) {
    const active = getActiveTrip();

    const answers = (await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'action',
        message: active
          ? `What would you like to do? (Active: ${active.destination})`
          : 'What would you like to do?',
        choices: [
          { name: 'Create a new trip', value: 'createTrip' },
          { name: 'View trips', value: 'viewTrips' },
          { name: 'Select active trip', value: 'selectTrip' },
          new inquirer.Separator(),
          { name: 'Add an activity', value: 'addActivity' },
          { name: 'View activities for a specific day', value: 'viewByDay' },
          {
            name: 'View activities sorted chronologically',
            value: 'viewSorted',
          },
          { name: 'Filter activities by category', value: 'filterCategory' },
          {
            name: 'Identify high-cost activities (threshold)',
            value: 'highCost',
          },
          { name: 'Calculate total cost of trip', value: 'totalCost' },
          new inquirer.Separator(),
          { name: 'Get destination info (currency, flag)', value: 'destInfo' },
          { name: 'Set a budget', value: 'setBudget' },
          { name: 'View remaining budget', value: 'remainingBudget' },
          { name: 'View spending breakdown by category', value: 'breakdown' },
          new inquirer.Separator(),
          { name: 'Exit', value: 'exit' },
        ],
      },
    ])) as { action: string };

    switch (answers.action) {
      case 'createTrip':
        await actionCreateTrip();
        break;
      case 'viewTrips':
        await actionViewTrips();
        break;
      case 'selectTrip':
        await selectActiveTrip();
        break;
      case 'addActivity':
        await actionAddActivity();
        break;
      case 'viewByDay':
        await actionViewActivitiesForDay();
        break;
      case 'viewSorted':
        await actionViewSorted();
        break;
      case 'filterCategory':
        await actionFilterByCategory();
        break;
      case 'highCost':
        await actionHighCost();
        break;
      case 'totalCost':
        await actionTotalCost();
        break;
      case 'destInfo':
        await actionDestinationInfo();
        break;
      case 'setBudget':
        await actionSetBudget();
        break;
      case 'remainingBudget':
        await actionRemainingBudget();
        break;
      case 'breakdown':
        await actionSpendingBreakdown();
        break;
      case 'exit':
        exit = true;
        break;
      default:
        break;
    }
  }

  console.log('\nGoodbye!\n');
};

await mainMenu();
