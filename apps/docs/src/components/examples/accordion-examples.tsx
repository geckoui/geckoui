"use client";

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Badge,
  Button,
  Input
} from "@geckoui/geckoui";
import type { AccordionValue } from "@geckoui/geckoui";
import { useState } from "react";

const FAQ = [
  ["shipping", "Shipping", "Ships in two to three working days. Tracking follows by email."],
  ["returns", "Returns", "Thirty days, unopened, in the original packaging."],
  ["warranty", "Warranty", "Two years against manufacturing faults."]
] as const;

const items = () =>
  FAQ.map(([value, title, body]) => (
    <AccordionItem key={value} value={value}>
      <AccordionHeader>{title}</AccordionHeader>
      <AccordionPanel>{body}</AccordionPanel>
    </AccordionItem>
  ));

export function AccordionBasicExample() {
  return <Accordion defaultValue="shipping">{items()}</Accordion>;
}

export function AccordionVariantsExample() {
  return (
    <div className="flex flex-col gap-8">
      {(["plain", "separated", "contained"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="font-mono text-xs text-fd-muted-foreground">{variant}</p>
          <Accordion defaultValue="shipping" variant={variant}>
            {items()}
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export function AccordionSizesExample() {
  return (
    <div className="flex flex-col gap-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="font-mono text-xs text-fd-muted-foreground">{size}</p>
          <Accordion defaultValue="shipping" size={size} variant="separated">
            {items()}
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export function AccordionMultipleExample() {
  return (
    <Accordion multiple defaultValue={["shipping", "returns"]}>
      {items()}
    </Accordion>
  );
}

export function AccordionCollapsibleExample() {
  return (
    <Accordion defaultValue="shipping" collapsible={false}>
      {items()}
    </Accordion>
  );
}

export function AccordionRichHeaderExample() {
  return (
    <Accordion defaultValue="shipping">
      <AccordionItem value="shipping">
        <AccordionHeader>
          Shipping <Badge color="info">free</Badge>
        </AccordionHeader>
        <AccordionPanel>Ships in two to three working days.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionHeader>Returns</AccordionHeader>
        <AccordionPanel>Thirty days, unopened.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="warranty" disabled>
        <AccordionHeader>Warranty — unavailable</AccordionHeader>
        <AccordionPanel>Two years.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function AccordionFormExample() {
  return (
    <Accordion defaultValue="details">
      <AccordionItem value="details">
        <AccordionHeader>Your details</AccordionHeader>
        <AccordionPanel>
          <Input placeholder="Type here, close the panel, open it again" />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="payment">
        <AccordionHeader>Payment</AccordionHeader>
        <AccordionPanel>Card details go here.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function AccordionControlledExample() {
  const [open, setOpen] = useState<AccordionValue>("shipping");

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-fd-muted-foreground">
        Open: <code>{JSON.stringify(open)}</code>
      </p>

      <div className="flex flex-wrap gap-2">
        {FAQ.map(([value, title]) => (
          <Button key={value} variant="outlined" size="sm" onClick={() => setOpen(value)}>
            {title}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => setOpen("")}>
          Close all
        </Button>
      </div>

      <Accordion value={open} onChange={setOpen}>
        {items()}
      </Accordion>
    </div>
  );
}
