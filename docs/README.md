# ShiftFlow - Shift Calculator

A modern web application for calculating and tracking work shifts, including overtime rates and earnings calculations. Designed specifically for the Israeli market with ILS currency support and Hebrew date formatting.

## Features

- Set and save hourly wage rates
- Calculate shifts with:
  - Base hours (first 8 hours)
  - Overtime 125% (hours 8-10)
  - Overtime 150% (hours 10+)
  - Partial hours support (minutes)
- Track multiple shifts with:
  - Date and time tracking
  - Automatic overtime calculations
  - Monthly summaries with detailed breakdowns
  - Edit and delete functionality
  - Shift validation and overlap prevention
- Israeli market support:
  - ILS (₪) currency display
  - Hebrew currency formatting
  - Local storage for data persistence
- Modern, responsive UI with:
  - Clean, professional design
  - Dark mode support
  - Mobile-first responsive layout
  - Accessible color schemes
  - Interactive hover states
  - Tailwind CSS styling
- Fast development with Turbopack

## Tech Stack

- Next.js 15.2.0 with Turbopack
- TypeScript
- Tailwind CSS
- React 18

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/shiftflow.git
   cd shiftflow
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server (with Turbopack):

   ```bash
   npm run dev
   ```

   This will start the server with Turbopack enabled for faster development experience.

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
shiftflow/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── WageConfig.tsx
│   │   ├── ShiftInput.tsx
│   │   └── ShiftsList.tsx
│   ├── types/
│   │   └── shift.ts
│   └── utils/
│       ├── calculations.ts
│       ├── wageContext.tsx
│       └── shiftsContext.tsx
├── docs/
│   ├── CHANGELOG.md
│   ├── TODO.md
│   └── README.md
├── public/
├── package.json
└── README.md
```

## Usage

1. Set your hourly wage rate in the Wage Configuration section
2. Add new shifts by:
   - Selecting the date
   - Entering start and end times (hours and minutes)
   - Clicking "Calculate Shift" to see the detailed breakdown:
     - Base hours (first 8 hours at 100%)
     - Overtime 125% (hours 8-10)
     - Overtime 150% (hours beyond 10)
   - Clicking "Save Shift" to store the shift
3. View your shifts and monthly summary in the Saved Shifts section:
   - See all shifts for the current month
   - View detailed overtime breakdowns
   - Delete unwanted shifts
   - Track total earnings with proper ILS formatting

## Documentation

- [Changelog](./CHANGELOG.md) - Track version history and changes
- [TODO](./TODO.md) - Planned features and improvements
- [Roadmap](./ROADMAP.md) - Development phases and milestones

## Contributing

Feel free to open issues and pull requests for any improvements you'd like to add.

## License

MIT License - feel free to use this project for any purpose.
