import type { ReactNode } from "react";

import type { CalendarHeaderProps } from "./CalendarHeader.types";

function CalendarHeader({
  onClickLeftArrow,
  onClickRightArrow,
  header,
  onClickHeader
}: CalendarHeaderProps): ReactNode {
  return (
    <div className="GeckoUICalendar__header">
      <button
        className="GeckoUICalendar__header__arrow-button GeckoUICalendar__header__arrow-button--left"
        onClick={onClickLeftArrow}
        type="button">
        <div className="GeckoUICalendar__header__arrow-left-icon" />
      </button>

      <button
        className="GeckoUICalendar__header__title"
        data-clickable={onClickHeader ? "" : undefined}
        onClick={onClickHeader}
        type="button">
        {header}
      </button>

      <button
        className="GeckoUICalendar__header__arrow-button GeckoUICalendar__header__arrow-button--right"
        onClick={onClickRightArrow}
        type="button">
        <div className="GeckoUICalendar__header__arrow-right-icon" />
      </button>
    </div>
  );
}

CalendarHeader.displayName = "CalendarHeader";

export default CalendarHeader;
