# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server at http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

### Project Structure
This is a Next.js 14 application that tracks solar power installation breakeven analysis.

## Architecture

This is a Next.js application using the App Router pattern with these key architectural elements:

### Data Layer (src/app/data.js)
- `postSolar` - Array of monthly electricity bills after solar installation (Aug 2023 - present)
- `preSolar` - Historical electricity bills before solar installation (2021-2023)
- Each entry contains usage data, costs, production metrics, and savings calculations

### Core Business Logic (src/app/utils.js)
- Solar payoff calculations with energy inflation projections
- ROI calculations over 25-year periods
- Date-based breakeven analysis

### Component Architecture
- **Header.jsx** - Site navigation and branding
- **PayoffChart.jsx** - Uses Highcharts to visualize solar savings over time
- **Table.jsx** - Monthly bill comparison display
- **StatCard.jsx** - Dashboard metrics display
- **Details.jsx** - System cost breakdown and specifications
- **SectionHeader.jsx/SectionBody.jsx** - Layout components

### Key Business Constants (src/app/page.jsx)
- System cost: $27,940 total, $19,568 after tax credits
- Purchase date: August 8, 2023
- Energy inflation rate: 3.59% annually
- 25-year projection horizon

### Dependencies
- Next.js 14 with React 18
- Tailwind CSS for styling
- Highcharts for data visualization
- Headless UI components
- Heroicons for icons

The app calculates real-time breakeven projections by comparing actual post-solar bills against projected pre-solar costs with inflation adjustments.