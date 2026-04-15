"use client";

import { Button, RHFDateRangeInput, RHFInput, RHFInputGroup } from "@geckoui/geckoui";
import type { DateRange } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFDateRangeInputExample() {
  const methods = useForm({
    defaultValues: {
      dateRange: undefined as DateRange | undefined
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFDateRangeInput name="dateRange" />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    dateRange: z
      .object({
        from: z.string().nullable(),
        to: z.string().nullable().optional()
      })
      .refine((data) => data.from && data.to, {
        message: "Please select both start and end dates"
      })
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      dateRange: { from: null, to: null }
    }
  });

  const onSubmit = methods.handleSubmit((data) => {
    alert(`Selected range: ${data.dateRange.from} to ${data.dateRange.to}`);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-4">
        <RHFInputGroup label="Date Range" required>
          <RHFDateRangeInput name="dateRange" />
        </RHFInputGroup>
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}

export function WithDefaultValueExample() {
  const methods = useForm({
    defaultValues: {
      dateRange: {
        from: "2024-06-01",
        to: "2024-06-15"
      }
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFDateRangeInput name="dateRange" />
    </FormProvider>
  );
}

export function NumberOfMonthsExample() {
  const methods = useForm({
    defaultValues: {
      dateRange: undefined as DateRange | undefined
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Single month</p>
          <RHFDateRangeInput name="dateRange" numberOfMonths={1} />
        </div>
      </div>
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    eventName: z.string().min(1, "Event name is required"),
    dateRange: z
      .object({
        from: z.string().nullable(),
        to: z.string().nullable().optional()
      })
      .refine((data) => data.from, {
        message: "Start date is required"
      })
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      eventName: "",
      dateRange: { from: null, to: null }
    }
  });

  const onSubmit = methods.handleSubmit((data) => {
    alert(JSON.stringify(data, null, 2));
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-4">
        <RHFInputGroup label="Event Name" required>
          <RHFInput name="eventName" placeholder="Enter event name" />
        </RHFInputGroup>
        <RHFInputGroup label="Event Dates" required>
          <RHFDateRangeInput name="dateRange" />
        </RHFInputGroup>
        <Button type="submit">Create Event</Button>
      </form>
    </FormProvider>
  );
}
