# Changelog

## [1.5.0]

### Breaking Changes

- SelectButton: Default placeholder changed from "Select Item" to "Select option" (BREAKING for consumers relying on the old literal in tests).
- Tooltip: Renamed `side` prop to `placement` (BREAKING).
- Calendar: Removed `numberOfMonths` from `CalendarRangeModeProps`. Range mode now always renders one month (BREAKING).
- DateInput / DateRangeInput: Changed `'YYYY/MM/DD'` format option to `'YYYY-MM-DD'` (ISO standard, BREAKING).

## [1.4.0]

### Breaking Changes

- RHFError: Removed deprecated `children` prop — use `render` instead.
- RHFInput / RHFTextarea: Narrowed `onChange` type from `(value: string | null) => void` to `(value: string) => void`.
- OTPInput: Switched from CSS grid (`max-w-xs`) to flex layout with cells `flex-1 max-w-[56px]` — adapts to parent width on narrow screens, no longer hard-capped at 320px.

### Fixed

- RHFCheckbox: Boolean-toggle when no `value` prop is passed now works as documented.

### Added

- RHFTextarea: New `transform` prop for input/output value transformation (mirrors RHFInput).
- RHFOTPInput: New consumer-facing `onChange(value)` and `onBlur()` callbacks fired alongside RHF's internal handlers.

### Changed

- RHFCurrencyInput: Currency `symbol` and `code` are now optional.

## [1.3.3]

- Menu: Removed inner `GeckoUIMenu__scroll-container`. Menu panel now fits content width by default and has no max-height — set `menuClassName="max-h-[300px]"` if you need to constrain height.

## [1.3.2]

- MenuItem: Removed `label` prop — use `children` instead (e.g. `<MenuItem>Edit</MenuItem>`).
- ConfirmDialog `dismissOnEsc` and `dismissOnOutsideClick` now default to `true`, consistent with Dialog.

## [1.3.0]

### Breaking Changes

- **Tailwind CSS v4**: Migrated from Tailwind CSS v3 to v4. Consumers using Tailwind should update to v4.
- **OKLCH color system**: Theme colors now use full CSS color values instead of space-separated RGB channels. Override with any CSS color format — `oklch()`, `hex`, `rgb()`, `hsl()`, etc.
- **CSS variable rename**: Theme variables changed from `--gecko-ui-*` to `--color-*` (Tailwind v4 convention).
- **Data attributes replace BEM modifiers**: Component modifiers migrated from BEM classes (`GeckoUIButton--filled-primary`) to `data-*` attributes (`data-variant="filled" data-color="primary"`). Update CSS selectors accordingly (e.g. `.GeckoUIButton[data-variant="filled"]`).
- **Menu rewrite**: Menu component rebuilt from scratch with Floating UI. New API uses `Menu`, `MenuItem`, and `MenuTrigger`. Old compound components (`MenuButton`, `MenuItems`, `MenuSection`, `MenuHeading`, `MenuSeparator`) are removed.
- **Dropdown removed**: Use `Menu` component instead.

### Fixed

- Focus outline only shows on keyboard navigation (`focus-visible`), no longer visible by default.

## [1.1.3] - 2025-12-30

- Fix `disabled` color not applying on `Input` component.

## [1.1.2] - 2025-12-18

- Add `react-hook-form` as a peer dependency to avoid version conflicts

## [1.1.1] - 2025-12-18

- Fixed react and react-dom peer dependency versions in package.json

## [1.1.0] - 2025-12-16

- Added `clearable` prop to Select component for clearing selected value

## [1.0.0] - 2025-12-03

- Opensource initial release of GeckoUI React component library

### Added

#### Core Components

- Alert - Display important messages with different severity levels
- Button - Flexible button with multiple variants, sizes, and colors
- Calendar - Date picker calendar component
- Checkbox - Checkbox input with indeterminate state support
- ConfirmDialog - Confirmation dialog for destructive actions
- DateInput - Date input with calendar picker
- DateRangeInput - Date range selection input
- Dialog - Modal dialog component
- Drawer - Slide-out panel component
- Dropdown - Dropdown menu component
- Input - Text input with various states and addons
- InputError - Form field error message display
- Label - Form label component
- LoadingButton - Button with loading state
- Menu - Navigation menu component
- OTPInput - One-time password input
- Pagination - Page navigation component
- Radio - Radio button input
- Select - Dropdown select with search and multi-select
- Spinner - Loading spinner indicator
- Switch - Toggle switch component
- Textarea - Multi-line text input with auto-resize
- Toast - Toast notification system (powered by Sonner)
- Tooltip - Tooltip component

#### React Hook Form Components

- RHFCheckbox - Checkbox with React Hook Form integration
- RHFController - Generic RHF controller wrapper
- RHFCurrencyInput - Currency input with RHF integration
- RHFDateInput - Date input with RHF integration
- RHFDateRangeInput - Date range input with RHF integration
- RHFError - Form error display for RHF
- RHFFileInput - File input with RHF integration
- RHFFilePicker - File picker with drag & drop and RHF integration
- RHFInput - Text input with RHF integration
- RHFInputGroup - Input group with RHF integration
- RHFNumberInput - Number input with RHF integration
- RHFOTPInput - OTP input with RHF integration
- RHFRadio - Radio button with RHF integration
- RHFSelect - Select with RHF integration
- RHFSwitch - Switch with RHF integration
- RHFTextarea - Textarea with RHF integration

#### Utilities

- GeckoUIPortal - Portal container for modals and overlays
- DynamicComponentRenderer - Render components dynamically from config

#### Features

- Full TypeScript support with module augmentation for custom variants
- CSS variables for theming (light/dark mode)
- Accessible components following WAI-ARIA guidelines
- TailwindCSS integration with customizable styles
