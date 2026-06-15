"use client";

import { DateRangeInput } from "@geckoui/geckoui";
import type { DateRange } from "@geckoui/geckoui";
import { useState } from "react";

export function BasicDateRangeInputExample() {
  const [value, setValue] = useState<DateRange | undefined>();

  return (
    <div className="space-y-4">
      <DateRangeInput value={value} onChange={(v) => setValue(v ?? undefined)} />
      {value?.from && (
        <p className="text-sm text-gray-600">
          Selected: {value.from} - {value.to || "..."}
        </p>
      )}
    </div>
  );
}

export function WithDefaultValueExample() {
  const [value, setValue] = useState<DateRange | undefined>({
    from: "2024-06-01",
    to: "2024-06-15"
  });

  return (
    <div className="space-y-4">
      <DateRangeInput value={value} onChange={(v) => setValue(v ?? undefined)} />
      <p className="text-sm text-gray-600">
        Selected: {value?.from || "None"} - {value?.to || "None"}
      </p>
    </div>
  );
}

export function DateFormatsExample() {
  const [value1, setValue1] = useState<DateRange | undefined>();
  const [value2, setValue2] = useState<DateRange | undefined>();
  const [value3, setValue3] = useState<DateRange | undefined>();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">DD/MM/YYYY (default)</p>
        <DateRangeInput
          value={value1}
          onChange={(v) => setValue1(v ?? undefined)}
          format="DD/MM/YYYY"
        />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">MM/DD/YYYY</p>
        <DateRangeInput
          value={value2}
          onChange={(v) => setValue2(v ?? undefined)}
          format="MM/DD/YYYY"
        />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">YYYY-MM-DD</p>
        <DateRangeInput
          value={value3}
          onChange={(v) => setValue3(v ?? undefined)}
          format="YYYY-MM-DD"
        />
      </div>
    </div>
  );
}

export function NumberOfMonthsExample() {
  const [value1, setValue1] = useState<DateRange | undefined>();
  const [value2, setValue2] = useState<DateRange | undefined>();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Single month</p>
        <DateRangeInput
          value={value1}
          onChange={(v) => setValue1(v ?? undefined)}
        />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Dual months (default)</p>
        <DateRangeInput
          value={value2}
          onChange={(v) => setValue2(v ?? undefined)}
        />
      </div>
    </div>
  );
}

export function DisabledReadOnlyExample() {
  const defaultValue: DateRange = {
    from: "2024-06-01",
    to: "2024-06-15"
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Disabled</p>
        <DateRangeInput value={defaultValue} disabled />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Read-only</p>
        <DateRangeInput value={defaultValue} readOnly />
      </div>
    </div>
  );
}

export function ErrorStateExample() {
  const [value, setValue] = useState<DateRange | undefined>();

  return (
    <div className="space-y-4">
      <DateRangeInput value={value} onChange={(v) => setValue(v ?? undefined)} hasError />
      <p className="text-sm text-red-600">Please select a valid date range</p>
    </div>
  );
}
