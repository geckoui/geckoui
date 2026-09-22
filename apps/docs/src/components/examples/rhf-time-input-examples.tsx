"use client";

import { Button, Label, RHFError, RHFTimeInput } from "@geckoui/geckoui";
import { FormProvider, useForm } from "react-hook-form";

export function BasicRHFTimeInputExample() {
  const methods = useForm({ defaultValues: { startsAt: "09:30" } });
  const startsAt = methods.watch("startsAt");

  return (
    <FormProvider {...methods}>
      <div className="max-w-xs space-y-2">
        <Label>Starts at</Label>
        <RHFTimeInput name="startsAt" />
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          The form holds <code>{JSON.stringify(startsAt)}</code>
        </p>
      </div>
    </FormProvider>
  );
}

export function RHFTimeInputRangeExample() {
  const methods = useForm({ defaultValues: { startsAt: "09:00", endsAt: "" } });
  const values = methods.watch();

  return (
    <FormProvider {...methods}>
      <form
        className="max-w-md space-y-3"
        onSubmit={methods.handleSubmit(() => undefined)}
        noValidate>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Starts at</Label>
            <RHFTimeInput name="startsAt" format="hh:mm A" />
          </div>

          <div className="space-y-1">
            <Label>Ends at</Label>
            <RHFTimeInput
              name="endsAt"
              format="hh:mm A"
              rules={{
                validate: (endsAt, values) =>
                  String(endsAt ?? "") > String(values.startsAt ?? "") || "Must be after the start"
              }}
            />
            <RHFError name="endsAt" />
          </div>
        </div>

        <p className="font-mono text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          {JSON.stringify(values)}
        </p>

        <Button type="submit" size="sm">
          Book
        </Button>
      </form>
    </FormProvider>
  );
}

export function RHFTimeInputErrorExample() {
  const methods = useForm({ defaultValues: { startsAt: "" } });

  return (
    <FormProvider {...methods}>
      <form
        className="max-w-xs space-y-3"
        onSubmit={methods.handleSubmit(() => undefined)}
        noValidate>
        <Label>Starts at</Label>
        <RHFTimeInput name="startsAt" rules={{ required: "Pick a time" }} />
        <RHFError name="startsAt" />

        <Button type="submit" size="sm">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

export function RHFTimeInputDisabledTimeExample() {
  const methods = useForm({ defaultValues: { startsAt: "" } });
  const startsAt = methods.watch("startsAt");

  return (
    <FormProvider {...methods}>
      <div className="max-w-xs space-y-2">
        <Label>Working hours only</Label>
        <RHFTimeInput name="startsAt" disabledTime={({ hour }) => hour < 9 || hour >= 17} />
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          The form holds <code>{JSON.stringify(startsAt)}</code>
        </p>
      </div>
    </FormProvider>
  );
}
