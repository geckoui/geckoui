const RAW_BASE = "https://raw.githubusercontent.com/geckoui/geckoui/main/apps/docs/content/docs";

const content = `# Gecko UI

> Gecko UI is a production-ready React component library built with TypeScript and Tailwind CSS. It provides 40+ accessible, customizable components for building modern web applications.

## Docs

- [Full Docs](https://geckoui.dev/llms-full.txt): Full documentation of all components.

## Examples

- [GitHub Examples](https://github.com/geckoui/geckoui/tree/main/apps/docs/src/components/examples): Component example files.

## Components

### Form Inputs
- [Input](${RAW_BASE}/input.mdx): Text input with prefix/suffix support
- [Textarea](${RAW_BASE}/textarea.mdx): Multi-line text input with auto-resize
- [Select](${RAW_BASE}/select/index.mdx): Dropdown with single/multiple selection
- [Checkbox](${RAW_BASE}/checkbox.mdx): Checkbox with indeterminate state
- [Radio](${RAW_BASE}/radio.mdx): Radio button for single selection
- [Switch](${RAW_BASE}/switch.mdx): Toggle switch for boolean values
- [OTPInput](${RAW_BASE}/otp-input.mdx): One-time password input
- [CounterInput](${RAW_BASE}/counter-input.mdx): Numeric input with increment/decrement buttons
- [DateInput](${RAW_BASE}/date-input.mdx): Date picker with calendar
- [DateRangeInput](${RAW_BASE}/date-range-input.mdx): Date range picker

### Buttons
- [Button](${RAW_BASE}/button.mdx): Flexible button with variants and sizes
- [LoadingButton](${RAW_BASE}/loading-button.mdx): Button with loading state

### Feedback
- [Alert](${RAW_BASE}/alert.mdx): Alert messages (success, error, warning, info)
- [Toast](${RAW_BASE}/toast.mdx): Toast notifications
- [Spinner](${RAW_BASE}/spinner.mdx): Loading spinner

### Overlays
- [Dialog](${RAW_BASE}/dialog.mdx): Modal dialog
- [ConfirmDialog](${RAW_BASE}/confirm-dialog.mdx): Confirmation modal
- [Drawer](${RAW_BASE}/drawer.mdx): Side drawer/panel
- [Menu](${RAW_BASE}/menu.mdx): Menu component
- [Tooltip](${RAW_BASE}/tooltip.mdx): Accessible tooltip

### Form Helpers
- [Label](${RAW_BASE}/label.mdx): Form label with tooltip
- [InputError](${RAW_BASE}/input-error.mdx): Error message display

### Calendar
- [Calendar](${RAW_BASE}/calendar.mdx): Full calendar component

### Content
- [Pagination](${RAW_BASE}/pagination.mdx): Page navigation

## React Hook Form

- [RHFInput](${RAW_BASE}/rhf-input.mdx)
- [RHFTextarea](${RAW_BASE}/rhf-textarea.mdx)
- [RHFCheckbox](${RAW_BASE}/rhf-checkbox.mdx)
- [RHFCounterInput](${RAW_BASE}/rhf-counter-input.mdx)
- [RHFRadio](${RAW_BASE}/rhf-radio.mdx)
- [RHFSwitch](${RAW_BASE}/rhf-switch.mdx)
- [RHFSelect](${RAW_BASE}/rhf-select.mdx)
- [RHFDateInput](${RAW_BASE}/rhf-date-input.mdx)
- [RHFDateRangeInput](${RAW_BASE}/rhf-date-range-input.mdx)
- [RHFNumberInput](${RAW_BASE}/rhf-number-input.mdx)
- [RHFCurrencyInput](${RAW_BASE}/rhf-currency-input.mdx)
- [RHFOTPInput](${RAW_BASE}/rhf-otp-input.mdx)
- [RHFFileInput](${RAW_BASE}/rhf-file-input.mdx)
- [RHFFilePicker](${RAW_BASE}/rhf-file-picker.mdx)
- [RHFInputGroup](${RAW_BASE}/rhf-input-group.mdx)
- [RHFError](${RAW_BASE}/rhf-error.mdx)
- [RHFController](${RAW_BASE}/rhf-controller.mdx)
`;

export const revalidate = false;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
