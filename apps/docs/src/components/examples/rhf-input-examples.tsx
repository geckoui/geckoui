"use client";

import { Button, RHFInput, RHFInputGroup } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFInputExample() {
  const methods = useForm({
    defaultValues: {
      username: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInput name="username" placeholder="Enter username" />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Email Address" required>
        <RHFInput name="email" type="email" placeholder="Enter email and blur to see validation" />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function WithPrefixSuffixExample() {
  const methods = useForm({
    defaultValues: {
      amount: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInput name="amount" type="number" prefix="$" suffix="USD" placeholder="0.00" />
    </FormProvider>
  );
}

export function WithTransformExample() {
  const methods = useForm({
    defaultValues: {
      phone: ""
    }
  });

  const formatPhone = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const sanitizePhone = (value: string) => {
    return value.replace(/\D/g, "");
  };

  return (
    <FormProvider {...methods}>
      <RHFInput
        name="phone"
        placeholder="Phone number"
        transform={{
          input: formatPhone,
          output: sanitizePhone
        }}
      />
    </FormProvider>
  );
}

export function WithCustomSuffixExample() {
  const methods = useForm({
    defaultValues: {
      password: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInput
        name="password"
        type="password"
        placeholder="Enter password"
        suffix={({ fieldState }) => {
          return <>{fieldState.error ? <span className="text-red-500 text-xs">❌</span> : null}</>;
        }}
      />
    </FormProvider>
  );
}

export function DisabledExample() {
  const methods = useForm({
    defaultValues: {
      readonly: "Cannot edit this"
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInput name="readonly" disabled />
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Username" required>
          <RHFInput name="username" placeholder="Enter username" />
        </RHFInputGroup>

        <RHFInputGroup label="Email Address" required>
          <RHFInput name="email" type="email" placeholder="Enter email" />
        </RHFInputGroup>

        <RHFInputGroup label="Password" required>
          <RHFInput name="password" type="password" placeholder="Enter password" />
        </RHFInputGroup>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
