# Travel Itinerary & Expense Manager

A collaborative CLI application for planning trips, managing activities, and tracking travel expenses.

## About

This project helps travelers organize their journey by creating trip itineraries with detailed activities and budget tracking. Built as a team project to practice TypeScript, asynchronous programming, and collaborative development workflows.

## Features

- **Trip Planning**: Create trips with destinations and start dates
- **Activity Management**: Add activities with names, costs, categories, and timing
- **Budget Tracking**: Calculate total trip costs and identify high-expense activities
- **Smart Filtering**: Filter activities by category (food, transport, sightseeing)
- **Daily Schedule**: View activities organized by specific days
- **Chronological Sorting**: See your itinerary in time order
- **Country Information**: Fetch currency and flag data for destinations using the REST Countries API

## Tech Stack

- **TypeScript** — Strict typing for robust code
- **Node.js** — Runtime environment
- **Inquirer** — Interactive CLI menus
- **REST Countries API** — Destination information
- **ESLint** — Code quality enforcement

## Getting Started

```bash
# Install dependencies
npm install

# Run the application
npm start

# Development mode
npm run dev
```

## Project Structure

```
src/
├── models.ts              # TypeScript type definitions
├── services/
│   ├── destinationService.ts  # API calls for country data
│   └── itineraryService.ts    # Trip and activity logic
└── cli.ts                 # Command-line interface
```

---
