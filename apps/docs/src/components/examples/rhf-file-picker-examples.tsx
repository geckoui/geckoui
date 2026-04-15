"use client";

import { Button, RHFFilePicker, RHFInputGroup } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFFilePickerExample() {
  const methods = useForm({
    defaultValues: {
      basicFiles: []
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFilePicker name="basicFiles" />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    validationImages: z
      .array(z.custom<File>())
      .min(1, "At least one image is required")
      .max(10, "Maximum 10 images allowed")
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
      validationImages: []
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert(`${data.validationImages.length} images uploaded! Check console for data.`);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Product Images" required>
          <RHFFilePicker name="validationImages" accept="image/*" />
        </RHFInputGroup>
        <Button type="submit">Upload Images</Button>
      </form>
    </FormProvider>
  );
}

export function RemoveDuplicatesExample() {
  const methods = useForm({
    defaultValues: {
      uniqueDocuments: []
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFilePicker name="uniqueDocuments" removeDuplicates keepOldFiles />
    </FormProvider>
  );
}

export function KeepOldFilesExample() {
  const methods = useForm({
    defaultValues: {
      accumulatedFiles: []
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFilePicker name="accumulatedFiles" keepOldFiles />
    </FormProvider>
  );
}

export function CustomRenderExample() {
  const methods = useForm({
    defaultValues: {
      customImages: []
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFFilePicker
        name="customImages"
        removeDuplicates={false}
        accept="image/*"
        render={({
          dropzoneRef,
          dragging,
          loading,
          field: { value: files, onChange },
          openFilePicker
        }) => {
          const handleRemove = (preview: string) => {
            onChange(files.filter((f) => f.preview !== preview));
          };

          return (
            <div className="flex flex-col gap-3">
              <div
                ref={dropzoneRef}
                onClick={() => openFilePicker()}
                className={`relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${loading ? "cursor-wait" : ""} ${dragging ? "border-primary-400 bg-primary-50 dark:bg-primary-950" : "border-border-secondary hover:border-primary-300 hover:bg-surface-secondary"}`}>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                  </svg>
                  <span>{dragging ? "Drop images here" : "Click to upload or drag and drop"}</span>
                </div>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-surface-primary/50">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-400 border-t-transparent" />
                  </div>
                )}
              </div>

              {!!files?.length && (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                  {files.map((file) => (
                    <div key={file.preview} className="group relative aspect-square">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-full w-full rounded-lg border border-border-secondary object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemove(file.preview)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-opacity hover:bg-red-600 group-hover:opacity-100">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />
    </FormProvider>
  );
}

export function WithCallbacksExample() {
  const methods = useForm({
    defaultValues: {
      callbackFiles: []
    }
  });

  const handleChange = (files: any[], newFiles: any[]) => {
    console.log("All files:", files);
    console.log("New files:", newFiles);
    if (newFiles.length > 0) {
      alert(`${newFiles.length} new file(s) added. Total: ${files.length}`);
    }
  };

  const handleError = (error: Error) => {
    console.error("File picker error:", error);
    alert(`Error: ${error.message}`);
  };

  return (
    <FormProvider {...methods}>
      <RHFFilePicker name="callbackFiles" onChange={handleChange} onError={handleError} />
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    projectFiles: z
      .array(z.custom<File>())
      .min(1, "At least one file is required")
      .refine(
        (files) => files.every((file) => file.size <= 10000000),
        "Each file must be less than 10MB"
      ),
    screenshots: z
      .array(z.custom<File>())
      .min(3, "At least 3 screenshots are required")
      .max(10, "Maximum 10 screenshots allowed")
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
      projectFiles: [],
      screenshots: []
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert(
      `Project submitted with ${data.projectFiles.length} files and ${data.screenshots.length} screenshots!`
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Project Files" required>
          <RHFFilePicker name="projectFiles" removeDuplicates />
        </RHFInputGroup>

        <RHFInputGroup label="Screenshots" required>
          <RHFFilePicker name="screenshots" accept="image/*" removeDuplicates />
        </RHFInputGroup>

        <Button type="submit">Submit Project</Button>
      </form>
    </FormProvider>
  );
}
