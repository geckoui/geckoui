"use client";

import { classNames } from "@/lib/classNames";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  CounterInput,
  Input,
  Label,
  OTPInput,
  Pagination,
  Progress,
  Rating,
  Select,
  SelectOption,
  Slider,
  Switch,
  Textarea,
  toast
} from "@geckoui/geckoui";
import { type CSSProperties, type ReactNode, useState } from "react";

const ACCENTS = [
  { name: "Blue", hue: 260 },
  { name: "Violet", hue: 290 },
  { name: "Green", hue: 150 },
  { name: "Orange", hue: 50 },
  { name: "Rose", hue: 10 }
];

function accentVars(hue: number) {
  return {
    "--color-primary-300": `oklch(0.81 0.1 ${hue})`,
    "--color-primary-500": `oklch(0.62 0.19 ${hue})`,
    "--color-primary-600": `oklch(0.55 0.2 ${hue})`
  } as CSSProperties;
}

function Card({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-4 break-inside-avoid rounded-xl border border-border bg-background p-5 shadow-xs">
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SignUpCard() {
  const [plan, setPlan] = useState<string | null>("pro");

  return (
    <Card title="Create an account" description="Start your 14-day trial. No card needed.">
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="sc-name">Name</Label>
          <Input id="sc-name" placeholder="Ada Lovelace" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sc-email">Email</Label>
          <Input id="sc-email" type="email" placeholder="ada@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label>Plan</Label>
          <Select value={plan} onChange={setPlan}>
            <SelectOption value="free" label="Free" />
            <SelectOption value="pro" label="Pro" />
            <SelectOption value="team" label="Team" />
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox defaultChecked />
          Send me product updates
        </label>
        <Button type="submit" className="w-full" onClick={() => toast.success("Account created")}>
          Create account
        </Button>
      </form>
    </Card>
  );
}

function ThemeCard({ hue, onHue }: { hue: number; onHue: (hue: number) => void }) {
  return (
    <Card title="Brand color" description="Every component reads the same CSS variables. Pick one.">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Primary color">
        {ACCENTS.map((a) => (
          <button
            key={a.name}
            type="button"
            aria-pressed={hue === a.hue}
            onClick={() => onHue(a.hue)}
            className={classNames(
              "inline-flex h-8 items-center gap-2 rounded-md border px-2.5 text-xs font-medium transition-colors",
              hue === a.hue ? "border-foreground" : "border-border hover:bg-accent"
            )}>
            <span
              className="size-3 rounded-full"
              style={{ background: `oklch(0.62 0.19 ${a.hue})` }}
            />
            {a.name}
          </button>
        ))}
      </div>
      <pre className="mt-4 rounded-lg bg-muted px-3 py-2.5 font-mono text-xs leading-5">
        {`:root {\n  --color-primary-500:\n    oklch(0.62 0.19 ${hue});\n}`}
      </pre>
    </Card>
  );
}

function NotificationsCard() {
  const [settings, setSettings] = useState({ product: true, security: true, digest: false });
  const rows = [
    { key: "product", label: "Product updates", hint: "New features and releases" },
    { key: "security", label: "Security alerts", hint: "Sign-ins from new devices" },
    { key: "digest", label: "Weekly digest", hint: "A summary every Monday" }
  ] as const;

  return (
    <Card title="Notifications" description="Choose what you hear about.">
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <label
            key={row.key}
            className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
            <span>
              <span className="block text-sm font-medium">{row.label}</span>
              <span className="block text-xs text-muted-foreground">{row.hint}</span>
            </span>
            <Switch
              checked={settings[row.key]}
              onChange={(checked) => setSettings((s) => ({ ...s, [row.key]: checked }))}
            />
          </label>
        ))}
      </div>
    </Card>
  );
}

function VerifyCard() {
  const [code, setCode] = useState("");

  return (
    <Card title="Two-step verification" description="Enter the 6-digit code from your app.">
      <OTPInput value={code} onChange={setCode} length={6} numberOnly />
      <Button
        className="mt-4 w-full"
        disabled={code.length < 6}
        onClick={() => toast.success("Verified")}>
        Verify
      </Button>
    </Card>
  );
}

function UploadCard() {
  return (
    <Card title="Uploads">
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">design-tokens.json</span>
            <Badge color="primary" variant="soft">
              Uploading
            </Badge>
          </div>
          <Progress value={72} label={({ percent }) => `${percent}%`} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">hero.png</span>
            <Badge color="success" variant="soft">
              Done
            </Badge>
          </div>
          <Progress value={100} color="success" />
        </div>
      </div>
    </Card>
  );
}

function TeamCard() {
  const people = [
    { name: "Ada Lovelace", email: "ada@example.com", role: "Owner" },
    { name: "Grace Hopper", email: "grace@example.com", role: "Admin" },
    { name: "Alan Turing", email: "alan@example.com", role: "Member" }
  ];

  return (
    <Card title="Team members" description="Invite your team to collaborate.">
      <ul className="space-y-3">
        {people.map((p) => (
          <li key={p.email} className="flex items-center gap-3">
            <Avatar name={p.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">{p.email}</p>
            </div>
            <Badge variant="outlined">{p.role}</Badge>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <AvatarGroup max={3}>
          {[
            "Ada Lovelace",
            "Grace Hopper",
            "Alan Turing",
            "Margaret Hamilton",
            "Katherine Johnson"
          ].map((n) => (
            <Avatar key={n} name={n} size="sm" />
          ))}
        </AvatarGroup>
        <Button size="sm" variant="outlined">
          Invite
        </Button>
      </div>
    </Card>
  );
}

function FeedbackCard() {
  const [score, setScore] = useState(4);

  return (
    <Card title="Leave feedback" description="How was your experience?">
      <Rating value={score} onChange={setScore} aria-label="Rating" />
      <Textarea className="mt-3" placeholder="Tell us what to improve..." rows={3} />
      <Button className="mt-3" onClick={() => toast.success("Thanks for the feedback")}>
        Send feedback
      </Button>
    </Card>
  );
}

function OrderCard() {
  const [qty, setQty] = useState("2");
  const [page, setPage] = useState(2);
  const [volume, setVolume] = useState(40);

  return (
    <Card title="Order #1042" description="Arriving Thursday.">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Quantity</span>
        <CounterInput value={qty} onChange={setQty} min={1} max={9} size="sm" />
      </div>
      <div className="mt-5 space-y-1.5">
        <Label>Delivery window</Label>
        <Slider value={volume} onChange={setVolume} label={({ value }) => `${value} min`} />
      </div>
      <div className="mt-5 flex justify-center">
        <Pagination currentPage={page} totalPages={5} onChange={setPage} />
      </div>
    </Card>
  );
}

export function Showcase() {
  const [hue, setHue] = useState(260);

  return (
    <div style={accentVars(hue)} className="columns-1 gap-4 md:columns-2 lg:columns-3">
      <SignUpCard />
      <NotificationsCard />
      <UploadCard />
      <ThemeCard hue={hue} onHue={setHue} />
      <TeamCard />
      <VerifyCard />
      <OrderCard />
      <FeedbackCard />
    </div>
  );
}
