import type { FC, MouseEvent, RefObject } from "react";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { classNames } from "../../utils/classNames";
import {
  formatToISO,
  getDaysInMonth,
  getSegmentOrder,
  isValidDate,
  parseISOToDisplay,
  sanitizeNumericInput
} from "../BaseDateInput/BaseDateInput.utils";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import type { BaseDateRangeInputProps } from "./BaseDateRangeInput.types";

type SegmentType = "startMonth" | "startDay" | "startYear" | "endMonth" | "endDay" | "endYear";

const BaseDateRangeInput: FC<BaseDateRangeInputProps> = ({
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
  hideClearIcon = false,
  hideCalendarIcon = false,
  renderCalendarIcon,
  onStateUpdate,
  onSubmit,
  hasFocus,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const startMonthRef = useRef<HTMLInputElement>(null);
  const startDayRef = useRef<HTMLInputElement>(null);
  const startYearRef = useRef<HTMLInputElement>(null);
  const endMonthRef = useRef<HTMLInputElement>(null);
  const endDayRef = useRef<HTMLInputElement>(null);
  const endYearRef = useRef<HTMLInputElement>(null);

  const [startMonth, setStartMonth] = useState("");
  const [startDay, setStartDay] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endYear, setEndYear] = useState("");
  const [lastUpdatedTime, setLastUpdatedTime] = useState(0);

  const segmentRefs: Record<SegmentType, RefObject<HTMLInputElement | null>> = {
    startMonth: startMonthRef,
    startDay: startDayRef,
    startYear: startYearRef,
    endMonth: endMonthRef,
    endDay: endDayRef,
    endYear: endYearRef
  };

  const focusRef = (ref: RefObject<HTMLInputElement | null>) => {
    ref.current?.focus();
    ref.current?.select();
  };

  const clearFocus = () => {
    Object.values(segmentRefs).forEach((ref) => ref.current?.blur());
  };

  const getSegmentOrderForRange = (): SegmentType[] => {
    const baseOrder = getSegmentOrder(format);
    const startSegments = baseOrder.map(
      (s) => `start${s.charAt(0).toUpperCase()}${s.slice(1)}` as SegmentType
    );
    const endSegments = baseOrder.map(
      (s) => `end${s.charAt(0).toUpperCase()}${s.slice(1)}` as SegmentType
    );
    return [...startSegments, ...endSegments];
  };

  const focusNextSegment = (currentSegment: SegmentType) => {
    const segmentOrder = getSegmentOrderForRange();
    const nextIndex = segmentOrder.indexOf(currentSegment) + 1;
    if (nextIndex < segmentOrder.length) {
      focusRef(segmentRefs[segmentOrder[nextIndex]]);
    }
  };

  const updateValue = (
    sMonth: string,
    sDay: string,
    sYear: string,
    eMonth: string,
    eDay: string,
    eYear: string
  ) => {
    const startValid = isValidDate(sYear, sMonth, sDay);
    const endValid = isValidDate(eYear, eMonth, eDay);

    if (startValid && endValid) {
      onChange?.({ from: formatToISO(sYear, sMonth, sDay), to: formatToISO(eYear, eMonth, eDay) });
    } else if (startValid) {
      onChange?.({ from: formatToISO(sYear, sMonth, sDay), to: null });
    } else {
      onChange?.(null);
    }

    onStateUpdate?.({
      startDay: sDay || "",
      startMonth: sMonth || "",
      startYear: sYear || "",
      endDay: eDay || "",
      endMonth: eMonth || "",
      endYear: eYear || ""
    });
  };

  const getDisplayValue = (val: string, placeholder: string, padLength: number) => {
    if (!val) return placeholder;
    return padLength === 4 ? val.padStart(4, "0") : val.length === 1 ? `0${val}` : val;
  };

  const isEmpty = !startMonth && !startDay && !startYear && !endMonth && !endDay && !endYear;

  const createMonthHandler =
    (
      isStart: boolean,
      month: string,
      setMonth: (v: string) => void,
      day: string,
      setDay: (v: string) => void,
      year: string,
      segment: SegmentType
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = sanitizeNumericInput(e.target.value, 2);
      const num = parseInt(val, 10);
      if (num > 12) val = "12";
      if (val.length === 1 && num >= 2 && num <= 9) val = `0${num}`;

      const monthNum = parseInt(val, 10);
      const yearNum = parseInt(year, 10) || new Date().getFullYear();

      if (val && day) {
        const dayNum = parseInt(day, 10);
        const maxDays = getDaysInMonth(monthNum, yearNum);
        if (dayNum > maxDays) setDay("");
      }

      setMonth(val);
      setLastUpdatedTime(Date.now());

      if (isStart) {
        updateValue(val, day, year, endMonth, endDay, endYear);
      } else {
        updateValue(startMonth, startDay, startYear, val, day, year);
      }

      if (val.length === 2) focusNextSegment(segment);
    };

  const createDayHandler =
    (
      isStart: boolean,
      month: string,
      day: string,
      setDay: (v: string) => void,
      year: string,
      segment: SegmentType
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = sanitizeNumericInput(e.target.value, 2);
      const dayNum = parseInt(val, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10) || new Date().getFullYear();
      const maxDays = monthNum ? getDaysInMonth(monthNum, yearNum) : 31;

      if (dayNum > maxDays) val = maxDays.toString();

      if (val.length === 1) {
        const digit = parseInt(val, 10);
        if (digit >= 4 && digit <= 9) {
          val = `0${digit}`;
        } else if (digit === 3 && monthNum && maxDays < 31 && maxDays <= 29) {
          val = `0${digit}`;
        }
      }

      setDay(val);
      setLastUpdatedTime(Date.now());

      if (isStart) {
        updateValue(month, val, year, endMonth, endDay, endYear);
      } else {
        updateValue(startMonth, startDay, startYear, month, val, year);
      }

      if (val.length === 2) focusNextSegment(segment);
    };

  const createYearHandler =
    (
      isStart: boolean,
      month: string,
      day: string,
      setDay: (v: string) => void,
      year: string,
      setYear: (v: string) => void,
      segment: SegmentType
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = sanitizeNumericInput(e.target.value, 4);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(val, 10);

      if (val.length === 4 && month && day) {
        const dayNum = parseInt(day, 10);
        const maxDays = getDaysInMonth(monthNum, yearNum);
        if (dayNum > maxDays) setDay("");
      }

      setYear(val);
      setLastUpdatedTime(Date.now());

      if (isStart) {
        updateValue(month, day, val, endMonth, endDay, endYear);
      } else {
        updateValue(startMonth, startDay, startYear, month, day, val);
      }

      if (val.length === 4) focusNextSegment(segment);
    };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, segment: SegmentType) => {
    const segmentOrder = getSegmentOrderForRange();
    const currentIndex = segmentOrder.indexOf(segment);

    const focusSegmentByIndex = (index: number) => {
      if (index < 0 || index >= segmentOrder.length) return;
      focusRef(segmentRefs[segmentOrder[index]]);
    };

    if (e.key === "Tab") {
      e.preventDefault();
      focusSegmentByIndex(e.shiftKey ? currentIndex - 1 : currentIndex + 1);
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusSegmentByIndex(currentIndex - 1);
    }

    if (e.key === "ArrowRight" || e.key === "/") {
      e.preventDefault();
      focusSegmentByIndex(currentIndex + 1);
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      clearFocus();
      onSubmit?.();
    }
  };

  const handleDisplayClick = (segment?: SegmentType) => {
    if (disabled || readOnly) return;

    onStateUpdate?.({
      startDay: startDay || "",
      startMonth: startMonth || "",
      startYear: startYear || "",
      endDay: endDay || "",
      endMonth: endMonth || "",
      endYear: endYear || ""
    });

    if (segment) {
      focusRef(segmentRefs[segment]);
    } else {
      const firstSegment = getSegmentOrderForRange()[0];
      focusRef(segmentRefs[firstSegment]);
    }
  };

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setStartMonth("");
    setStartDay("");
    setStartYear("");
    setEndMonth("");
    setEndDay("");
    setEndYear("");
    onStateUpdate?.({
      startDay: "",
      startMonth: "",
      startYear: "",
      endDay: "",
      endMonth: "",
      endYear: ""
    });
    onChange?.(null);
    onSubmit?.();
    clearFocus();
  };

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdatedTime;

    if (timeSinceLastUpdate > 500) {
      if (value?.from) {
        const { month: m, day: d, year: y } = parseISOToDisplay(value.from);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStartMonth(m);
        setStartDay(d);
        setStartYear(y);
      } else {
        setStartMonth("");
        setStartDay("");
        setStartYear("");
      }

      if (value?.to) {
        const { month: m, day: d, year: y } = parseISOToDisplay(value.to);
        setEndMonth(m);
        setEndDay(d);
        setEndYear(y);
      } else {
        setEndMonth("");
        setEndDay("");
        setEndYear("");
      }
    }
  }, [value, lastUpdatedTime]);

  const baseOrder = getSegmentOrder(format);

  const startInputs = {
    month: {
      ref: startMonthRef,
      value: startMonth,
      onChange: createMonthHandler(
        true,
        startMonth,
        setStartMonth,
        startDay,
        setStartDay,
        startYear,
        "startMonth"
      ),
      maxLength: 2,
      segment: "startMonth" as const,
      display: getDisplayValue(startMonth, "MM", 2)
    },
    day: {
      ref: startDayRef,
      value: startDay,
      onChange: createDayHandler(true, startMonth, startDay, setStartDay, startYear, "startDay"),
      maxLength: 2,
      segment: "startDay" as const,
      display: getDisplayValue(startDay, "DD", 2)
    },
    year: {
      ref: startYearRef,
      value: startYear,
      onChange: createYearHandler(
        true,
        startMonth,
        startDay,
        setStartDay,
        startYear,
        setStartYear,
        "startYear"
      ),
      maxLength: 4,
      segment: "startYear" as const,
      display: getDisplayValue(startYear, "YYYY", 4)
    }
  };

  const endInputs = {
    month: {
      ref: endMonthRef,
      value: endMonth,
      onChange: createMonthHandler(
        false,
        endMonth,
        setEndMonth,
        endDay,
        setEndDay,
        endYear,
        "endMonth"
      ),
      maxLength: 2,
      segment: "endMonth" as const,
      display: getDisplayValue(endMonth, "MM", 2)
    },
    day: {
      ref: endDayRef,
      value: endDay,
      onChange: createDayHandler(false, endMonth, endDay, setEndDay, endYear, "endDay"),
      maxLength: 2,
      segment: "endDay" as const,
      display: getDisplayValue(endDay, "DD", 2)
    },
    year: {
      ref: endYearRef,
      value: endYear,
      onChange: createYearHandler(
        false,
        endMonth,
        endDay,
        setEndDay,
        endYear,
        setEndYear,
        "endYear"
      ),
      maxLength: 4,
      segment: "endYear" as const,
      display: getDisplayValue(endYear, "YYYY", 4)
    }
  };

  const startSegments = baseOrder.map((seg) => startInputs[seg]);
  const endSegments = baseOrder.map((seg) => endInputs[seg]);

  const startEmpty = !startMonth && !startDay && !startYear;
  const endEmpty = !endMonth && !endDay && !endYear;

  const startValid = isValidDate(startYear, startMonth, startDay);
  const endValid = isValidDate(endYear, endMonth, endDay);

  const isError =
    (!isEmpty && ((!startEmpty && !startValid) || (!endEmpty && !endValid))) || hasError;

  const state = disabled ? "disabled" : readOnly ? "readonly" : "enabled";

  const renderSegments = (
    segments: Array<{
      ref: RefObject<HTMLInputElement | null>;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      maxLength: number;
      segment: SegmentType;
      display: string;
    }>
  ) => (
    <>
      {segments.map(({ ref, value, onChange, maxLength, segment, display }, index) => (
        <Fragment key={segment}>
          <label
            className="GeckoUIDateInput__segment"
            data-empty={!value || undefined}
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              handleDisplayClick(segment);
            }}>
            <input
              ref={ref}
              type="text"
              value={value}
              readOnly={readOnly}
              disabled={disabled}
              className="GeckoUIDateInput__hidden-input"
              onChange={onChange}
              onKeyDown={(e) => handleKeyDown(e, segment)}
              maxLength={maxLength}
              tabIndex={-1}
            />
            {display}
          </label>
          {index < segments.length - 1 && (
            <span className="GeckoUIDateInput__separator">{separator}</span>
          )}
        </Fragment>
      ))}
    </>
  );

  const generatePlaceholder = () => {
    const formattedPattern = format.replace(/\//g, separator);
    return placeholder ?? `${formattedPattern}${rangeSeparator}${formattedPattern}`;
  };

  return (
    <div
      ref={containerRef}
      className={classNames("GeckoUIDateInput", "GeckoUIDateRangeInput", className)}
      data-state={state}
      data-error={isError || undefined}
      data-empty={isEmpty || undefined}
      data-focus={hasFocus || undefined}
      {...rest}
      onClick={() => handleDisplayClick()}>
      {Boolean(prefix) && (
        <div className="GeckoUIDateInput__prefix">
          <DynamicComponentRenderer component={prefix} />
        </div>
      )}

      {!!isEmpty && (
        <span className={classNames("GeckoUIDateInput__placeholder", placeholderClassName)}>
          {generatePlaceholder()}
        </span>
      )}

      <div className={classNames("GeckoUIDateInput__display-container")}>
        {renderSegments(startSegments)}
        <span className="GeckoUIDateRangeInput__range-separator">{rangeSeparator}</span>
        {renderSegments(endSegments)}
      </div>

      {Boolean(suffix) && (
        <div className="GeckoUIDateInput__suffix">
          <DynamicComponentRenderer component={suffix} />
        </div>
      )}

      <div className="GeckoUIDateInput__icons">
        {!hideClearIcon && !isEmpty && !disabled && !readOnly && (
          <button
            type="button"
            disabled={disabled || readOnly}
            className="GeckoUIDateInput__clear-button"
            onClick={handleClear}>
            <div className="GeckoUI-icon__clear" />
          </button>
        )}

        {renderCalendarIcon}
        {!renderCalendarIcon && !hideCalendarIcon && (
          <div className="GeckoUIDateInput__calendar-icon" />
        )}
      </div>
    </div>
  );
};

BaseDateRangeInput.displayName = "BaseDateRangeInput";

export default BaseDateRangeInput;
