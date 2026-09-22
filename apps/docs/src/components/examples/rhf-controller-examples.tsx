"use client";

import { Button, Input, Label, RHFController } from "@geckoui/geckoui";
import type { FieldValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";

export function BasicRHFControllerExample() {
  const methods = useForm({ defaultValues: { email: "" } });
  const email = methods.watch("email");

  return (
    <FormProvider {...methods}>
      <div className="max-w-xs space-y-2">
        <Label>Email</Label>
        <RHFController
          name="email"
          render={({ field }) => <Input {...field} type="email" placeholder="Enter email" />}
        />
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          The form holds <code>{JSON.stringify(email)}</code>
        </p>
      </div>
    </FormProvider>
  );
}

export function RHFControllerFormStateExample() {
  const methods = useForm({ defaultValues: { password: "" } });

  return (
    <FormProvider {...methods}>
      <form
        className="max-w-xs space-y-3"
        onSubmit={methods.handleSubmit(() => undefined)}
        noValidate>
        <Label>Password</Label>
        <RHFController
          name="password"
          rules={{ minLength: { value: 8, message: "Eight characters at least" } }}
          render={({ field, fieldState, formState }) => (
            <div className="space-y-1">
              <Input {...field} type="password" placeholder="Enter password" />

              {fieldState.error && (
                <span className="text-sm" style={{ color: "var(--color-error)" }}>
                  {fieldState.error.message}
                </span>
              )}

              {formState.isDirty && !fieldState.error && (
                <span className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                  Unsaved changes
                </span>
              )}
            </div>
          )}
        />

        <Button type="submit" size="sm">
          Save
        </Button>
      </form>
    </FormProvider>
  );
}

export function RHFControllerNestedExample() {
  const outerForm = useForm<FieldValues>({ defaultValues: { outerField: "outer" } });
  const innerForm = useForm<FieldValues>({ defaultValues: { innerField: "inner" } });

  const outer = outerForm.watch("outerField");
  const inner = innerForm.watch("innerField");

  return (
    <FormProvider {...outerForm}>
      <FormProvider {...innerForm}>
        <div className="max-w-md space-y-4">
          <div className="space-y-1">
            <Label>Nearest provider, which is the inner form</Label>
            <RHFController name="innerField" render={({ field }) => <Input {...field} />} />
          </div>

          <div className="space-y-1">
            <Label>The outer form, by passing its control</Label>
            <RHFController
              name="outerField"
              control={outerForm.control}
              render={({ field }) => <Input {...field} />}
            />
          </div>

          <p className="font-mono text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            outer: {JSON.stringify(outer)} · inner: {JSON.stringify(inner)}
          </p>
        </div>
      </FormProvider>
    </FormProvider>
  );
}
