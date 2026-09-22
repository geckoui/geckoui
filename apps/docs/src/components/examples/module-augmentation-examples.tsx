"use client";

import { Alert, Button, CounterInput, Switch } from "@geckoui/geckoui";
import { useState } from "react";

export function ButtonCustomColorsExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button color="secondary">Secondary</Button>
      <Button color="danger">Danger</Button>
      <Button color="secondary" variant="outlined">
        Secondary Outlined
      </Button>
      <Button color="danger" variant="outlined">
        Danger Outlined
      </Button>
      <Button color="secondary" variant="ghost">
        Secondary Ghost
      </Button>
      <Button color="danger" variant="ghost">
        Danger Ghost
      </Button>
    </div>
  );
}

export function SwitchCustomSizeExample() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch size="sm" checked={enabled} onChange={setEnabled} />
        <span>Small</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch size="md" checked={enabled} onChange={setEnabled} />
        <span>Medium (default)</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch size="lg" checked={enabled} onChange={setEnabled} />
        <span>Large (custom)</span>
      </div>
    </div>
  );
}

export function AlertCustomVariantExample() {
  return (
    <div className="flex flex-col gap-3">
      <Alert color="error" title="Error alert" />
      <Alert color="warning" title="Warning alert" />
      <Alert color="critical" title="Critical alert (custom variant)" />
    </div>
  );
}

export function CounterInputCustomSizeExample() {
  const [value, setValue] = useState("0");

  return <CounterInput value={value} onChange={setValue} size="xl" />;
}
