"use client";

import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  CounterInput,
  OTPInput,
  Rating,
  Slider,
  Step,
  Stepper,
  Switch,
  toast
} from "@geckoui/geckoui";
import { useState } from "react";

export function NotifySwitch() {
  const [on, setOn] = useState(true);

  return (
    <label className="flex items-center justify-between gap-6 text-sm">
      <span>Email me about releases</span>
      <Switch checked={on} onChange={setOn} />
    </label>
  );
}

export function VolumeSlider() {
  const [value, setValue] = useState(64);

  return (
    <div className="w-56 space-y-2 text-sm">
      <span>Volume</span>
      <Slider value={value} onChange={setValue} label={({ value }) => `${value}%`} />
    </div>
  );
}

export function RatingWidget() {
  const [score, setScore] = useState(4);

  return (
    <div className="space-y-1 text-sm">
      <span>Rate this library</span>
      <Rating value={score} onChange={setScore} aria-label="Rate GeckoUI" />
    </div>
  );
}

export function OTPWidget() {
  const [code, setCode] = useState("4821");

  return (
    <div className="w-64 space-y-2 text-sm">
      <span>Verification code</span>
      <OTPInput value={code} onChange={setCode} length={4} numberOnly />
    </div>
  );
}

export function ToastButton() {
  return (
    <Button
      onClick={() => toast.success("Bug eaten", { description: "One less bug in your app." })}>
      Feed the gecko
    </Button>
  );
}

export function TeamAvatars() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <AvatarGroup max={3}>
        {["Ada Lovelace", "Grace Hopper", "Alan Turing", "Margaret Hamilton"].map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <span>4 reviewers</span>
    </div>
  );
}

export function CheckoutStepper() {
  const [step, setStep] = useState("ship");

  return (
    <div className="w-[min(26rem,calc(100vw-5rem))]">
      <Stepper value={step} onChange={setStep}>
        <Step value="cart">Cart</Step>
        <Step value="ship">Shipping</Step>
        <Step value="pay">Payment</Step>
      </Stepper>
    </div>
  );
}

export function QuantityCounter() {
  const [value, setValue] = useState("2");

  return (
    <div className="flex items-center gap-3 text-sm">
      <span>Qty</span>
      <CounterInput value={value} onChange={setValue} min={0} max={9} size="sm" />
    </div>
  );
}

export function StatusBadges() {
  return (
    <div className="flex gap-2">
      <Badge color="success" variant="soft">
        Passing
      </Badge>
      <Badge color="primary">v2</Badge>
      <Badge color="warning" variant="outlined">
        0 bugs
      </Badge>
    </div>
  );
}
