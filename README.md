# Travel Itinerary & Expense Manager

A collaborative CLI application for planning trips, managing activities, and tracking travel expenses.

## About

This project helps travelers organize their journeys by creating structured itineraries with detailed activities and budget tracking.

It was built as a team project to practice:

- TypeScript with strict typing
- Asynchronous programming
- CLI application design using Inquirer
- Modular architecture and clean code structure
- Collaborative development workflows

---

## Features

- **Trip Planning** – Create trips with destinations and start dates
- **Activity Management** – Add activities with names, costs, categories, and timing
- **Cost Calculation** – Calculate total trip costs
- **Budget Tracking** – Set budget limits, track remaining budget, and view spending breakdowns by category
- **High-Cost Detection** – Identify activities exceeding a cost threshold
- **Smart Filtering** – Filter activities by category (food, transport, sightseeing)
- **Daily Schedule** – View activities organized by specific days
- **Chronological Sorting** – See your itinerary in time order
- **Country Information** – Fetch currency and flag data for destinations using the REST Countries API

---

## Running the CLI

### Install dependencies

```bash
npm install

# Run the application
npm start

# Development mode
npm run dev
```

## Project Structure

```
src/
├── models.ts                  # TypeScript type definitions (Trip, Activity)
├── itineraryService.ts        # Trip and activity logic
├── destinationService.ts      # API calls for country data
├── budgetService.ts           # Budget tracking and spending breakdowns
└── cli/
    ├── cli.ts                 # Entry point (main menu and router)
    ├── actions.ts             # Trip, activity, budget, and destination handlers
    ├── state.ts               # In-memory store and active trip logic
    └── helpers.ts             # Shared CLI utilities (date parsing, formatting, printing, pause)
```

---
