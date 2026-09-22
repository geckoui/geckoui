"use client";

import { Button, Label, RHFError, RHFRating } from "@geckoui/geckoui";
import { FormProvider, useForm } from "react-hook-form";

export function BasicRHFRatingExample() {
  const methods = useForm({ defaultValues: { score: 3 } });
  const score = methods.watch("score");

  return (
    <FormProvider {...methods}>
      <div className="space-y-2">
        <Label>How was it?</Label>
        <RHFRating name="score" />
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          The form holds <code>{JSON.stringify(score)}</code>
        </p>
      </div>
    </FormProvider>
  );
}

export function RHFRatingRequiredExample() {
  const methods = useForm({ defaultValues: { score: 0 } });

  return (
    <FormProvider {...methods}>
      <form className="space-y-3" onSubmit={methods.handleSubmit(() => undefined)} noValidate>
        <Label>Rate this article</Label>
        <RHFRating name="score" rules={{ min: { value: 1, message: "Pick a rating" } }} />
        <RHFError name="score" />

        <Button type="submit" size="sm">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

export function RHFRatingHalfExample() {
  const methods = useForm({ defaultValues: { score: 3.5 } });
  const score = methods.watch("score");

  return (
    <FormProvider {...methods}>
      <div className="space-y-2">
        <RHFRating name="score" precision={0.5} />
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          The form holds <code>{JSON.stringify(score)}</code>
        </p>
      </div>
    </FormProvider>
  );
}
