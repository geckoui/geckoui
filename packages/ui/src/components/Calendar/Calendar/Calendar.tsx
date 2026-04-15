import { useEffect, useImperativeHandle, useState } from "react";

import { classNames } from "../../../utils/classNames";
import { getTodayDate, isValidISOFormat, shouldSwapDates } from "../Calendar.utils";
import { CalendarDayPicker } from "../CalendarDayPicker";
import { CalendarMonthPicker } from "../CalendarMonthPicker";
import { CalendarYearPicker } from "../CalendarYearPicker";
import type {
  CalendarOverload,
  CalendarProps,
  CalendarRangeModeProps,
  CalendarSingleModeProps
} from "./Calendar.types";
import { CalendarType } from "./Calendar.types";

/**
 * Calendar component to select dates in day, month, and year views.
 * Supports both single date selection and date range selection.
 *
 * @example
 * Single date selection:
 * ```tsx
 * const [selectedDate, setSelectedDate] = useState<string | null>(null);
 *
 * <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
 * ```
 *
 * @example
 * Date range selection with dual calendar:
 * ```tsx
 * const [selectedRange, setSelectedRange] = useState<DateRange>({ from: null, to: null });
 *
 * <Calendar
 *   mode="range"
 *   selectedRange={selectedRange}
 *   onSelectRange={setSelectedRange}
 *   numberOfMonths={2}
 * />
 * ```
 * */
