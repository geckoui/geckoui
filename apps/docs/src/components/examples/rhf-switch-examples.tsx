"use client";

import { Button, RHFInputGroup, RHFSwitch } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFSwitchExample() {
  const methods = useForm({
    defaultValues: {
      enabled: false
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex items-center gap-2">
        <RHFSwitch name="enabled" />
        <span>Enable notifications</span>
      </div>
    </FormProvider>
  );
}

export function WithCustomValuesExample() {
  const methods = useForm({
    defaultValues: {
      status: "no"
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex items-center gap-2">
        <RHFSwitch name="status" value="yes" uncheckedValue="no" />
        <span>Accept terms and conditions</span>
      </div>
    </FormProvider>
  );
}

export function WithNumberValuesExample() {
  const methods = useForm({
    defaultValues: {
      mode: 0
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex items-center gap-2">
        <RHFSwitch name="mode" value={1} uncheckedValue={0} />
        <span>Dark mode</span>
      </div>
    </FormProvider>
  );
}

export function WithObjectValuesExample() {
  const methods = useForm({
    defaultValues: {
      settings: { theme: "light", notifications: false }
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex items-center gap-2">
        <RHFSwitch
          name="settings"
          value={{ theme: "dark", notifications: true }}
          uncheckedValue={{ theme: "light", notifications: false }}
        />
        <span>Advanced mode</span>
      </div>
    </FormProvider>
  );
}

export function DifferentSizesExample() {
  const methods = useForm({
    defaultValues: {
      small: false,
      medium: false,
      large: false
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <RHFSwitch name="small" size="sm" />
          <span>Small switch</span>
        </div>
        <div className="flex items-center gap-2">
          <RHFSwitch name="medium" size="md" />
          <span>Medium switch (default)</span>
        </div>
      </div>
    </FormProvider>
  );
}

export function DisabledExample() {
  const methods = useForm({
    defaultValues: {
      disabledOn: true,
      disabledOff: false
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 opacity-50">
          <RHFSwitch name="disabledOn" disabled />
          <span>Disabled (On)</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <RHFSwitch name="disabledOff" disabled />
          <span>Disabled (Off)</span>
        </div>
      </div>
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    terms: z.literal(true, { message: "You must accept the terms" })
  });

  const methods = useForm({
    resolver: zodResolver(schema) as never,
    mode: "onBlur",
    defaultValues: {
      terms: false
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup required>
        <div className="flex items-center gap-2">
          <RHFSwitch name="terms" />
          <span>I accept the terms and conditions</span>
        </div>
      </RHFInputGroup>
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    notifications: z.boolean(),
    marketing: z.boolean(),
    darkMode: z.boolean(),
    twoFactor: z.literal(true, { message: "Two-factor authentication is required" })
  });

  const methods = useForm({
    resolver: zodResolver(schema) as never,
    mode: "onBlur",
    defaultValues: {
      notifications: true,
      marketing: false,
      darkMode: false,
      twoFactor: false
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Email notifications</span>
            <RHFSwitch name="notifications" />
          </div>
          <div className="flex items-center justify-between">
            <span>Marketing emails</span>
            <RHFSwitch name="marketing" />
          </div>
          <div className="flex items-center justify-between">
            <span>Dark mode</span>
            <RHFSwitch name="darkMode" />
          </div>
        </div>

        <RHFInputGroup required>
          <div className="flex items-center gap-2">
            <RHFSwitch name="twoFactor" />
            <span>Enable two-factor authentication</span>
          </div>
        </RHFInputGroup>

        <Button type="submit">Save Settings</Button>
      </form>
    </FormProvider>
  );
}
