# Changelog

## [Unreleased]

### Added

- Dark mode support across all components:
  - Refined color scheme with slate/navy backgrounds
  - Consistent text hierarchy in dark mode
  - Dark mode support for forms and inputs
  - Improved contrast ratios for better readability
- Shift editing functionality with validation
- Shift validation system:
  - End time must be after start time
  - Maximum shift duration of 16 hours
  - Prevention of overlapping shifts
- Delete confirmation dialogs for shifts
- Error messages and validation feedback
- Improved form validation with error display

### Changed

- Enhanced shift list UI with edit and delete buttons
- Improved error handling and user feedback
- Updated validation logic in both add and edit forms
- Enhanced monthly summary display:
  - Fixed alignment issues with monospace fonts
  - Prevented label wrapping with minimum widths
  - Improved spacing and visual hierarchy
  - Consistent styling between calculation results and summary
- Updated component styling for dark mode compatibility:
  - Refined color palette for better dark mode aesthetics
  - Enhanced button hover states in dark mode
  - Improved border and divider visibility
  - Better contrast for text and interactive elements

### Fixed

- Overlapping shifts validation
- Time input validation
- Delete confirmation UX
- Monthly summary layout and alignment
- Text wrapping in earnings display
- Dark mode contrast issues in form inputs
- Inconsistent dark mode colors across components

## [0.2.0] - 2024-02-27

### Added

- Monthly summary with hours and earnings breakdown
- Visual indicators for different rate types
- Responsive grid layout
- Modern card-based design
- ILS currency support
- Data persistence using localStorage

### Changed

- Enhanced UI/UX with modern design principles
- Improved visual hierarchy
- Better interactive elements

## [0.1.0] - 2024-02-26

### Added

- Initial release
- Basic shift tracking functionality
- Wage rate configuration
- Automatic overtime calculations
- Basic data persistence
