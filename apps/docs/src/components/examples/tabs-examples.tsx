"use client";

import { Badge, Button, Input, Tab, Tabs } from "@geckoui/geckoui";
import { useState } from "react";

const panel = (name: string) => (
  <p className="text-sm text-fd-muted-foreground">{name} panel content.</p>
);

export function TabsBasicExample() {
  return (
    <Tabs defaultValue="profile">
      <Tab value="profile" label="Profile">
        {panel("Profile")}
      </Tab>
      <Tab value="billing" label="Billing">
        {panel("Billing")}
      </Tab>
      <Tab value="team" label="Team">
        {panel("Team")}
      </Tab>
    </Tabs>
  );
}

export function TabsVariantsExample() {
  return (
    <div className="flex flex-col gap-8">
      {(["underline", "segmented", "soft"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="font-mono text-xs text-fd-muted-foreground">{variant}</p>
          <Tabs defaultValue="one" variant={variant}>
            <Tab value="one" label="One">
              {panel("One")}
            </Tab>
            <Tab value="two" label="Two">
              {panel("Two")}
            </Tab>
            <Tab value="three" label="Three">
              {panel("Three")}
            </Tab>
          </Tabs>
        </div>
      ))}
    </div>
  );
}

export function TabsSizesExample() {
  return (
    <div className="flex flex-col gap-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Tabs key={size} defaultValue="one" variant="segmented" size={size}>
          <Tab value="one" label={`Size ${size}`}>
            {panel(size)}
          </Tab>
          <Tab value="two" label="Another">
            {panel("Another")}
          </Tab>
        </Tabs>
      ))}
    </div>
  );
}

export function TabsFullWidthExample() {
  return (
    <Tabs defaultValue="overview" fullWidth>
      <Tab value="overview" label="Overview">
        {panel("Overview")}
      </Tab>
      <Tab value="activity" label="Activity">
        {panel("Activity")}
      </Tab>
      <Tab value="settings" label="Settings">
        {panel("Settings")}
      </Tab>
    </Tabs>
  );
}

export function TabsVerticalExample() {
  return (
    <Tabs defaultValue="general" orientation="vertical" variant="soft">
      <Tab value="general" label="General">
        {panel("General")}
      </Tab>
      <Tab value="security" label="Security">
        {panel("Security")}
      </Tab>
      <Tab value="advanced" label="Advanced">
        {panel("Advanced")}
      </Tab>
    </Tabs>
  );
}

export function TabsRichLabelExample() {
  return (
    <Tabs defaultValue="inbox">
      <Tab
        value="inbox"
        label={
          <>
            Inbox <Badge color="error">12</Badge>
          </>
        }>
        {panel("Inbox")}
      </Tab>
      <Tab value="sent" label="Sent">
        {panel("Sent")}
      </Tab>
      <Tab value="archive" label="Archive" disabled>
        {panel("Archive")}
      </Tab>
    </Tabs>
  );
}

export function TabsScrollableExample() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return (
    <Tabs defaultValue="m7">
      {months.map((month, i) => (
        <Tab key={month} value={`m${i + 1}`} label={month}>
          {panel(month)}
        </Tab>
      ))}
    </Tabs>
  );
}

export function TabsControlledExample() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {["profile", "billing"].map((value) => (
          <Button key={value} variant="outlined" size="sm" onClick={() => setTab(value)}>
            Go to {value}
          </Button>
        ))}
      </div>

      <Tabs value={tab} onChange={setTab} variant="soft">
        <Tab value="profile" label="Profile">
          {panel("Profile")}
        </Tab>
        <Tab value="billing" label="Billing">
          {panel("Billing")}
        </Tab>
      </Tabs>
    </div>
  );
}

export function TabsKeepMountedExample() {
  return (
    <Tabs defaultValue="form" variant="segmented" keepMounted>
      <Tab value="form" label="Form">
        <Input placeholder="Type here, switch tab, come back" />
      </Tab>
      <Tab value="other" label="Other">
        {panel("Other")}
      </Tab>
    </Tabs>
  );
}

export function TabsNavExample() {
  const [route, setRoute] = useState("/settings/profile");

  const links = [
    ["/settings/profile", "Profile"],
    ["/settings/billing", "Billing"],
    ["/settings/team", "Team"]
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      <Tabs as="nav" value={route}>
        {links.map(([href, label]) => (
          <Tab
            key={href}
            value={href}
            label={({ props, selected }) => (
              <button
                {...props}
                type="button"
                onClick={() => setRoute(href)}
                className="GeckoUITabs__tab"
                data-state={selected ? "selected" : "unselected"}>
                {label}
              </button>
            )}
          />
        ))}
      </Tabs>
      <p className="text-sm text-fd-muted-foreground">
        Pretend route: <code>{route}</code>
      </p>
    </div>
  );
}
