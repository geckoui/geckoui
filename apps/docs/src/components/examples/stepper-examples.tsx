"use client";

import { Button, Step, Stepper } from "@geckoui/geckoui";
import { useState } from "react";

const CHECKOUT = [
  { value: "cart", label: "Cart", description: "3 items" },
  { value: "delivery", label: "Delivery", description: "Where it goes" },
  { value: "payment", label: "Payment", description: "Card or bank" },
  { value: "done", label: "Confirm" }
];

export function StepperBasicExample() {
  const [step, setStep] = useState("payment");
  const at = CHECKOUT.findIndex((s) => s.value === step);

  return (
    <div className="w-full space-y-4">
      <Stepper value={step} onChange={setStep}>
        {CHECKOUT.map((s) => (
          <Step key={s.value} value={s.value} description={s.description}>
            {s.label}
          </Step>
        ))}
      </Stepper>

      <div className="flex items-center gap-3">
        <Button
          variant="outlined"
          size="sm"
          disabled={at === 0}
          onClick={() => setStep(CHECKOUT[at - 1].value)}>
          Back
        </Button>
        <Button
          variant="filled"
          size="sm"
          disabled={at === CHECKOUT.length - 1}
          onClick={() => setStep(CHECKOUT[at + 1].value)}>
          Next
        </Button>
        <span className="text-sm">
          on <code>{step}</code>
        </span>
      </div>
    </div>
  );
}

export function StepperVerticalExample() {
  const [step, setStep] = useState("payment");

  return (
    <div className="w-full max-w-xs">
      <Stepper value={step} onChange={setStep} orientation="vertical">
        {CHECKOUT.map((s) => (
          <Step key={s.value} value={s.value} description={s.description}>
            {s.label}
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

export function StepperErrorExample() {
  return (
    <div className="w-full">
      <Stepper value="done" onChange={() => {}}>
        <Step value="cart">Cart</Step>
        <Step value="delivery" status="error" description="Postcode not found">
          Delivery
        </Step>
        <Step value="payment">Payment</Step>
        <Step value="done">Confirm</Step>
      </Stepper>
    </div>
  );
}

export function StepperFreeExample() {
  const [step, setStep] = useState("cart");

  return (
    <div className="w-full">
      <Stepper value={step} onChange={setStep} linear={false}>
        {CHECKOUT.map((s) => (
          <Step key={s.value} value={s.value}>
            {s.label}
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

export function StepperReadOnlyExample() {
  return (
    <div className="w-full">
      <Stepper value="payment">
        {CHECKOUT.map((s) => (
          <Step key={s.value} value={s.value}>
            {s.label}
          </Step>
        ))}
      </Stepper>
    </div>
  );
}

const PILLS = [
  { value: "dev", label: "Dev", tint: "bg-blue-500/25 text-blue-600 dark:text-blue-400" },
  { value: "review", label: "Review", tint: "bg-green-500/25 text-green-600 dark:text-green-400" },
  { value: "ship", label: "Ship", tint: "bg-amber-500/25 text-amber-600 dark:text-amber-400" }
];

export function StepperRenderExample() {
  const [step, setStep] = useState("dev");

  return (
    <Stepper
      value={step}
      onChange={setStep}
      linear={false}
      separator={<span className="px-3 text-lg text-gray-400">&rarr;</span>}>
      {PILLS.map((s) => (
        <Step
          key={s.value}
          value={s.value}
          render={({ index, status, select }) => (
            <button
              type="button"
              onClick={select}
              className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 ${
                status === "current"
                  ? "border-2 border-gray-900 dark:border-white"
                  : "border border-gray-300 dark:border-gray-700"
              }`}>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${s.tint}`}>
                {index}
              </span>
              <span
                className={
                  status === "current" ? "font-semibold" : "text-gray-500 dark:text-gray-400"
                }>
                {s.label}
              </span>
            </button>
          )}
        />
      ))}
    </Stepper>
  );
}

export function StepperSizesExample() {
  return (
    <div className="w-full space-y-5">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Stepper key={size} value="delivery" size={size}>
          {CHECKOUT.slice(0, 3).map((s) => (
            <Step key={s.value} value={s.value}>
              {s.label}
            </Step>
          ))}
        </Stepper>
      ))}
    </div>
  );
}
