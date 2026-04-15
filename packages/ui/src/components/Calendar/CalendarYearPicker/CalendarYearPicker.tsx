import { useState } from "react";

import { CalendarHeader } from "../CalendarHeader";
import type { CalendarYearPickerProps } from "./CalendarYearPicker.types";

function CalendarYearPicker({ activeYear, onSelectYear, ...headerProps }: CalendarYearPickerProps) {
  let start = parseInt((activeYear / 10).toFixed(0)) * 10;
  if (activeYear + 1 === start) {
    start -= 10;
  }

  const [years, setYears] = useState<number[]>(() =>
    Array.from({ length: 12 }).map((_, index) => start - 1 + index)
  );

  const handleLeft = () => {
    setYears((prev) => prev.map((year) => year - 10));
  };

  const handleRight = () => {
    setYears((prev) => prev.map((year) => year + 10));
  };

  return (
    <>
      <CalendarHeader
        header={`${years[1]} - ${years[1] + 9}`}
        onClickLeftArrow={handleLeft}
        onClickRightArrow={handleRight}
        {...headerProps}
      />

      <div className="GeckoUICalendar__year-picker">
        {years.map((year, i) => {
          const selected = activeYear === year;
          const isPrevNext = i === 0 || i === 11;

          return (
            <button
              className="GeckoUICalendar__year-picker__button"
              data-selected={selected || undefined}
              data-prev-next={isPrevNext || undefined}
              key={year}
              onClick={() => onSelectYear?.(year)}
              type="button">
              {year}
            </button>
          );
        })}
      </div>
    </>
  );
}

CalendarYearPicker.displayName = "CalendarYearPicker";

export default CalendarYearPicker;
