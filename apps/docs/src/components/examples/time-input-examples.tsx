"use client";

import { TimeInput } from "@geckoui/geckoui";
import { useState } from "react";

export function TimeInputBasicExample() {
  const [time, setTime] = useState<string | null>("14:30");

  return (
    <div className="w-full max-w-xs space-y-3">
      <TimeInput value={time} onChange={setTime} />
      <p className="text-sm">
        value: <code>{JSON.stringify(time)}</code>
      </p>
    </div>
  );
}

export function TimeInputFormatsExample() {
  const [time, setTime] = useState<string | null>("16:05:30");

  return (
    <div className="w-full max-w-xs space-y-3">
      {(["HH:mm", "hh:mm A", "HH:mm:ss", "hh:mm:ss A"] as const).map((format) => (
        <TimeInput key={format} value={time} onChange={setTime} format={format} />
      ))}
      <p className="text-sm">
        value: <code>{JSON.stringify(time)}</code>
      </p>
    </div>
  );
}

export function TimeInputStepExample() {
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className="w-full max-w-xs">
      <TimeInput value={time} onChange={setTime} step={30} placeholder="Pick a slot" />
    </div>
  );
}

export function TimeInputDisabledTimeExample() {
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className="w-full max-w-xs space-y-3">
      <TimeInput
        value={time}
        onChange={setTime}
        format="hh:mm A"
        step={30}
        disabledTime={({ hour }) => hour < 9 || hour >= 17 || hour === 13}
      />
      <p className="text-sm">
        value: <code>{JSON.stringify(time)}</code>
      </p>
    </div>
  );
}

export function TimeInputSplitExample() {
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className="w-full max-w-xs">
      <TimeInput
        value={time}
        onChange={setTime}
        format="hh:mm A"
        disabledTime={({ hour }) => ![1, 2, 16, 17].includes(hour)}
      />
    </div>
  );
}

export function TimeInputStatesExample() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      <TimeInput value="09:00" disabled />
      <TimeInput value="09:00" readOnly />
      <TimeInput value="09:00" hasError />
    </div>
  );
}
