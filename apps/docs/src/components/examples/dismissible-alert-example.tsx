"use client";

import { Alert, Button } from "@geckoui/geckoui";
import { useState } from "react";

export function DismissibleAlertExample() {
  const [show, setShow] = useState(true);

  if (!show) {
    return (
      <Button size="sm" onClick={() => setShow(true)}>
        Show Alert Again
      </Button>
    );
  }

  return (
    <Alert
      color="warning"
      title="Storage almost full"
      description="You're using 95% of your storage. Upgrade your plan to avoid interruptions."
      onRemove={() => setShow(false)}
    />
  );
}
