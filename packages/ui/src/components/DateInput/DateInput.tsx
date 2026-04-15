import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react";
import type { FC } from "react";
import React, { useCallback, useRef, useState } from "react";

import { useClickOutside } from "../../hooks";
import { classNames } from "../../utils/classNames";
import { BaseDateInput } from "../BaseDateInput";
import type { CalendarRef } from "../Calendar";
import { Calendar } from "../Calendar";
import type { DateInputProps } from "./DateInput.types";

/**
 * DateInput is an accessible date picker component that provides an intuitive keyboard-driven
 * interface for date entry. It features intelligent auto-completion, cross-field validation,
 * and support for multiple date formats (DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD).
 *
 * The component emits ISO 8601 formatted dates (YYYY-MM-DD) while displaying dates in the
 * user's preferred format. It automatically handles leap years, month-specific day limits,
 * and validates date segments in real-time.
 *
 * @example
 * Form integration with validation:
 *
 * ```tsx
 * const [birthDate, setBirthDate] = useState<string | null>(null);
 * const [error, setError] = useState(false);
 *
 * const handleDateChange = (isoDate: string | null) => {
 *   setBirthDate(isoDate);
 *
 *   if (isoDate) {
 *     const age = calculateAge(isoDate);
 *     setError(age < 18);
 *   }
 * };
 *
 * <DateInput
 *   value={birthDate}
 *   onChange={handleDateChange}
 *   hasError={error}
 *   placeholder="Enter your birth date"
 *   format="DD/MM/YYYY"
 *   separator="/"
 *   prefix={<CalendarIcon />}
 * />
 * ```
 *
 * @example
 * European format with custom styling:
 *
 * ```tsx
 * <DateInput
 *   value="2024-12-25"
 *   onChange={(date) => updateEvent({ startDate: date })}
 *   format="DD/MM/YYYY"
 *   separator="."
 *   className="w-full border-2 rounded-lg"
 *   placeholderClassName="text-gray-400"
 *   disabled={isProcessing}
 * />
 * ```
 *
 * @example
 * Date range picker with state synchronization:
 *
 * ```tsx
 * const [startDate, setStartDate] = useState("");
 * const [endDate, setEndDate] = useState("");
 *
 * <div className="flex gap-4">
 *   <DateInput
 *     value={startDate}
 *     onChange={setStartDate}
 *     placeholder="Start date"
 *     onSubmit={() => endDateRef.current?.focus()}
 *     hideClearIcon
 *   />
 *   <DateInput
 *     ref={endDateRef}
 *     value={endDate}
 *     onChange={setEndDate}
 *     placeholder="End date"
 *     hasError={endDate < startDate}
 *     hideCalendarIcon
 *   />
 * </div>
 * ```
 *
 * @example
 * Read-only display with custom icons:
 *
 * ```tsx
 * <DateInput
 *   value="2024-01-15"
 *   readOnly
 *   suffix={<LockIcon />}
 *   className="bg-gray-100"
 *   hideClearIcon
 *   onStateUpdate={({ month, day, year }) => {
 *     logDateSegmentInteraction({ month, day, year });
 *   }}
 * />
 * ```
 */
const DateInput: FC<DateInputProps> = ({
  value = "",
  onChange,
  disabled = false,
  readOnly = false,
  prefix,
  suffix,
  hasError = false,
  className,
  format = "DD/MM/YYYY",
  separator = "/",
  placeholder,
  placeholderClassName,
  hideCalendarIcon = false,
  hideClearIcon = false,
  hideCalendar = false,
  calendarClassName,
  calendarPlacement = "bottom-start",
  floatingStrategy = "absolute",
  wrapperClassName,
  onStateUpdate,
  onSubmit,
  ...rest
}) => {
  const calendarRef = useRef<CalendarRef>(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: calendarPlacement,
    strategy: floatingStrategy,
    middleware: [flip({ padding: 4 }), offset({ mainAxis: 4 })],
    whileElementsMounted: autoUpdate,
    open: openCalendar,
    onOpenChange: setOpenCalendar
  });

  useClickOutside(() => {
    setOpenCalendar(false);
  }, [refs.reference as never]);

  const handleStateUpdateInternal = useCallback(
    (state: { day: string; month: string; year: string }) => {
      if (!hideCalendar) {
        setOpenCalendar(true);

        const today = new Date();
        const currentMonth = state.month || (today.getMonth() + 1).toString();
        const currentYear = today.getFullYear();
        const parsedYear = state.year ? Number(state.year) : currentYear;
        calendarRef.current?.moveTo(
          Number(currentMonth),
          parsedYear < 1000 ? currentYear : parsedYear
        );
      }

      onStateUpdate?.(state);
    },
    [hideCalendar, onStateUpdate]
  );

  const handleSubmit = useCallback(() => {
    setOpenCalendar(false);
    onSubmit?.();
  }, [onSubmit]);

  const handleChange = useCallback(
    (date: string | null) => {
      onChange?.(date);
      if (date === null) {
        setOpenCalendar(false);
      }
    },
    [onChange]
  );

  const renderCalendarIcon = !hideCalendarIcon ? (
    <div className="GeckoUIDateInput__calendar-icon" />
  ) : undefined;

  return (
    <div
      className={classNames("GeckoUIDateInputWrapper", wrapperClassName)}
      data-calendar-open={openCalendar || undefined}
      ref={(r) => refs.setReference(r)}>
      <BaseDateInput
        value={value}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        prefix={prefix}
        suffix={suffix}
        hasError={hasError}
        className={className}
        format={format}
        separator={separator}
        placeholder={placeholder}
        placeholderClassName={placeholderClassName}
        hideClearIcon={hideClearIcon}
        hideCalendarIcon={hideCalendarIcon}
        renderCalendarIcon={renderCalendarIcon}
        onStateUpdate={handleStateUpdateInternal}
        onSubmit={handleSubmit}
        hasFocus={openCalendar}
        {...rest}
      />

      {!hideCalendar && openCalendar && (
        <div ref={(r) => refs.setFloating(r)} style={{ ...floatingStyles, zIndex: 9999 }}>
          <Calendar
            calendarRef={calendarRef}
            className={classNames("GeckoUIDateInput__calendar", calendarClassName)}
            onSelectDate={(date) => {
              onChange?.(date);
              setOpenCalendar(false);
            }}
            selectedDate={value}
          />
        </div>
      )}
    </div>
  );
};

DateInput.displayName = "DateInput";

export default DateInput;
