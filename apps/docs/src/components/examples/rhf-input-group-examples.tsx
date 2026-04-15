"use client";

import { Button, RHFInput, RHFInputGroup, RHFTextarea } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFInputGroupExample() {
  const methods = useForm({
    defaultValues: {
      basicUsername: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Username">
        <RHFInput name="basicUsername" placeholder="Enter username" />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function WithRequiredExample() {
  const schema = z.object({
    groupEmail: z.string().email("Invalid email address").min(1, "Email is required")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      groupEmail: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Email Address" required>
        <RHFInput
          name="groupEmail"
          type="email"
          placeholder="Enter email and blur to see validation"
        />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function WithHelpTextExample() {
  const methods = useForm({
    defaultValues: {
      tooltipPassword: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup
        label="Password"
        required
        tooltip="Must be at least 8 characters with numbers and special characters">
        <RHFInput name="tooltipPassword" type="password" placeholder="Enter password" />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function WithTextareaExample() {
  const schema = z.object({
    groupBio: z
      .string()
      .min(10, "Bio must be at least 10 characters")
      .max(200, "Bio must be less than 200 characters")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      groupBio: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Bio" required tooltip="Tell us about yourself">
        <RHFTextarea name="groupBio" placeholder="Write your bio here..." rows={4} />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function WithNestedStructureExample() {
  const schema = z.object({
    nestedPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[!@#$%^&*]/, "Password must contain at least one special character")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      nestedPassword: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Password" required tooltip="Must meet all requirements below">
        <div className="space-y-2">
          <RHFInput name="nestedPassword" type="password" placeholder="Enter password" />
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ At least 8 characters</li>
            <li>✓ Include a number</li>
            <li>✓ Include a special character</li>
          </ul>
        </div>
      </RHFInputGroup>
    </FormProvider>
  );
}

export function WithCustomStylingExample() {
  const methods = useForm({
    defaultValues: {
      styledInput: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup
        label="Custom Styled Input"
        labelClassName="text-blue-600 font-semibold"
        className="bg-blue-50 p-4 rounded-lg"
        errorClassName="text-blue-800 font-bold">
        <RHFInput name="styledInput" placeholder="This has custom styling" />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function CompleteFormGroupExample() {
  const schema = z.object({
    formUsername: z.string().min(3, "Username must be at least 3 characters"),
    formEmail: z.string().email("Invalid email address"),
    formBio: z.string().min(10, "Bio must be at least 10 characters"),
    formPassword: z.string().min(8, "Password must be at least 8 characters")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      formUsername: "",
      formEmail: "",
      formBio: "",
      formPassword: ""
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
          <RHFInput name="formUsername" placeholder="Enter username" />
        </RHFInputGroup>

        <RHFInputGroup label="Email Address" required>
          <RHFInput name="formEmail" type="email" placeholder="Enter email" />
        </RHFInputGroup>

        <RHFInputGroup label="Bio" required tooltip="Tell us about yourself">
          <RHFTextarea name="formBio" placeholder="Write your bio..." rows={3} />
        </RHFInputGroup>

        <RHFInputGroup label="Password" required tooltip="Minimum 8 characters">
          <RHFInput name="formPassword" type="password" placeholder="Enter password" />
        </RHFInputGroup>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
