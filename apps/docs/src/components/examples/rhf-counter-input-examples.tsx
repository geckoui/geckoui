"use client";

import { Button, RHFCounterInput, RHFInputGroup } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFCounterInputExample() {
  const methods = useForm({
    defaultValues: {
      quantity: 1
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFCounterInput name="quantity" min={0} max={10} />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    quantity: z.number().min(1, "Quantity must be at least 1").max(10, "Maximum 10 items")
  });

  const methods = useForm({
    resolver: zodResolver(schema) as never,
    mode: "onChange",
    defaultValues: {
      quantity: 0
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Quantity" required>
        <RHFCounterInput name="quantity" min={0} max={10} />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function DifferentSizesExample() {
  const methods = useForm({
    defaultValues: {
      small: 0,
      medium: 0,
      large: 0
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4">
        <RHFCounterInput name="small" size="sm" />
        <RHFCounterInput name="medium" size="md" />
        <RHFCounterInput name="large" size="lg" />
      </div>
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    adults: z.number().min(1, "At least 1 adult required"),
    children: z.number().min(0),
    rooms: z.number().min(1, "At least 1 room required")
  });

  const methods = useForm({
    resolver: zodResolver(schema) as never,
    mode: "onChange",
    defaultValues: {
      adults: 1,
      children: 0,
      rooms: 1
    }
  });

  const onSubmit = (data: unknown) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Adults" required>
          <RHFCounterInput name="adults" min={1} max={10} />
        </RHFInputGroup>

        <RHFInputGroup label="Children">
          <RHFCounterInput name="children" min={0} max={10} />
        </RHFInputGroup>

        <RHFInputGroup label="Rooms" required>
          <RHFCounterInput name="rooms" min={1} max={5} />
        </RHFInputGroup>

        <Button type="submit">Book Now</Button>
      </form>
    </FormProvider>
  );
}
