"use client";

import { DateInput } from "@geckoui/geckoui";
import { useState } from "react";

export function BasicDateInputExample() {
  const [date, setDate] = useState<string | null>(null);

  return <DateInput value={date} onChange={setDate} placeholder="Enter date" />;
}

export function WithPlaceholderExample() {
  const [date, setDate] = useState<string | null>(null);

  return <DateInput value={date} onChange={setDate} placeholder="MM/DD/YYYY" format="MM/DD/YYYY" />;
}

export function CustomFormatExample() {
  const [date, setDate] = useState<string | null>(null);

  return <DateInput value={date} onChange={setDate} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" />;
}

export function DifferentFormatsExample() {
  const [date1, setDate1] = useState<string | null>(null);
  const [date2, setDate2] = useState<string | null>(null);
  const [date3, setDate3] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <DateInput value={date1} onChange={setDate1} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" />
      <DateInput value={date2} onChange={setDate2} format="MM/DD/YYYY" placeholder="MM/DD/YYYY" />
      <DateInput value={date3} onChange={setDate3} format="YYYY-MM-DD" placeholder="YYYY-MM-DD" />
    </div>
  );
}

export function CustomSeparatorExample() {
  const [date1, setDate1] = useState<string | null>(null);
  const [date2, setDate2] = useState<string | null>(null);
  const [date3, setDate3] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <DateInput value={date1} onChange={setDate1} separator="/" placeholder="DD/MM/YYYY" />
      <DateInput value={date2} onChange={setDate2} separator="-" placeholder="DD-MM-YYYY" />
      <DateInput value={date3} onChange={setDate3} separator="." placeholder="DD.MM.YYYY" />
    </div>
  );
}

export function DisabledExample() {
  const [date, setDate] = useState<string | null>("2024-01-15");

  return <DateInput value={date} onChange={setDate} disabled />;
}

export function ReadOnlyExample() {
  const [date, setDate] = useState<string | null>("2024-12-25");

  return <DateInput value={date} onChange={setDate} readOnly />;
}
