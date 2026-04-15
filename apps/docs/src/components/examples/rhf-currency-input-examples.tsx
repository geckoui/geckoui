"use client";

import { Button, RHFCurrencyInput, RHFInputGroup } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFCurrencyInputExample() {
  const methods = useForm({
    defaultValues: {
      basicPrice: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFCurrencyInput
        name="basicPrice"
        currency={{ symbol: "$", code: "USD" }}
        placeholder="0.00"
      />
    </FormProvider>
  );
}

export function WithSymbolOnlyExample() {
  const methods = useForm({
    defaultValues: {
      symbolAmount: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFCurrencyInput
        name="symbolAmount"
        currency={{ symbol: "€", code: "" }}
        placeholder="0.00"
      />
    </FormProvider>
  );
}

export function WithCodeOnlyExample() {
  const methods = useForm({
    defaultValues: {
      codeAmount: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFCurrencyInput
        name="codeAmount"
        currency={{ symbol: "", code: "JPY" }}
        maxFractionDigits={0}
        placeholder="0"
      />
    </FormProvider>
  );
}

export function DifferentCurrenciesExample() {
  const methods = useForm({
    defaultValues: {
      usdAmount: "",
      eurAmount: "",
      gbpAmount: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">USD</label>
          <RHFCurrencyInput
            name="usdAmount"
            currency={{ symbol: "$", code: "USD" }}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">EUR</label>
          <RHFCurrencyInput
            name="eurAmount"
            currency={{ symbol: "€", code: "EUR" }}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">GBP</label>
          <RHFCurrencyInput
            name="gbpAmount"
            currency={{ symbol: "£", code: "GBP" }}
            placeholder="0.00"
          />
        </div>
      </div>
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    validationCost: z
      .string()
      .min(1, "Cost is required")
      .refine((val) => !isNaN(Number(val.replace(/,/g, ""))) && Number(val.replace(/,/g, "")) > 0, {
        message: "Cost must be greater than 0"
      })
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      validationCost: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Product Cost" required>
        <RHFCurrencyInput
          name="validationCost"
          currency={{ symbol: "$", code: "USD" }}
          placeholder="0.00"
        />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    formBasePrice: z
      .string()
      .min(1, "Base price is required")
      .refine((val) => !isNaN(Number(val.replace(/,/g, ""))) && Number(val.replace(/,/g, "")) > 0, {
        message: "Price must be greater than 0"
      }),
    formTax: z
      .string()
      .min(1, "Tax is required")
      .refine(
        (val) => !isNaN(Number(val.replace(/,/g, ""))) && Number(val.replace(/,/g, "")) >= 0,
        {
          message: "Tax must be 0 or greater"
        }
      ),
    formShipping: z.string().optional()
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      formBasePrice: "",
      formTax: "",
      formShipping: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Base Price" required>
          <RHFCurrencyInput
            name="formBasePrice"
            currency={{ symbol: "$", code: "USD" }}
            placeholder="0.00"
          />
        </RHFInputGroup>

        <RHFInputGroup label="Tax" required>
          <RHFCurrencyInput
            name="formTax"
            currency={{ symbol: "$", code: "USD" }}
            placeholder="0.00"
          />
        </RHFInputGroup>

        <RHFInputGroup label="Shipping">
          <RHFCurrencyInput
            name="formShipping"
            currency={{ symbol: "$", code: "USD" }}
            placeholder="0.00"
          />
        </RHFInputGroup>

        <Button type="submit">Calculate Total</Button>
      </form>
    </FormProvider>
  );
}
