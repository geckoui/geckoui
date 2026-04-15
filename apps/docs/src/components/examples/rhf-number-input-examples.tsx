"use client";

import { Button, RHFInputGroup, RHFNumberInput } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFNumberInputExample() {
  const methods = useForm({
    defaultValues: {
      basicBalance: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFNumberInput name="basicBalance" placeholder="Enter amount" />
    </FormProvider>
  );
}

export function IntegerOnlyExample() {
  const methods = useForm({
    defaultValues: {
      integerQuantity: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFNumberInput
        name="integerQuantity"
        maxFractionDigits={0}
        placeholder="Enter quantity (integers only)"
      />
    </FormProvider>
  );
}

export function WithDecimalsExample() {
  const methods = useForm({
    defaultValues: {
      decimalPrice: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFNumberInput
        name="decimalPrice"
        maxFractionDigits={2}
        placeholder="Enter price (2 decimals)"
      />
    </FormProvider>
  );
}

export function PositiveOnlyExample() {
  const methods = useForm({
    defaultValues: {
      positiveAge: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFNumberInput
        name="positiveAge"
        positiveOnly
        maxFractionDigits={0}
        placeholder="Enter age (positive only)"
      />
    </FormProvider>
  );
}

export function NonStrictExample() {
  const methods = useForm({
    defaultValues: {
      nonStrictRoom: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFNumberInput
        name="nonStrictRoom"
        strict={false}
        maxFractionDigits={0}
        maxWholeDigitPlaces={5}
        placeholder="Room number (e.g., 00123)"
      />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    validationAmount: z
      .string()
      .min(1, "Amount is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be greater than 0"
      })
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      validationAmount: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Amount" required>
        <RHFNumberInput name="validationAmount" maxFractionDigits={2} placeholder="Enter amount" />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    formQuantity: z
      .string()
      .min(1, "Quantity is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Quantity must be at least 1"
      }),
    formPrice: z
      .string()
      .min(1, "Price is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be greater than 0"
      }),
    formDiscount: z.string().optional()
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      formQuantity: "",
      formPrice: "",
      formDiscount: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Quantity" required>
          <RHFNumberInput
            name="formQuantity"
            maxFractionDigits={0}
            positiveOnly
            placeholder="Enter quantity"
          />
        </RHFInputGroup>

        <RHFInputGroup label="Price" required>
          <RHFNumberInput
            name="formPrice"
            maxFractionDigits={2}
            positiveOnly
            placeholder="Enter price"
          />
        </RHFInputGroup>

        <RHFInputGroup label="Discount %">
          <RHFNumberInput
            name="formDiscount"
            maxFractionDigits={2}
            positiveOnly
            maxWholeDigitPlaces={3}
            placeholder="Enter discount"
          />
        </RHFInputGroup>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
