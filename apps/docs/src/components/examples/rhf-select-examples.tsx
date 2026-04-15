"use client";

import { Button, RHFInputGroup, RHFSelect, SelectOption } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFSelectExample() {
  const methods = useForm({
    defaultValues: {
      basicCountry: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFSelect name="basicCountry" placeholder="Select a country">
        <SelectOption value="us" label="United States" />
        <SelectOption value="uk" label="United Kingdom" />
        <SelectOption value="ca" label="Canada" />
        <SelectOption value="au" label="Australia" />
        <SelectOption value="de" label="Germany" />
      </RHFSelect>
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    validationSkills: z.string().min(1, "Please select at least one skill")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      validationSkills: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Primary Skill" required>
        <RHFSelect
          name="validationSkills"
          placeholder="Select your skill and blur to see validation">
          <SelectOption value="js" label="JavaScript" />
          <SelectOption value="ts" label="TypeScript" />
          <SelectOption value="react" label="React" />
          <SelectOption value="vue" label="Vue" />
          <SelectOption value="angular" label="Angular" />
        </RHFSelect>
      </RHFInputGroup>
    </FormProvider>
  );
}

export function MultipleSelectExample() {
  const methods = useForm({
    defaultValues: {
      multipleLanguages: []
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFSelect name="multipleLanguages" multiple placeholder="Select languages">
        <SelectOption value="en" label="English" />
        <SelectOption value="es" label="Spanish" />
        <SelectOption value="fr" label="French" />
        <SelectOption value="de" label="German" />
        <SelectOption value="zh" label="Chinese" />
        <SelectOption value="ja" label="Japanese" />
      </RHFSelect>
    </FormProvider>
  );
}

export function WithGroupsExample() {
  const methods = useForm({
    defaultValues: {
      groupedCategory: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFSelect name="groupedCategory" placeholder="Select a category">
        <SelectOption value="electronics" label="Electronics" />
        <SelectOption value="computers" label="Computers" />
        <SelectOption value="phones" label="Phones" />
        <SelectOption value="clothing" label="Clothing" />
        <SelectOption value="shoes" label="Shoes" />
        <SelectOption value="accessories" label="Accessories" />
      </RHFSelect>
    </FormProvider>
  );
}

export function DisabledExample() {
  const methods = useForm({
    defaultValues: {
      disabledStatus: "active"
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFSelect name="disabledStatus" disabled placeholder="Status">
        <SelectOption value="active" label="Active" />
        <SelectOption value="inactive" label="Inactive" />
        <SelectOption value="pending" label="Pending" />
      </RHFSelect>
    </FormProvider>
  );
}

export function WithOnChangeExample() {
  const methods = useForm({
    defaultValues: {
      callbackPriority: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFSelect
        name="callbackPriority"
        placeholder="Select priority"
        onChange={(value) => {
          console.log("Selected priority:", value);
        }}>
        <SelectOption value="low" label="Low" />
        <SelectOption value="medium" label="Medium" />
        <SelectOption value="high" label="High" />
        <SelectOption value="urgent" label="Urgent" />
      </RHFSelect>
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z.object({
    formCountry: z.string().min(1, "Country is required"),
    formLanguages: z.array(z.string()).min(1, "Select at least one language"),
    formPriority: z.string().min(1, "Priority is required")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      formCountry: "",
      formLanguages: [],
      formPriority: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Country" required>
          <RHFSelect name="formCountry" placeholder="Select your country">
            <SelectOption value="us" label="United States" />
            <SelectOption value="uk" label="United Kingdom" />
            <SelectOption value="ca" label="Canada" />
            <SelectOption value="au" label="Australia" />
            <SelectOption value="de" label="Germany" />
          </RHFSelect>
        </RHFInputGroup>

        <RHFInputGroup label="Languages" required>
          <RHFSelect name="formLanguages" multiple placeholder="Select languages you speak">
            <SelectOption value="en" label="English" />
            <SelectOption value="es" label="Spanish" />
            <SelectOption value="fr" label="French" />
            <SelectOption value="de" label="German" />
            <SelectOption value="zh" label="Chinese" />
          </RHFSelect>
        </RHFInputGroup>

        <RHFInputGroup label="Priority" required>
          <RHFSelect name="formPriority" placeholder="Select priority level">
            <SelectOption value="low" label="Low" />
            <SelectOption value="medium" label="Medium" />
            <SelectOption value="high" label="High" />
            <SelectOption value="urgent" label="Urgent" />
          </RHFSelect>
        </RHFInputGroup>

        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
