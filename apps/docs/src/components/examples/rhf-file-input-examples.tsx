"use client";

import { Button, Label, type PickedFile, RHFError, RHFFileInput } from "@geckoui/geckoui";
import { FormProvider, useForm } from "react-hook-form";

export function BasicRHFFileInputExample() {
  const methods = useForm<{ cv: PickedFile | null }>({ defaultValues: { cv: null } });
  const cv = methods.watch("cv");

  return (
    <FormProvider {...methods}>
      <div className="max-w-sm space-y-2">
        <Label>Your CV</Label>
        <RHFFileInput name="cv" accept=".pdf,.docx" />
        <p className="font-mono text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          {cv ? cv.name : "nothing picked"}
        </p>
      </div>
    </FormProvider>
  );
}

export function RHFFileInputRequiredExample() {
  const methods = useForm<{ avatar: PickedFile | null }>({ defaultValues: { avatar: null } });

  return (
    <FormProvider {...methods}>
      <form
        className="max-w-sm space-y-3"
        noValidate
        onSubmit={methods.handleSubmit(() => undefined)}>
        <Label required>Avatar</Label>
        <RHFFileInput name="avatar" accept="image/*" rules={{ required: "Pick a file" }} />
        <RHFError name="avatar" />

        <Button size="sm" type="submit">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

export function RHFFileInputMultipleExample() {
  const methods = useForm<{ docs: PickedFile[] }>({ defaultValues: { docs: [] } });
  const docs = methods.watch("docs");

  return (
    <FormProvider {...methods}>
      <form
        className="max-w-sm space-y-3"
        noValidate
        onSubmit={methods.handleSubmit(() => undefined)}>
        <Label>Documents</Label>
        <RHFFileInput
          name="docs"
          multiple
          append
          unique
          max={3}
          rules={{ validate: (files) => files.length > 0 || "Add at least one" }}
        />
        <RHFError name="docs" />

        <p className="font-mono text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          {docs.length ? docs.map((file) => file.name).join(", ") : "nothing picked"}
        </p>

        <Button size="sm" type="submit">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
