import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react";
import type { FC } from "react";
import React, { useRef, useState } from "react";

import { useClickOutside } from "../../hooks";
import { classNames } from "../../utils/classNames";
import { BaseDateRangeInput } from "../BaseDateRangeInput";
import type { CalendarRef, DateRange } from "../Calendar";
import { Calendar } from "../Calendar";
import type { DateRangeInputProps } from "./DateRangeInput.types";

const DateRangeInput: FC<DateRangeInputProps> = ({
  value,
  onChange,
  disabled = false,
  readOnly = false,
  prefix,
  suffix,
  hasError = false,
  className,
  format = "DD/MM/YYYY",
  separator = "/",
  rangeSeparator = " - ",
  placeholder,
  placeholderClassName,
  hideCalendarIcon = false,
  hideClearIcon = false,
  hideCalendar = false,
  calendarClassName,
  calendarPlacement = "bottom-start",
  floatingStrategy = "absolute",
  wrapperClassName,
  numberOfMonths = 2,
  onStateUpdate,
  onSubmit,
  ...rest
}) => {
  const calendarRef = useRef<CalendarRef>(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  const handleCloseCalendar = () => {
    setOpenCalendar(false);

    if (!value?.from || !value?.to) return;

    // Ensure from date is before to date
    if (Date.parse(value.from) > Date.parse(value.to)) {
      onChange?.({ from: value.to, to: value.from });
    }
  };

  const { refs, floatingStyles } = useFloating({
    placement: calendarPlacement,
    strategy: floatingStrategy,
    middleware: [flip({ padding: 4 }), offset({ mainAxis: 4 })],
    whileElementsMounted: autoUpdate,
    open: openCalendar,
    onOpenChange: setOpenCalendar
  });

  useClickOutside(() => {
    handleCloseCalendar();
  }, [refs.reference as never]);

  const handleStateUpdateInternal = (state: {
    startDay: string;
    startMonth: string;
    startYear: string;
    endDay: string;
    endMonth: string;
    endYear: string;
  }) => {
    if (!hideCalendar) {
      setOpenCalendar(true);

      const today = new Date();
      const currentMonth = state.startMonth || (today.getMonth() + 1).toString();
      const currentYear = today.getFullYear();
      const parsedYear = state.startYear ? Number(state.startYear) : currentYear;
      calendarRef.current?.moveTo(
        Number(currentMonth),
        parsedYear < 1000 ? currentYear : parsedYear
      );
    }

    onStateUpdate?.(state);
  };

  const handleSubmit = () => {
    handleCloseCalendar();
    onSubmit?.();
  };

  const handleChange = (range: DateRange | null) => {
    onChange?.(range);
    if (range === null) {
      handleCloseCalendar();
    }
  };

  const handleRangeSelect = (range: DateRange | null) => {
    onChange?.(range);
    if (range?.from && range?.to) {
      handleCloseCalendar();
    }
  };

  const renderCalendarIcon = !hideCalendarIcon ? (
    <div className="GeckoUIDateInput__calendar-icon" />
  ) : undefined;

  return (
    <div
      className={classNames("GeckoUIDateRangeInputWrapper", wrapperClassName)}
      data-calendar-open={openCalendar || undefined}
      ref={(r) => refs.setReference(r)}>
      <BaseDateRangeInput
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
        rangeSeparator={rangeSeparator}
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
            mode="range"
            calendarRef={calendarRef}
            className={classNames("GeckoUIDateRangeInput__calendar", calendarClassName)}
            onSelectRange={handleRangeSelect}
            selectedRange={value}
            numberOfMonths={numberOfMonths}
          />
        </div>
      )}
    </div>
  );
};

DateRangeInput.displayName = "DateRangeInput";

export default DateRangeInput;
