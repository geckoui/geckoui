"use client";

import { Button, RHFFileInput, RHFInputGroup } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFFileInputExample() {
  const methods = useForm({
    defaultValues: {
      basicFile: undefined
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFileInput name="basicFile" />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    validationAvatar: z
      .instanceof(File, { message: "Please select a file" })
      .refine((file) => file.size <= 5000000, "File size must be less than 5MB")
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Only JPEG, PNG, and WebP images are allowed"
      )
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      validationAvatar: undefined
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("File uploaded successfully! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Profile Picture" required>
          <RHFFileInput name="validationAvatar" accept="image/*" />
        </RHFInputGroup>
        <Button type="submit">Upload</Button>
      </form>
    </FormProvider>
  );
}

export function MultipleFilesExample() {
  const methods = useForm({
    defaultValues: {
      multipleImages: undefined
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFileInput name="multipleImages" multiple accept="image/*" />
    </FormProvider>
  );
}

export function AcceptTypesExample() {
  const methods = useForm({
    defaultValues: {
      pdfDocument: undefined
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFileInput name="pdfDocument" accept=".pdf" />
    </FormProvider>
  );
}

export function CustomRenderExample() {
  const methods = useForm({
    defaultValues: {
      customAvatar: undefined
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFileInput
        name="customAvatar"
        accept="image/*"
        render={({ field: { value } }) => {
          return (
            <div className="flex rounded overflow-hidden items-center justify-center cursor-pointer border-2 p-4 w-full border-dotted border-gray-300 h-[200px]">
              {value ? (
                <img
                  className="inline-block object-contain w-full h-full"
                  src={value.preview}
                  alt="Preview"
                />
              ) : (
                <span>Click to Upload Image</span>
              )}
            </div>
          );
        }}
      />
    </FormProvider>
  );
}

export function WithCallbackExample() {
  const methods = useForm({
    defaultValues: {
      callbackFile: undefined
    }
  });

  const handleFileChange = (data: any) => {
    console.log("File selected:", data);
    if (data) {
      alert(`File selected: ${data.name} (${(data.size / 1024).toFixed(2)} KB)`);
    }
  };

  return (
    <FormProvider {...methods}>
      <RHFFileInput name="callbackFile" onChange={handleFileChange} />
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    resume: z
      .instanceof(File, { message: "Resume is required" })
      .refine((file) => file.size <= 10000000, "File size must be less than 10MB")
      .refine(
        (file) =>
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ].includes(file.type),
        "Only PDF and Word documents are allowed"
      ),
    portfolio: z
      .array(z.instanceof(File))
      .min(1, "At least one portfolio item is required")
      .max(5, "Maximum 5 files allowed")
      .refine(
        (files) => files.every((file) => file.size <= 5000000),
        "Each file must be less than 5MB"
      )
      .refine(
        (files) =>
          files.every((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type)),
        "Only JPEG, PNG, and WebP images are allowed"
      )
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      resume: undefined,
      portfolio: undefined
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Application submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Resume" required>
          <RHFFileInput name="resume" accept=".pdf,.doc,.docx" />
        </RHFInputGroup>

        <RHFInputGroup label="Portfolio Images" required>
          <RHFFileInput name="portfolio" multiple accept="image/*" />
        </RHFInputGroup>

        <Button type="submit">Submit Application</Button>
      </form>
    </FormProvider>
  );
}
