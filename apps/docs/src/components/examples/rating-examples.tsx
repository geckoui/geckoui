"use client";

import { Rating } from "@geckoui/geckoui";
import { useState } from "react";

const Heart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21s-6.7-4.35-9.33-8.02C.86 10.3 1.6 6.7 4.4 5.4c2-.93 4.2-.2 5.4 1.35L12 9l2.2-2.25c1.2-1.55 3.4-2.28 5.4-1.35 2.8 1.3 3.54 4.9 1.73 7.58C18.7 16.65 12 21 12 21Z" />
  </svg>
);

export function RatingBasicExample() {
  const [score, setScore] = useState(3);

  return (
    <div className="space-y-3">
      <Rating value={score} onChange={setScore} aria-label="Score" />
      <p className="text-sm">
        value: <code>{score}</code>
      </p>
    </div>
  );
}

export function RatingPrecisionExample() {
  const [score, setScore] = useState(3.5);

  return (
    <div className="space-y-3">
      {([1, 0.5, 0.25, 0.1] as const).map((precision) => (
        <div key={precision} className="flex items-center gap-3">
          <Rating
            value={score}
            onChange={setScore}
            precision={precision}
            aria-label={`Precision ${precision}`}
          />
          <span className="text-sm">
            precision <code>{precision}</code>
          </span>
        </div>
      ))}
      <p className="text-sm">
        value: <code>{score}</code>
      </p>
    </div>
  );
}

export function RatingReadOnlyExample() {
  return (
    <div className="space-y-2">
      {[4.3, 2.7, 5, 0].map((average) => (
        <div key={average} className="flex items-center gap-3">
          <Rating value={average} readOnly aria-label={`${average} out of 5`} />
          <span className="text-sm">{average}</span>
        </div>
      ))}
    </div>
  );
}

export function RatingIconsExample() {
  const [hearts, setHearts] = useState(2);

  return (
    <div className="space-y-3">
      <Rating value={hearts} onChange={setHearts} color="error" icon={<Heart />} />
      <Rating
        value={4}
        onChange={() => {}}
        color="primary"
        icon={
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
          </svg>
        }
        emptyIcon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="8" strokeWidth="2" />
          </svg>
        }
      />
    </div>
  );
}

export function RatingSizesExample() {
  return (
    <div className="space-y-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Rating key={size} value={3} onChange={() => {}} size={size} />
      ))}
    </div>
  );
}

export function RatingColorsExample() {
  return (
    <div className="space-y-3">
      {(["default", "primary", "success", "error", "warning", "info"] as const).map((color) => (
        <Rating key={color} value={3} onChange={() => {}} color={color} />
      ))}
    </div>
  );
}