const Calendar = (props: CalendarProps) => {
  const { className, style, calendarRef, disableDate, renderDayCell, mode = "single" } = props;

  const [view, setView] = useState<CalendarType>(CalendarType.Day);
  const [rangeSelectionStart, setRangeSelectionStart] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const selectedDate =
    mode === "single" ? (props as CalendarSingleModeProps).selectedDate : undefined;
  const onSelectDate =
    mode === "single" ? (props as CalendarSingleModeProps).onSelectDate : undefined;
  const selectedRange =
    mode === "range" ? (props as CalendarRangeModeProps).selectedRange : undefined;
  const onSelectRange =
    mode === "range" ? (props as CalendarRangeModeProps).onSelectRange : undefined;
  const numberOfMonths =
    mode === "range" ? ((props as CalendarRangeModeProps).numberOfMonths ?? 2) : 1;

  let initialDate: string;
  if (mode === "range") {
    initialDate = selectedRange?.from || selectedRange?.to || getTodayDate();
  } else {
    initialDate = selectedDate || getTodayDate();
  }

  const isValidDate = isValidISOFormat(initialDate);
  const today = getTodayDate();
  const [year, month] = (isValidDate ? initialDate : today).split("-").map(Number);
  const [activeMonth, setActiveMonth] = useState(month - 1);
  const [activeYear, setActiveYear] = useState(year);

  const increaseYear = () => {
    setActiveYear((prev) => prev + 1);
  };

  const decreaseYear = () => {
    setActiveYear((prev) => prev - 1);
  };

  const onSelectMonth = (month: number) => {
    setActiveMonth(month);
    setView(CalendarType.Day);
  };

  const onSelectYear = (year: number) => {
    setActiveYear(year);
    setView(CalendarType.Month);
  };

  const clearSelection = () => {
    if (mode === "range") {
      setRangeSelectionStart(null);
      setHoveredDate(null);
      onSelectRange?.(null);
    } else {
      onSelectDate?.("");
    }
  };

  useImperativeHandle(calendarRef, () => {
    return {
      moveTo: (month: number, year: number) => {
        setActiveMonth(month - 1);
        setActiveYear(year);
        setView(CalendarType.Day);
      },
      clearSelection
    };
  });

  useEffect(() => {
    if (mode === "single") {
      if (selectedDate && !isValidISOFormat(selectedDate)) {
        console.error(
          `Invalid date format. Please provide date in the format YYYY-MM-DD, \nProvided value: ${selectedDate}`
        );
      }
    } else {
      if (selectedRange?.from && !isValidISOFormat(selectedRange.from)) {
        console.error(
          `Invalid date format for range.from. Please provide date in the format YYYY-MM-DD, \nProvided value: ${selectedRange.from}`
        );
      }
      if (selectedRange?.to && !isValidISOFormat(selectedRange.to)) {
        console.error(
          `Invalid date format for range.to. Please provide date in the format YYYY-MM-DD, \nProvided value: ${selectedRange.to}`
        );
      }
    }
  }, [mode, selectedDate, selectedRange]);

  const handleSingleDateClick = (date: string) => {
    onSelectDate?.(date);
  };

  const handleRangeDateClick = (date: string) => {
    if (!rangeSelectionStart) {
      setRangeSelectionStart(date);
      onSelectRange?.({ from: date, to: undefined });
    } else {
      const [from, to] = shouldSwapDates(rangeSelectionStart, date)
        ? [date, rangeSelectionStart]
        : [rangeSelectionStart, date];
      onSelectRange?.({ from, to });
      setRangeSelectionStart(null);
      setHoveredDate(null);
    }
  };

  const handleHoverDate = (date: string | null) => {
    if (mode === "range" && rangeSelectionStart) {
      setHoveredDate(date);
    }
  };

  const renderContent = () => {
    const decreaseMonth = () => {
      if (activeMonth - 1 < 0) {
        setActiveMonth(() => 11);
        decreaseYear();
      } else {
        setActiveMonth(() => activeMonth - 1);
      }
    };

    const increaseMonth = () => {
      if (activeMonth + 1 > 11) {
        setActiveMonth(() => 0);
        increaseYear();
      } else {
        setActiveMonth(() => activeMonth + 1);
      }
    };

    if (view === CalendarType.Day) {
      if (mode === "range") {
        const secondMonth = activeMonth === 11 ? 0 : activeMonth + 1;
        const secondYear = activeMonth === 11 ? activeYear + 1 : activeYear;

        return (
          <div className="GeckoUICalendar__dual">
            <div className="GeckoUICalendar__dual--first">
              <CalendarDayPicker
                mode="range"
                disableDate={disableDate}
                renderDayCell={renderDayCell}
                activeMonth={activeMonth}
                activeYear={activeYear}
                onClickHeader={() => setView(CalendarType.Month)}
                onClickLeftArrow={decreaseMonth}
                onClickRightArrow={increaseMonth}
                selectedRange={selectedRange}
                onSelectRange={handleRangeDateClick}
                hoveredDate={hoveredDate}
                onHoverDate={handleHoverDate}
              />
            </div>

            {numberOfMonths === 2 && (
              <div className="GeckoUICalendar__dual--second">
                <CalendarDayPicker
                  mode="range"
                  disableDate={disableDate}
                  renderDayCell={renderDayCell}
                  activeMonth={secondMonth}
                  activeYear={secondYear}
                  onClickHeader={() => setView(CalendarType.Month)}
                  onClickLeftArrow={decreaseMonth}
                  onClickRightArrow={increaseMonth}
                  selectedRange={selectedRange}
                  onSelectRange={handleRangeDateClick}
                  hoveredDate={hoveredDate}
                  onHoverDate={handleHoverDate}
                />
              </div>
            )}
          </div>
        );
      }

      return (
        <CalendarDayPicker
          mode="single"
          disableDate={disableDate}
          renderDayCell={renderDayCell}
          activeMonth={activeMonth}
          activeYear={activeYear}
          onClickHeader={() => setView(CalendarType.Month)}
          onClickLeftArrow={decreaseMonth}
          onClickRightArrow={increaseMonth}
          onSelectDate={handleSingleDateClick}
          selectedDate={selectedDate}
        />
      );
    }

    if (view === CalendarType.Month) {
      return (
        <CalendarMonthPicker
          activeMonth={activeMonth}
          activeYear={activeYear}
          onClickHeader={() => setView(CalendarType.Year)}
          onClickLeftArrow={decreaseYear}
          onClickRightArrow={increaseYear}
          onSelectMonth={onSelectMonth}
        />
      );
    }

    return <CalendarYearPicker activeYear={activeYear} onSelectYear={onSelectYear} />;
  };

  return (
    <div
      className={classNames(
        `GeckoUICalendar`,
        `GeckoUICalendar--mode-${view}`,
        `GeckoUICalendar--selection-${mode}`,
        mode === "range" &&
          view === CalendarType.Day &&
          `GeckoUICalendar--calendars-${numberOfMonths}`,
        className
      )}
      style={style}>
      {renderContent()}
    </div>
  );
};

Calendar.displayName = "Calendar";

export default Calendar as CalendarOverload;
