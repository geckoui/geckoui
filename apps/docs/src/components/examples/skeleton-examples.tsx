"use client";

import { Button, Skeleton } from "@geckoui/geckoui";
import { useState } from "react";

export function SkeletonBasicExample() {
  return (
    <div className="w-full max-w-md">
      <Skeleton lines={3} />
    </div>
  );
}

export function SkeletonShapesExample() {
  return (
    <div className="flex w-full items-start gap-6">
      <Skeleton shape="circle" className="size-12" />
      <Skeleton shape="rounded" className="h-24 w-40" />
      <div className="flex-1">
        <Skeleton lines={2} />
      </div>
    </div>
  );
}

export function SkeletonAnimationsExample() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {(["pulse", "wave", "none"] as const).map((animation) => (
        <div key={animation} className="space-y-2">
          <code className="text-xs">{animation}</code>
          <Skeleton animation={animation} shape="rounded" className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonLoadingExample() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full space-y-4">
      <Button variant="outlined" size="sm" onClick={() => setLoading((prev) => !prev)}>
        {loading ? "Finish loading" : "Load again"}
      </Button>

      <div className="flex items-start gap-4">
        <Skeleton loading={loading} shape="circle" className="size-12">
          <div
            className="size-12 rounded-full"
            style={{ background: "var(--color-primary-600)" }}
          />
        </Skeleton>

        <div className="flex-1 space-y-2">
          <Skeleton loading={loading} className="w-40">
            <p className="font-semibold">Ada Lovelace</p>
          </Skeleton>

          <Skeleton loading={loading} lines={2}>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Wrote the first algorithm intended for a machine, which is a reasonable thing to put
              in a placeholder.
            </p>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}

export function SkeletonThemedExample() {
  return (
    <div className="w-full max-w-md">
      <Skeleton
        lines={3}
        animation="wave"
        className="[--gecko-skeleton-bg:var(--color-primary-200)] [--gecko-skeleton-duration:0.9s] [--gecko-skeleton-line-gap:0.75rem]"
      />
    </div>
  );
}
