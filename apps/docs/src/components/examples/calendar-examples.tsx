"use client";

import { Button, Calendar } from "@geckoui/geckoui";
import type { CalendarRef, DateRange } from "@geckoui/geckoui";
import { useRef, useState } from "react";

export function BasicCalendarExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  return (
    <div className="space-y-4">
      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      {selectedDate && <p className="text-sm text-gray-600">Selected: {selectedDate}</p>}
    </div>
  );
}

export function WithDefaultDateExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>("2024-06-15");

  return (
    <div className="space-y-4">
      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <p className="text-sm text-gray-600">Selected: {selectedDate || "None"}</p>
    </div>
  );
}

export function ProgrammaticControlExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const calendarRef = useRef<CalendarRef>(null);

  const jumpToDate = (month: number, year: number) => {
    calendarRef.current?.moveTo(month, year);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" variant="outlined" onClick={() => jumpToDate(1, 2025)}>
          January 2025
        </Button>
        <Button size="sm" variant="outlined" onClick={() => jumpToDate(7, 2024)}>
          July 2024
        </Button>
        <Button size="sm" variant="outlined" onClick={() => jumpToDate(12, 2023)}>
          December 2023
        </Button>
      </div>
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        calendarRef={calendarRef}
      />
      {selectedDate && <p className="text-sm text-gray-600">Selected: {selectedDate}</p>}
    </div>
  );
}

export function WithFormIntegrationExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In real app: submit form with selectedDate
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select Date</label>
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>
      <Button type="submit" disabled={!selectedDate}>
        Submit
      </Button>
      {submitted && (
        <p className="text-sm text-green-600">Form submitted with date: {selectedDate}</p>
      )}
    </form>
  );
}

export function RangeModeExample() {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  return (
    <div className="space-y-4">
      <Calendar
        mode="range"
        selectedRange={selectedRange}
        onSelectRange={(range) => setSelectedRange(range ?? undefined)}
      />
      {selectedRange?.from && (
        <p className="text-sm text-gray-600">
          Selected: {selectedRange.from} - {selectedRange.to || "..."}
        </p>
      )}
    </div>
  );
}

export function RangeWithNumberOfMonthsExample() {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  return (
    <div className="space-y-4">
      <Calendar
        mode="range"
        selectedRange={selectedRange}
        onSelectRange={(range) => setSelectedRange(range ?? undefined)}
      />
      {selectedRange?.from && (
        <p className="text-sm text-gray-600">
          Selected: {selectedRange.from} - {selectedRange.to || "..."}
        </p>
      )}
    </div>
  );
}

export function DisableDateExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const disableDate = (date: string) => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  return (
    <div className="space-y-4">
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        disableDate={disableDate}
      />
      {selectedDate && <p className="text-sm text-gray-600">Selected: {selectedDate}</p>}
    </div>
  );
}

export function CustomDayCellExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const hasEvent = (date: string) => {
    const today = new Date();
    return today.getDate() === new Date(date).getDate();
  };

  return (
    <div className="space-y-4">
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        renderDayCell={({ day, date }) => (
          <>
            <span>{day}</span>
            {hasEvent(date) && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </>
        )}
      />
      {selectedDate && <p className="text-sm text-gray-600">Selected: {selectedDate}</p>}
    </div>
  );
}
