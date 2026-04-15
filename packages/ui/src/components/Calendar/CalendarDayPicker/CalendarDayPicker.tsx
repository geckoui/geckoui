import {
  generateCalendarDates,
  generateMonthNames,
  getTodayDate,
  isDateBetween,
  isDateInRange,
  shouldSwapDates
} from "../Calendar.utils";
import { CalendarHeader } from "../CalendarHeader";
import type {
  CalendarDayPickerProps,
  CalendarDayPickerRangeProps,
  CalendarDayPickerSingleProps
} from "./CalendarDayPicker.types";

function CalendarDayPicker(props: CalendarDayPickerProps) {
  const {
    activeMonth,
    activeYear,
    mode = "single",
    disableDate,
    renderDayCell,
    ...headerProps
  } = props;

  const today = getTodayDate();
  const { months } = generateMonthNames();
  const dates = generateCalendarDates(activeMonth, activeYear);

  const isRangeMode = mode === "range";
  const selectedRange = isRangeMode
    ? (props as CalendarDayPickerRangeProps).selectedRange
    : undefined;
  const hoveredDate = isRangeMode ? (props as CalendarDayPickerRangeProps).hoveredDate : undefined;

  const handleDateClick = (date: string) => {
    if (isRangeMode) {
      (props as CalendarDayPickerRangeProps).onSelectRange?.(date);
    } else {
      (props as CalendarDayPickerSingleProps).onSelectDate?.(date);
    }
  };

  const handleDateHover = (date: string | null) => {
    if (isRangeMode) {
      (props as CalendarDayPickerRangeProps).onHoverDate?.(date);
    }
  };

  return (
    <>
      <CalendarHeader header={`${months[activeMonth]} ${activeYear}`} {...headerProps} />
      <div className="GeckoUICalendar__day-picker-weekdays">
        <span>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
      </div>

      <div className="GeckoUICalendar__day-picker">
        {dates.map((date) => {
          const isActiveMonth = activeMonth === date.month;

          if (isRangeMode && !isActiveMonth) {
            return <span key={`${date.year}-${date.month}-${date.day}`} />;
          }

          const formattedDate = `${date.year}-${(date.month + 1)
            .toString()
            .padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;

          const isToday = formattedDate === today;

          const isSelected =
            !isRangeMode && formattedDate === (props as CalendarDayPickerSingleProps).selectedDate;

          let isRangeStart = false;
          let isRangeEnd = false;
          let isInRange = false;
          let isHoverPreview = false;
          let isHoverPreviewStart = false;
          let isHoverPreviewEnd = false;

          if (isRangeMode && selectedRange && isActiveMonth) {
            const needsSwap = shouldSwapDates(selectedRange.from, selectedRange.to);
            const normalizedFrom = needsSwap ? selectedRange.to : selectedRange.from;
            const normalizedTo = needsSwap ? selectedRange.from : selectedRange.to;

            isRangeStart = formattedDate === normalizedFrom;
            isRangeEnd = normalizedTo ? formattedDate === normalizedTo : false;

            if (normalizedFrom && normalizedTo) {
              isInRange = isDateInRange(formattedDate, { from: normalizedFrom, to: normalizedTo });
            }

            if (selectedRange.from && !selectedRange.to && hoveredDate) {
              const [previewStart, previewEnd] = shouldSwapDates(selectedRange.from, hoveredDate)
                ? [hoveredDate, selectedRange.from]
                : [selectedRange.from, hoveredDate];

              if (isDateBetween(formattedDate, previewStart, previewEnd)) {
                isHoverPreview = true;
              }

              isHoverPreviewStart = formattedDate === previewStart;
              isHoverPreviewEnd = formattedDate === previewEnd;
            }
          }

          const isDisable = disableDate?.(formattedDate);

          return (
            <button
              className="GeckoUICalendar__day-picker__button"
              data-today={isToday || undefined}
              data-selected={isSelected || undefined}
              data-range-start={isRangeStart || undefined}
              data-range-end={isRangeEnd || undefined}
              data-in-range={isInRange || undefined}
              data-hover-preview={isHoverPreview || undefined}
              data-hover-preview-start={isHoverPreviewStart || undefined}
              data-hover-preview-end={isHoverPreviewEnd || undefined}
              data-disabled={isDisable || undefined}
              data-active-month={isActiveMonth || undefined}
              disabled={isDisable}
              key={`${date.year}-${date.month}-${date.day}`}
              onClick={() => handleDateClick(formattedDate)}
              onMouseEnter={() => handleDateHover(formattedDate)}
              onMouseLeave={() => handleDateHover(null)}
              type="button">
              {renderDayCell
                ? renderDayCell({
                    ...date,
                    date: formattedDate,
                    isDisabled: !!isDisable,
                    isSelected: isSelected || isRangeStart || isRangeEnd || isInRange,
                    isFocusedMonth: isActiveMonth
                  })
                : date.day}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default CalendarDayPicker;
