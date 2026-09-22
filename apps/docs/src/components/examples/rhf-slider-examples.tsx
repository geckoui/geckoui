"use client";

import { Label, RHFRangeSlider, RHFSlider } from "@geckoui/geckoui";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export function BasicRHFSliderExample() {
  const methods = useForm({ defaultValues: { volume: 40, price: [100, 400] } });
  const values = methods.watch();

  return (
    <FormProvider {...methods}>
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label>Volume</Label>
          <RHFSlider name="volume" label={({ value }) => `${value}%`} />
        </div>

        <div className="space-y-2">
          <Label>Price</Label>
          <RHFRangeSlider name="price" min={0} max={500} step={10} minGap={50} />
        </div>

        <pre
          className="rounded-md p-3 text-xs"
          style={{ background: "var(--color-surface-secondary)" }}>
          {JSON.stringify(values)}
        </pre>
      </div>
    </FormProvider>
  );
}

export function RHFSliderOnChangeEndExample() {
  const methods = useForm({ defaultValues: { price: [100, 400] } });
  const price = methods.watch("price");
  const [refined, setRefined] = useState<number[]>([100, 400]);

  return (
    <FormProvider {...methods}>
      <div className="max-w-md space-y-4">
        <Label>Price</Label>
        <RHFRangeSlider
          name="price"
          min={0}
          max={500}
          step={10}
          onChangeEnd={(value) => setRefined(value)}
        />

        <div className="space-y-1 font-mono text-xs">
          <p style={{ color: "var(--color-text-tertiary)" }}>
            form, every move: {JSON.stringify(price)}
          </p>
          <p style={{ color: "var(--color-text-tertiary)" }}>
            onChangeEnd, once: {JSON.stringify(refined)}
          </p>
        </div>
      </div>
    </FormProvider>
  );
}

export function RHFSliderUnsetExample() {
  const methods = useForm({ defaultValues: {} });
  const values = methods.watch();

  return (
    <FormProvider {...methods}>
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label>No value in the form, so it starts at min</Label>
          <RHFSlider name="level" min={10} max={90} />
        </div>

        <div className="space-y-2">
          <Label>Started somewhere else with defaultValue</Label>
          <RHFSlider name="other" min={10} max={90} defaultValue={50} />
        </div>

        <pre
          className="rounded-md p-3 text-xs"
          style={{ background: "var(--color-surface-secondary)" }}>
          {JSON.stringify(values)}
        </pre>
      </div>
    </FormProvider>
  );
}
