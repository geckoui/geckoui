"use client";

import { Badge } from "@geckoui/geckoui";

const COLORS = ["default", "primary", "success", "error", "warning", "info"] as const;

export function BadgeBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {COLORS.map((color) => (
        <Badge key={color} color={color}>
          {color}
        </Badge>
      ))}
    </div>
  );
}

export function BadgeVariantsExample() {
  return (
    <div className="flex flex-col gap-3">
      {(["filled", "soft", "outlined"] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-2">
          {COLORS.map((color) => (
            <Badge key={color} variant={variant} color={color}>
              {variant}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  );
}

export function BadgeSizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm" color="primary">
        Small
      </Badge>
      <Badge size="md" color="primary">
        Medium
      </Badge>
      <Badge size="lg" color="primary">
        Large
      </Badge>
    </div>
  );
}

export function BadgeShapesExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge shape="rounded" color="info">
        Rounded
      </Badge>
      <Badge shape="pill" color="info">
        Pill
      </Badge>
      <Badge shape="square" color="info">
        Square
      </Badge>
    </div>
  );
}

export function BadgeDotExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge color="success" dot>
        Live
      </Badge>
      <Badge color="warning" dot>
        Degraded
      </Badge>
      <Badge color="error" dot variant="filled">
        Down
      </Badge>
    </div>
  );
}

export function BadgeIconExample() {
  const Star = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M6 0l1.8 3.9 4.2.5-3.1 2.9.8 4.2L6 9.5 2.3 11.5l.8-4.2L0 4.4l4.2-.5L6 0z" />
    </svg>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge color="warning" icon={Star}>
        Featured
      </Badge>
      <Badge color="primary" variant="filled" icon={Star} shape="pill">
        Pro
      </Badge>
    </div>
  );
}
