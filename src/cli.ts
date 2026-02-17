import { addActivity } from './itineraryService.js';

import inquirer from 'inquirer';
const mainMenu = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['View Trips', 'Add Activity', 'View Budget', 'Exit'],
    },
  ]);
  // Handle user choices here
};
mainMenu();

const activities = addActivity(trip, activity);
console.log(`Added! You now have ${activities.length} activities.`);
