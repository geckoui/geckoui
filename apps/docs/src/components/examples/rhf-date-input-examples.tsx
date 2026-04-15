"use client";

import { Button, RHFDateInput, RHFInput, RHFInputGroup } from "@geckoui/geckoui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function BasicRHFDateInputExample() {
  const methods = useForm({
    defaultValues: {
      basicBirthday: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFDateInput name="basicBirthday" placeholder="MM/DD/YYYY" format="MM/DD/YYYY" />
    </FormProvider>
  );
}

export function WithValidationExample() {
  const schema = z.object({
    validationStartDate: z.string().min(1, "Start date is required")
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      validationStartDate: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Start Date" required>
        <RHFDateInput name="validationStartDate" placeholder="MM/DD/YYYY" format="MM/DD/YYYY" />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function WithPrefixSuffixExample() {
  const methods = useForm({
    defaultValues: {
      prefixEventDate: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFDateInput
        name="prefixEventDate"
        placeholder="MM/DD/YYYY"
        format="MM/DD/YYYY"
        hideCalendarIcon
        prefix={<span className="text-gray-400">📅</span>}
        suffix={<span className="text-gray-400 text-xs">Event Date</span>}
      />
    </FormProvider>
  );
}

export function WithDateRangeValidationExample() {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 100);
  const maxDate = new Date(today);

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const schema = z.object({
    rangeValidationBirthDate: z
      .string()
      .min(1, "Birth date is required")
      .refine(
        (dateStr) => {
          const [month, day, year] = dateStr.split("/").map(Number);
          const date = new Date(year, month - 1, day);
          return date >= minDate && date <= maxDate;
        },
        `Date must be between ${formatDate(minDate)} and ${formatDate(maxDate)}`
      )
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      rangeValidationBirthDate: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFInputGroup label="Birth Date" required>
        <RHFDateInput
          name="rangeValidationBirthDate"
          placeholder="MM/DD/YYYY"
          format="MM/DD/YYYY"
        />
      </RHFInputGroup>
    </FormProvider>
  );
}

export function DisabledExample() {
  const methods = useForm({
    defaultValues: {
      disabledFixedDate: "12/25/2024"
    }
  });

  return (
    <FormProvider {...methods}>
      <RHFDateInput name="disabledFixedDate" disabled format="MM/DD/YYYY" />
    </FormProvider>
  );
}

export function WithCustomCallbackExample() {
  const methods = useForm({
    defaultValues: {
      callbackAppointmentDate: ""
    }
  });

  const handleDateChange = (value: string | null) => {
    console.log("Date changed:", value);
  };

  return (
    <FormProvider {...methods}>
      <RHFDateInput
        name="callbackAppointmentDate"
        placeholder="MM/DD/YYYY"
        format="MM/DD/YYYY"
        onChange={handleDateChange}
      />
    </FormProvider>
  );
}

export function CompleteFormExample() {
  const schema = z
    .object({
      formCheckInDate: z.string().min(1, "Check-in date is required"),
      formCheckOutDate: z.string().min(1, "Check-out date is required"),
      formGuestName: z.string().min(2, "Guest name is required")
    })
    .refine(
      (data) => {
        if (!data.formCheckInDate || !data.formCheckOutDate) return true;
        const [inMonth, inDay, inYear] = data.formCheckInDate.split("/").map(Number);
        const [outMonth, outDay, outYear] = data.formCheckOutDate.split("/").map(Number);
        const checkIn = new Date(inYear, inMonth - 1, inDay);
        const checkOut = new Date(outYear, outMonth - 1, outDay);
        return checkOut > checkIn;
      },
      {
        message: "Check-out date must be after check-in date",
        path: ["formCheckOutDate"]
      }
    );

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      formCheckInDate: "",
      formCheckOutDate: "",
      formGuestName: ""
    }
  });

  const onSubmit = (data: any) => {
    console.log("Booking data:", data);
    alert("Booking submitted! Check console for data.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <RHFInputGroup label="Guest Name" required>
          <RHFInput name="formGuestName" placeholder="Enter your name" />
        </RHFInputGroup>

        <RHFInputGroup label="Check-in Date" required>
          <RHFDateInput name="formCheckInDate" placeholder="MM/DD/YYYY" format="MM/DD/YYYY" />
        </RHFInputGroup>

        <RHFInputGroup label="Check-out Date" required>
          <RHFDateInput name="formCheckOutDate" placeholder="MM/DD/YYYY" format="MM/DD/YYYY" />
        </RHFInputGroup>

        <Button type="submit">Book Now</Button>
      </form>
    </FormProvider>
  );
}
