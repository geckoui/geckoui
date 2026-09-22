"use client";

import { Badge, Button, Input, Tab, TabList, TabPanel, Tabs } from "@geckoui/geckoui";
import { useState } from "react";

const panel = (name: string) => (
  <p className="text-sm text-fd-muted-foreground">{name} panel content.</p>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CardIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const BellIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

export function TabsBasicExample() {
  return (
    <Tabs defaultValue="profile">
      <TabList>
        <Tab value="profile">Profile</Tab>
        <Tab value="billing">Billing</Tab>
        <Tab value="team">Team</Tab>
      </TabList>

      <TabPanel value="profile">{panel("Profile")}</TabPanel>
      <TabPanel value="billing">{panel("Billing")}</TabPanel>
      <TabPanel value="team">{panel("Team")}</TabPanel>
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
            <TabList>
              <Tab value="one">One</Tab>
              <Tab value="two">Two</Tab>
              <Tab value="three">Three</Tab>
            </TabList>

            <TabPanel value="one">{panel("One")}</TabPanel>
            <TabPanel value="two">{panel("Two")}</TabPanel>
            <TabPanel value="three">{panel("Three")}</TabPanel>
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
          <TabList>
            <Tab value="one">Size {size}</Tab>
            <Tab value="two">Another</Tab>
          </TabList>

          <TabPanel value="one">{panel(size)}</TabPanel>
          <TabPanel value="two">{panel("Another")}</TabPanel>
        </Tabs>
      ))}
    </div>
  );
}

export function TabsFullWidthExample() {
  return (
    <Tabs defaultValue="overview" fullWidth>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>

      <TabPanel value="overview">{panel("Overview")}</TabPanel>
      <TabPanel value="activity">{panel("Activity")}</TabPanel>
      <TabPanel value="settings">{panel("Settings")}</TabPanel>
    </Tabs>
  );
}

export function TabsVerticalExample() {
  return (
    <Tabs defaultValue="general" orientation="vertical" variant="soft">
      <TabList>
        <Tab value="general">General</Tab>
        <Tab value="security">Security</Tab>
        <Tab value="advanced">Advanced</Tab>
      </TabList>

      <TabPanel value="general">{panel("General")}</TabPanel>
      <TabPanel value="security">{panel("Security")}</TabPanel>
      <TabPanel value="advanced">{panel("Advanced")}</TabPanel>
    </Tabs>
  );
}

export function TabsRichLabelExample() {
  return (
    <Tabs defaultValue="inbox">
      <TabList>
        <Tab value="inbox">
          Inbox <Badge color="error">12</Badge>
        </Tab>
        <Tab value="sent">Sent</Tab>
        <Tab value="archive" disabled>
          Archive
        </Tab>
      </TabList>

      <TabPanel value="inbox">{panel("Inbox")}</TabPanel>
      <TabPanel value="sent">{panel("Sent")}</TabPanel>
      <TabPanel value="archive">{panel("Archive")}</TabPanel>
    </Tabs>
  );
}

export function TabsIconExample() {
  return (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="profile" variant="segmented">
        <TabList>
          <Tab value="profile">
            <UserIcon /> Profile
          </Tab>
          <Tab value="billing">
            <CardIcon /> Billing
          </Tab>
          <Tab value="alerts">
            <BellIcon /> Alerts <Badge color="error">7</Badge>
          </Tab>
        </TabList>

        <TabPanel value="profile">{panel("Profile")}</TabPanel>
        <TabPanel value="billing">{panel("Billing")}</TabPanel>
        <TabPanel value="alerts">{panel("Alerts")}</TabPanel>
      </Tabs>

      <Tabs defaultValue="profile" variant="soft">
        <TabList>
          <Tab value="profile" aria-label="Profile">
            <UserIcon />
          </Tab>
          <Tab value="billing" aria-label="Billing">
            <CardIcon />
          </Tab>
          <Tab value="alerts" aria-label="Alerts">
            <BellIcon />
          </Tab>
        </TabList>

        <TabPanel value="profile">{panel("Profile")}</TabPanel>
        <TabPanel value="billing">{panel("Billing")}</TabPanel>
        <TabPanel value="alerts">{panel("Alerts")}</TabPanel>
      </Tabs>
    </div>
  );
}

const MONTHS = [
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

export function TabsScrollableExample() {
  return (
    <Tabs defaultValue="July">
      <TabList>
        {MONTHS.map((month) => (
          <Tab key={month} value={month}>
            {month}
          </Tab>
        ))}
      </TabList>

      {MONTHS.map((month) => (
        <TabPanel key={month} value={month}>
          {panel(month)}
        </TabPanel>
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
        <TabList>
          <Tab value="profile">Profile</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>

        <TabPanel value="profile">{panel("Profile")}</TabPanel>
        <TabPanel value="billing">{panel("Billing")}</TabPanel>
      </Tabs>
    </div>
  );
}

export function TabsKeepMountedExample() {
  return (
    <Tabs defaultValue="form" variant="segmented">
      <TabList>
        <Tab value="form">Form</Tab>
        <Tab value="other">Other</Tab>
      </TabList>

      <TabPanel value="form" keepMounted>
        <Input placeholder="Type here, switch tab, come back" />
      </TabPanel>
      <TabPanel value="other">{panel("Other")}</TabPanel>
    </Tabs>
  );
}

export function TabsLayoutExample() {
  return (
    <Tabs defaultValue="profile" className="overflow-hidden rounded-lg border">
      <header className="bg-fd-muted border-b px-4 pt-3">
        <p className="mb-2 text-sm font-semibold">Settings</p>
        <TabList>
          <Tab value="profile">Profile</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>
      </header>

      <div className="h-32 overflow-y-auto p-4">
        <TabPanel value="profile">{panel("Profile")}</TabPanel>
        <TabPanel value="billing">{panel("Billing")}</TabPanel>
      </div>
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
        <TabList>
          {links.map(([href, label]) => (
            <Tab key={href} value={href} asChild>
              <button type="button" onClick={() => setRoute(href)}>
                {label}
              </button>
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <p className="text-sm text-fd-muted-foreground">
        Pretend route: <code>{route}</code>
      </p>
    </div>
  );
}
