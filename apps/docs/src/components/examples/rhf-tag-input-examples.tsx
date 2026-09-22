"use client";

import { Button, Label, RHFError, RHFTagInput, TagInputOption } from "@geckoui/geckoui";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export function BasicRHFTagInputExample() {
  const methods = useForm<{ tags: string[] }>({ defaultValues: { tags: ["React"] } });
  const tags = methods.watch("tags");

  return (
    <FormProvider {...methods}>
      <div className="max-w-md space-y-2">
        <Label>Tags</Label>
        <RHFTagInput name="tags" placeholder="Add a tag">
          <TagInputOption value="React">React</TagInputOption>
          <TagInputOption value="Vue">Vue</TagInputOption>
          <TagInputOption value="Svelte">Svelte</TagInputOption>
        </RHFTagInput>
        <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
          The form holds <code>{JSON.stringify(tags)}</code>
        </p>
      </div>
    </FormProvider>
  );
}

export function RHFTagInputRulesExample() {
  const methods = useForm<{ emails: string[] }>({ defaultValues: { emails: [] } });
  const [rejected, setRejected] = useState<string[]>([]);

  return (
    <FormProvider {...methods}>
      <form
        className="max-w-md space-y-3"
        onSubmit={methods.handleSubmit(() => undefined)}
        noValidate>
        <Label>Invite by email</Label>
        <RHFTagInput
          name="emails"
          placeholder="name@example.com"
          validate={(tag) => tag.includes("@")}
          onReject={(tags) => setRejected(tags)}
          rules={{ validate: (emails) => emails.length <= 3 || "Three at most" }}
        />
        <RHFError name="emails" />

        {!!rejected.length && (
          <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
            <code>validate</code> turned away {rejected.join(", ")}
          </p>
        )}

        <Button type="submit" size="sm">
          Invite
        </Button>
      </form>
    </FormProvider>
  );
}

export function RHFTagInputRequiredExample() {
  const methods = useForm<{ tags: string[] }>({ defaultValues: { tags: [] } });

  return (
    <FormProvider {...methods}>
      <form
        className="max-w-md space-y-3"
        onSubmit={methods.handleSubmit(() => undefined)}
        noValidate>
        <Label>Tags</Label>
        <RHFTagInput
          name="tags"
          placeholder="Add a tag"
          rules={{ required: "Add at least one tag" }}
        />
        <RHFError name="tags" />

        <Button type="submit" size="sm">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
