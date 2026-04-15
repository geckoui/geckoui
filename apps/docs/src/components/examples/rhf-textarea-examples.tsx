"use client";

import { Button, RHFInputGroup, RHFTextarea } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFTextareaExample() {
  const methods = useForm({
    defaultValues: {
      description: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFTextarea name="description" placeholder="Enter description" />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    bio: z
      .string()
      .min(10, "Bio must be at least 10 characters")
      .max(500, "Bio must not exceed 500 characters")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      bio: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Bio" required>
        <RHFTextarea name="bio" placeholder="Tell us about yourself (min 10 chars)" />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function AutoResizeExample() {
  const methods = useForm({
    defaultValues: {
      comments: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFTextarea
        name="comments"
        autoResize
        rows={3}
        maxRows={10}
        placeholder="This textarea grows as you type (max 10 rows)"
      />
    </FormProvider>
  );
}

export function WithRowConstraintsExample() {
  const methods = useForm({
    defaultValues: {
      notes: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFTextarea name="notes" rows={5} placeholder="Fixed at 5 rows" />
    </FormProvider>
  );
}

export function DisabledExample() {
  const methods = useForm({
    defaultValues: {
      readonly: "This content cannot be edited"
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFTextarea name="readonly" disabled />
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    notes: z.string().optional()
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      notes: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Title" required>
          <RHFTextarea name="title" rows={1} placeholder="Enter title" />
        </RHFInputGroup>

        <RHFInputGroup label="Description" required>
          <RHFTextarea
            name="description"
            autoResize
            rows={3}
            maxRows={8}
            placeholder="Enter description (min 20 chars)"
          />
        </RHFInputGroup>

        <RHFInputGroup label="Additional Notes">
          <RHFTextarea name="notes" rows={2} placeholder="Optional notes" />
        </RHFInputGroup>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
