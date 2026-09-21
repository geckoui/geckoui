"use client";

import { Button, Label, RHFColorInput, RHFError } from "@geckoui/geckoui";
import { FormProvider, useForm } from "react-hook-form";

const PALETTE = ["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6"];

export function BasicRHFColorInputExample() {
  const methods = useForm({ defaultValues: { brand: "#3b82f6" } });
  const brand = methods.watch("brand");

  return (
    <FormProvider {...methods}>
      <div className="max-w-xs space-y-2">
        <Label>Brand colour</Label>
        <RHFColorInput name="brand" swatches={PALETTE} />
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          The form holds <code>{JSON.stringify(brand)}</code>
        </p>
      </div>
    </FormProvider>
  );
}

export function RHFColorInputRequiredExample() {
  const methods = useForm({ defaultValues: {} });

  return (
    <FormProvider {...methods}>
      <form
        className="max-w-xs space-y-3"
        onSubmit={methods.handleSubmit(() => undefined)}
        noValidate>
        <Label>Brand colour</Label>
        <RHFColorInput name="brand" swatches={PALETTE} rules={{ required: "Pick a colour" }} />
        <RHFError name="brand" />

        <Button type="submit" size="sm">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

export function RHFColorInputFormatsExample() {
  const methods = useForm({ defaultValues: { pinned: "#10b981", overlay: "rgb(15, 23, 42)" } });
  const values = methods.watch();

  return (
    <FormProvider {...methods}>
      <div className="max-w-md space-y-4">
        <div className="space-y-1">
          <Label>Pinned to hex</Label>
          <RHFColorInput name="pinned" formats={["hex"]} swatches={PALETTE} />
        </div>

        <div className="space-y-1">
          <Label>Starting on RGB</Label>
          <RHFColorInput name="overlay" formats={["rgb", "hex"]} swatches={PALETTE} />
        </div>

        <pre
          className="rounded-md p-3 text-xs"
          style={{ background: "var(--color-surface-secondary)" }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    </FormProvider>
  );
}
