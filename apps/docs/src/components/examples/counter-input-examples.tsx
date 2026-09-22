"use client";

import { CounterInput } from "@geckoui/geckoui";
import { useState } from "react";

export function CounterInputBasicExample() {
  const [value, setValue] = useState("0");

  return <CounterInput value={value} onChange={setValue} />;
}

export function CounterInputSizesExample() {
  const [sm, setSm] = useState("0");
  const [md, setMd] = useState("0");
  const [lg, setLg] = useState("0");

  return (
    <div className="flex flex-col gap-4">
      <CounterInput value={sm} onChange={setSm} size="sm" />
      <CounterInput value={md} onChange={setMd} size="md" />
      <CounterInput value={lg} onChange={setLg} size="lg" />
    </div>
  );
}

export function CounterInputMinMaxExample() {
  const [value, setValue] = useState("5");

  return <CounterInput value={value} onChange={setValue} min={0} max={10} />;
}

export function CounterInputStepExample() {
  const [value, setValue] = useState("0");

  return <CounterInput value={value} onChange={setValue} step={5} />;
}

export function CounterInputEditableExample() {
  const [value, setValue] = useState("0");

  return <CounterInput value={value} onChange={setValue} allowTyping />;
}

export function CounterInputDisabledExample() {
  const [value, setValue] = useState("5");

  return <CounterInput value={value} onChange={setValue} disabled />;
}

export function CounterInputReadOnlyExample() {
  const [value, setValue] = useState("5");

  return <CounterInput value={value} onChange={setValue} readOnly />;
}
