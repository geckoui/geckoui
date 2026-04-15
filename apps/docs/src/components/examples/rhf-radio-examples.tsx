"use client";

import { Button, RHFInputGroup, RHFRadio } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFRadioExample() {
  const methods = useForm({
    defaultValues: {
      basicPlan: "free"
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-3">
        <RHFRadio name="basicPlan" value="free" label="Free Plan" />
        <RHFRadio name="basicPlan" value="pro" label="Pro Plan" />
        <RHFRadio name="basicPlan" value="enterprise" label="Enterprise Plan" />
      </div>
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    validationPlan: z.enum(["free", "pro", "enterprise"]).refine((val) => val !== undefined, {
      message: "Please select a plan"
    })
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      validationPlan: undefined as any
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Choose a plan" required>
        <div className="flex flex-col gap-2">
          <RHFRadio name="validationPlan" value="free" label="Free Plan" />
          <RHFRadio name="validationPlan" value="pro" label="Pro Plan" />
          <RHFRadio name="validationPlan" value="enterprise" label="Enterprise Plan" />
        </div>
      </RHFInputGroup>
    </FormProvider>
  );
}

export function WithStringValuesExample() {
  const methods = useForm({
    defaultValues: {
      size: "M"
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex gap-4">
        <RHFRadio name="size" value="XS" label="XS" />
        <RHFRadio name="size" value="S" label="S" />
        <RHFRadio name="size" value="M" label="M" />
        <RHFRadio name="size" value="L" label="L" />
        <RHFRadio name="size" value="XL" label="XL" />
      </div>
    </FormProvider>
  );
}

export function WithBooleanValuesExample() {
  const methods = useForm({
    defaultValues: {
      enabled: true
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-3">
        <RHFRadio name="enabled" value={true} label="Enabled" />
        <RHFRadio name="enabled" value={false} label="Disabled" />
      </div>
    </FormProvider>
  );
}

export function WithObjectValuesExample() {
  const methods = useForm({
    defaultValues: {
      objectPlan: { name: "free", price: 0 }
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-3">
        <RHFRadio name="objectPlan" value={{ name: "free", price: 0 }} label="Free - $0/month" />
        <RHFRadio name="objectPlan" value={{ name: "pro", price: 9 }} label="Pro - $9/month" />
        <RHFRadio
          name="objectPlan"
          value={{ name: "enterprise", price: 29 }}
          label="Enterprise - $29/month"
        />
      </div>
    </FormProvider>
  );
}

export function WithArrayValuesExample() {
  const methods = useForm({
    defaultValues: {
      arrayPermissions: ["read"]
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-3">
        <RHFRadio name="arrayPermissions" value={["read"]} label="Read Only" />
        <RHFRadio name="arrayPermissions" value={["read", "write"]} label="Read & Write" />
        <RHFRadio name="arrayPermissions" value={["read", "write", "admin"]} label="Full Access" />
      </div>
    </FormProvider>
  );
}

export function DisabledExample() {
  const methods = useForm({
    defaultValues: {
      status: "active"
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-3">
        <RHFRadio name="status" value="active" label="Active" />
        <RHFRadio name="status" value="inactive" label="Inactive (Disabled)" disabled />
      </div>
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    plan: z.enum(["free", "pro", "enterprise"]).refine((val) => val !== undefined, {
      message: "Please select a plan"
    }),
    paymentMethod: z.enum(["card", "paypal", "bank"]).refine((val) => val !== undefined, {
      message: "Please select a payment method"
    }),
    billingCycle: z.enum(["monthly", "yearly"])
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      plan: undefined as any,
      paymentMethod: undefined as any,
      billingCycle: "monthly" as any
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Choose a plan" required>
          <div className="flex flex-col gap-2">
            <RHFRadio name="plan" value="free" label="Free Plan" />
            <RHFRadio name="plan" value="pro" label="Pro Plan - $9/month" />
            <RHFRadio name="plan" value="enterprise" label="Enterprise Plan - $29/month" />
          </div>
        </RHFInputGroup>

        <RHFInputGroup label="Payment Method" required>
          <div className="flex flex-col gap-2">
            <RHFRadio name="paymentMethod" value="card" label="Credit Card" />
            <RHFRadio name="paymentMethod" value="paypal" label="PayPal" />
            <RHFRadio name="paymentMethod" value="bank" label="Bank Transfer" />
          </div>
        </RHFInputGroup>

        <RHFInputGroup label="Billing Cycle" required>
          <div className="flex gap-4">
            <RHFRadio name="billingCycle" value="monthly" label="Monthly" />
            <RHFRadio name="billingCycle" value="yearly" label="Yearly (Save 20%)" />
          </div>
        </RHFInputGroup>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
