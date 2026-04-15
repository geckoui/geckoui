"use client";

import { Button, RHFCheckbox, RHFInputGroup } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function SingleCheckboxExample() {
  const methods = useForm({
    defaultValues: {
      agreement: null
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFCheckbox
        name="agreement"
        value="agreed"
        label="I agree to the terms and conditions"
        single
      />
    </FormProvider>
  );
}

export function SingleWithUncheckedValueExample() {
  const methods = useForm({
    defaultValues: {
      enabled: "no"
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFCheckbox
        name="enabled"
        value="yes"
        uncheckedValue="no"
        label="Enable notifications"
        single
      />
    </FormProvider>
  );
}

export function MultiSelectExample() {
  const methods = useForm({
    defaultValues: {
      options: []
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-3">
        <RHFCheckbox name="options" value="option1" label="Option 1" />
        <RHFCheckbox name="options" value="option2" label="Option 2" />
        <RHFCheckbox name="options" value="option3" label="Option 3" />
      </div>
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    terms: z.literal("agreed", { message: "You must agree to the terms" })
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      terms: undefined
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup required>
        <RHFCheckbox
          name="terms"
          value="agreed"
          label="I agree to the terms and conditions"
          single
        />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function WithPartialStateExample() {
  const methods = useForm({
    defaultValues: {
      languages: []
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-3">
        <RHFCheckbox
          name="languages"
          value="js"
          partial={({ field }) => {
            const selected = (field.value as string[]) || [];
            return selected.length > 0 && selected.length < 2;
          }}
          label="JavaScript"
        />
        <RHFCheckbox
          name="languages"
          value="ts"
          partial={({ field }) => {
            const selected = (field.value as string[]) || [];
            return selected.length > 0 && selected.length < 2;
          }}
          label="TypeScript"
        />
      </div>
    </FormProvider>
  );
}

export function WithObjectValuesExample() {
  const methods = useForm({
    defaultValues: {
      settings: null
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFCheckbox
        name="settings"
        value={{ feature: "advanced", enabled: true }}
        label="Enable advanced features"
        single
      />
    </FormProvider>
  );
}

export function DisabledExample() {
  const methods = useForm({
    defaultValues: {
      readonly: ["checked"]
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="flex gap-4">
        <RHFCheckbox name="readonly" value="checked" label="Checked & Disabled" disabled />
        <RHFCheckbox name="disabled" value="unchecked" label="Unchecked & Disabled" disabled />
      </div>
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    terms: z.literal("agreed", { message: "You must agree to the terms" }),
    newsletter: z.string().nullable().optional(),
    interests: z.array(z.string()).min(1, "Select at least one interest")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      terms: undefined,
      newsletter: null,
      interests: []
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup required>
          <RHFCheckbox
            name="terms"
            value="agreed"
            label="I agree to the terms and conditions"
            single
          />
        </RHFInputGroup>

        <RHFInputGroup>
          <RHFCheckbox
            name="newsletter"
            value="subscribed"
            label="Subscribe to newsletter"
            single
          />
        </RHFInputGroup>

        <RHFInputGroup label="Interests" required>
          <div className="flex flex-col gap-2">
            <RHFCheckbox name="interests" value="tech" label="Technology" />
            <RHFCheckbox name="interests" value="design" label="Design" />
            <RHFCheckbox name="interests" value="business" label="Business" />
          </div>
        </RHFInputGroup>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
