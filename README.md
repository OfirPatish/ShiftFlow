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
- Pagination for efficiently browsing through large numbers of shifts

## New Features

- **Pagination**: Navigate through shifts with ease when you have many entries
- **Enhanced Analytics**: More detailed breakdown of work patterns and earnings

## UI Components

### Shift Detail Cards

Each shift is displayed as a distinct card containing:

- Date and time information
- Breakdown of hours (base and overtime)
- Detailed earnings calculation
- Interactive delete button (appears on hover)
- Visual separation with gradient total earnings section

### Wage Settings

- Set base hourly rate
- All calculations update automatically when wage is modified
- Persists between sessions

### Monthly Overview

- List of all shifts for the current month
- Sorted by date (newest first)
- Total earnings calculation
- Visual breakdown of hours and earnings
- Pagination controls for navigating through shift history

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

## Project Structure

The project is organized into feature-based modules for better separation of concerns:

- **UI**: Reusable UI components and hooks

  - Navigation components (ShortcutsPanel)
  - Input components (TimeInput, ThemeToggle)
  - Responsive design utilities

- **Shifts**: Management and display of shift data

  - Management: Forms for creating and editing shifts
  - Display: Components for viewing and filtering shifts
  - Pagination: Controls for navigating through shift history

- **Analytics**: Summary and statistics of work data

  - Monthly overview of shifts and earnings
  - Detailed analytics of shift patterns

- **Wages**: Configuration and calculation of earnings
  - Wage settings interface
  - Earnings breakdown and calculations

This modular structure improves code organization, making the codebase more maintainable and scalable.

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
2. Add shifts using the shift creation form
3. View and manage your shifts in the monthly overview
   - Use pagination controls to navigate through your shifts history
   - Easily see all your shifts with efficient loading
4. Check detailed earnings breakdown and analytics
5. Use the theme toggle to switch between light and dark modes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is a permissive license that is short and to the point. It lets people do anything they want with your code as long as they provide attribution back to you and don't hold you liable.
