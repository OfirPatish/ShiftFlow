# ShiftFlow

A modern shift management application for tracking work hours and calculating earnings with support for overtime rates.

## Features

- Track daily shifts with start and end times
- Automatic calculation of regular and overtime hours
- Support for multiple overtime rates (125% and 150%)
- Real-time earnings calculation based on current wage rate
- Localized currency display (ILS/₪)
- Modern, responsive UI with card-based design
- Monthly shift summary and statistics

## UI Components

### Shift Cards

Each shift is displayed as a distinct card containing:

- Date and time information
- Breakdown of hours (base and overtime)
- Detailed earnings calculation
- Interactive delete button (appears on hover)
- Visual separation with gradient total earnings section

### Wage Configuration

- Set base hourly rate
- All calculations update automatically when wage is modified
- Persists between sessions

### Monthly Overview

- List of all shifts for the current month
- Sorted by date (newest first)
- Total earnings calculation
- Visual breakdown of hours and earnings

## Technical Details

### Hours Calculation

- Base hours: First 8 hours (100% rate)
- Overtime 125%: Hours 8-10
- Overtime 150%: Hours beyond 10

### Data Storage

- Local storage persistence
- Automatic data loading and saving
- Real-time updates

### Styling

- Modern UI with Tailwind CSS
- Responsive design
- Smooth transitions and hover effects
- Card-based layout with proper spacing
- Subtle gradients and visual hierarchy

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Set your hourly wage rate in the wage settings
2. Add shifts using the input form
3. View and manage your shifts in the monthly overview
4. Total earnings are calculated automatically

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
