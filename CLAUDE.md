# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server at http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Architecture

Next.js 14 App Router application that tracks solar power installation breakeven analysis with EV charging cost offsets.

### Routes
- `/` (src/app/page.jsx) - Main dashboard with stats, charts, progress bar, and bill table
- `/tvm` (src/app/tvm/page.jsx) - Time Value of Money comparison: solar investment vs. S&P 500
- `/contact` (src/app/contact/page.jsx) - Contact page

### Data Layer (src/app/data.js)
- `postSolar` - Monthly electricity bills after solar installation (Aug 2023 - present), ordered newest-first
- `preSolar` - Historical electricity bills before solar (2021-2023)
- `evData` - EV trip/charging data
- Each postSolar entry schema: `{ year, month, start, end, days, bill, usage_rcvd, usage_dlvd, production_rcvd, production_dlvd, usage, price, saved, gasSaved, supercharging, evMiles }`
- Adding a new month means prepending to the `postSolar` array

### Savings Calculation Model
The app tracks two types of savings that combine into total payoff progress:
1. **Electricity savings** - difference between what power would have cost (`price`) vs actual bill (`bill`)
2. **EV gas savings** - gas cost avoided by driving an EV, minus the home charging electricity cost when it exceeds solar production (see `calculateEvElecCost` in utils.js)

A **trailing 12-month daily savings rate** (computed from the first 12 entries of `postSolar`) drives the breakeven projection and 25-year ROI, accounting for annual energy inflation compounding.

### Key Business Constants (src/app/page.jsx)
- System cost: $27,940 total, $19,568 after tax credits
- Purchase date: August 8, 2023
- Energy inflation rate: 3.5% annually
- 25-year projection horizon

### Dependencies
- Next.js 14 with React 18
- Tailwind CSS for styling
- Highcharts for data visualization
- Headless UI + Heroicons for UI components
- Lodash for utilities
