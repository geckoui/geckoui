"use client";

import { RangeSlider, Slider } from "@geckoui/geckoui";
import { useState } from "react";

export function SliderBasicExample() {
  const [value, setValue] = useState(40);

  return (
    <div className="w-full max-w-md space-y-3">
      <Slider value={value} onChange={setValue} label={({ value }) => `${value}%`} />
      <p className="text-sm">
        value: <code>{value}</code>
      </p>
    </div>
  );
}

export function SliderChangeEndExample() {
  const [value, setValue] = useState(40);
  const [committed, setCommitted] = useState(40);

  return (
    <div className="w-full max-w-md space-y-3">
      <Slider value={value} onChange={setValue} onChangeEnd={setCommitted} />
      <p className="text-sm">
        while dragging: <code>{value}</code> · on release: <code>{committed}</code>
      </p>
    </div>
  );
}

export function SliderMarksExample() {
  const [value, setValue] = useState(50);

  return (
    <div className="w-full max-w-md">
      <Slider
        value={value}
        onChange={setValue}
        step={25}
        marks={[
          { value: 0, label: "Off" },
          { value: 25 },
          { value: 50, label: "Half" },
          { value: 75 },
          { value: 100, label: "Max" }
        ]}
      />
    </div>
  );
}

export function SliderRangeExample() {
  const [price, setPrice] = useState<[number, number]>([120, 380]);

  return (
    <div className="w-full max-w-md space-y-3">
      <RangeSlider
        value={price}
        onChange={setPrice}
        min={0}
        max={500}
        step={10}
        minGap={50}
        label={({ value }) => `$${value}`}
      />
      <p className="text-sm">
        value: <code>{JSON.stringify(price)}</code>
      </p>
    </div>
  );
}

export function SliderThumbExample() {
  const [value, setValue] = useState(40);

  return (
    <div className="w-full max-w-md">
      <Slider
        value={value}
        onChange={setValue}
        renderThumb={({ value: at, dragging }) => (
          <span
            className={`flex h-7 min-w-9 items-center justify-center rounded-md px-1.5 text-xs font-semibold text-white shadow ${
              dragging ? "bg-gray-900 dark:bg-white dark:text-gray-900" : "bg-blue-600"
            }`}>
            {at}
          </span>
        )}
      />
    </div>
  );
}

export function SliderColorsExample() {
  return (
    <div className="w-full max-w-md space-y-6">
      {(["default", "primary", "success", "error", "warning", "info"] as const).map((color) => (
        <Slider key={color} value={60} onChange={() => {}} color={color} />
      ))}
    </div>
  );
}

export function SliderSizesExample() {
  return (
    <div className="w-full max-w-md space-y-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Slider key={size} value={60} onChange={() => {}} size={size} />
      ))}
    </div>
  );
}

export function SliderStepExample() {
  const [value, setValue] = useState(2.5);

  return (
    <div className="w-full max-w-md space-y-3">
      <Slider
        value={value}
        onChange={setValue}
        min={0}
        max={10}
        step={0.1}
        label={({ value }) => value.toFixed(1)}
      />
      <p className="text-sm">
        value: <code>{value}</code>
      </p>
    </div>
  );
}
