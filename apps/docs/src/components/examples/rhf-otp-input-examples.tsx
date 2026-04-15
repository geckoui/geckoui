"use client";

import { Button, RHFInputGroup, RHFOTPInput } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFOTPInputExample() {
  const methods = useForm({
    defaultValues: {
      basicOtp: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFOTPInput name="basicOtp" />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    validationCode: z
      .string()
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d+$/, "OTP must contain only numbers")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      validationCode: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Verification Code" required>
        <RHFOTPInput name="validationCode" />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function SixDigitExample() {
  const methods = useForm({
    defaultValues: {
      sixDigitPin: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFOTPInput name="sixDigitPin" length={6} />
    </FormProvider>
  );
}

export function FourDigitExample() {
  const methods = useForm({
    defaultValues: {
      fourDigitPin: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFOTPInput name="fourDigitPin" length={4} />
    </FormProvider>
  );
}

export function AlphanumericExample() {
  const schema = z.object({
    activationCode: z.string().length(8, "Activation code must be exactly 8 characters")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      activationCode: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Activation Code" required>
        <RHFOTPInput name="activationCode" length={8} numberOnly={false} />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function DisabledExample() {
  const methods = useForm({
    defaultValues: {
      disabledOtp: "123456"
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFOTPInput name="disabledOtp" disabled />
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    twoFactorCode: z
      .string()
      .length(6, "Code must be exactly 6 digits")
      .regex(/^\d+$/, "Code must contain only numbers")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      twoFactorCode: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Two-factor code submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Two-Factor Authentication Code" required>
          <RHFOTPInput
            name="twoFactorCode"
            onOTPComplete={(value) => {
              console.log("OTP completed:", value);
            }}
          />
        </RHFInputGroup>

        <Button type="submit">Verify Code</Button>
      </form>
    </FormProvider>
  );
}
