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
