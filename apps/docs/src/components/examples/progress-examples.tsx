"use client";

import { Progress } from "@geckoui/geckoui";
import { useState } from "react";

export function ProgressBasicExample() {
  const [value, setValue] = useState(40);

  return (
    <div className="w-full space-y-4">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        aria-label="Progress"
      />
      <Progress value={value} label={({ percent }) => `${percent}%`} />
    </div>
  );
}

export function ProgressMaxExample() {
  return (
    <div className="w-full">
      <Progress value={3} max={7} label={({ value, max }) => `${value} of ${max} files`} />
    </div>
  );
}

export function ProgressIndeterminateExample() {
  return (
    <div className="w-full">
      <Progress label="Uploading…" />
    </div>
  );
}

export function ProgressColorsExample() {
  return (
    <div className="w-full space-y-3">
      {(["default", "primary", "success", "error", "warning", "info"] as const).map((color) => (
        <Progress key={color} value={60} color={color} label={color} />
      ))}
    </div>
  );
}

export function ProgressSizesExample() {
  return (
    <div className="w-full space-y-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Progress key={size} value={60} size={size} />
      ))}
    </div>
  );
}

export function ProgressThemedExample() {
  return (
    <div className="w-full">
      <Progress
        value={70}
        size="lg"
        className="[--gecko-progress-accent:var(--color-primary-400)] [--gecko-progress-radius:0.25rem]"
      />
    </div>
  );
}
