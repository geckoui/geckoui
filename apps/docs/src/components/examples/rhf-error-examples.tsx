"use client";

import { Button, RHFError, RHFInput } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFErrorExample() {
  const schema = z.object({
    errorUsername: z.string().min(3, "Username must be at least 3 characters")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      errorUsername: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="space-y-2">
        <RHFInput name="errorUsername" placeholder="Enter username and blur to see error" />
        <RHFError name="errorUsername" />
      </div>
    </FormProvider>
  );
}

export function WithCustomStylingExample() {
  const schema = z.object({
    styledEmail: z.string().email("Invalid email address")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      styledEmail: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="space-y-2">
        <RHFInput name="styledEmail" placeholder="Enter email" />
        <RHFError name="styledEmail" className="font-bold text-red-700 text-lg" />
      </div>
    </FormProvider>
  );
}

export function WithCustomRenderExample() {
  const schema = z.object({
    renderPassword: z.string().min(8, "Password must be at least 8 characters")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      renderPassword: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="space-y-2">
        <RHFInput name="renderPassword" type="password" placeholder="Enter password" />
        <RHFError
          name="renderPassword"
          render={({ error }) => {
            if (!error) return <></>;

            return (
              <div className="flex items-center space-x-2 bg-red-50 p-2 rounded">
                <span className="text-red-500 text-xl">⚠️</span>
                <span className="text-sm font-medium text-red-600">{error?.message}</span>
              </div>
            );
          }}
        />
      </div>
    </FormProvider>
  );
}

export function MultipleFieldsExample() {
  const schema = z.object({
    multiUsername: z.string().min(3, "Username must be at least 3 characters"),
    multiEmail: z.string().email("Invalid email address"),
    multiPassword: z.string().min(8, "Password must be at least 8 characters")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      multiUsername: "",
      multiEmail: "",
      multiPassword: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Username</label>
          <RHFInput name="multiUsername" placeholder="Enter username" />
          <RHFError name="multiUsername" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <RHFInput name="multiEmail" type="email" placeholder="Enter email" />
          <RHFError name="multiEmail" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <RHFInput name="multiPassword" type="password" placeholder="Enter password" />
          <RHFError name="multiPassword" />
        </div>
      </div>
    </FormProvider>
  );
}

export function WithIconExample() {
  const schema = z.object({
    iconEmail: z.string().email("Please enter a valid email address")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      iconEmail: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="space-y-2">
        <RHFInput name="iconEmail" placeholder="Enter email" />
        <RHFError
          name="iconEmail"
          render={({ error }) => {
            if (!error) return <></>;

            return (
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-red-600">{error?.message}</span>
              </div>
            );
          }}
        />
      </div>
    </FormProvider>
  );
}

export function WithControlPropExample() {
  const schema = z.object({
    controlField: z.string().min(5, "Must be at least 5 characters")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      controlField: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="space-y-2">
        <RHFInput name="controlField" placeholder="Enter text" />
        <RHFError name="controlField" control={methods.control} />
      </div>
    </FormProvider>
  );
}

export function CompleteFormErrorExample() {
  const schema = z
    .object({
      formErrorUsername: z.string().min(3, "Username must be at least 3 characters"),
      formErrorEmail: z.string().email("Invalid email address"),
      formErrorPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[0-9]/, "Password must contain at least one number"),
      formErrorConfirm: z.string()
    })
    .refine((data) => data.formErrorPassword === data.formErrorConfirm, {
      message: "Passwords don't match",
      path: ["formErrorConfirm"]
    });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      formErrorUsername: "",
      formErrorEmail: "",
      formErrorPassword: "",
      formErrorConfirm: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Username *</label>
          <RHFInput name="formErrorUsername" placeholder="Enter username" />
          <RHFError name="formErrorUsername" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email *</label>
          <RHFInput name="formErrorEmail" type="email" placeholder="Enter email" />
          <RHFError name="formErrorEmail" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password *</label>
          <RHFInput name="formErrorPassword" type="password" placeholder="Enter password" />
          <RHFError name="formErrorPassword" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Confirm Password *</label>
          <RHFInput name="formErrorConfirm" type="password" placeholder="Confirm password" />
          <RHFError name="formErrorConfirm" />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
