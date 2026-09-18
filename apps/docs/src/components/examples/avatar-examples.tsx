"use client";

import { Avatar, AvatarGroup } from "@geckoui/geckoui";
import { useState } from "react";

const PEOPLE = [
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Margaret Hamilton"
];

export function AvatarBasicExample() {
  return (
    <div className="flex items-center gap-4">
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" color="primary" />
      <Avatar name="Cher" color="success" />
      <Avatar />
    </div>
  );
}

export function AvatarSizesExample() {
  return (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} name="Ada Lovelace" size={size} />
      ))}
    </div>
  );
}

export function AvatarShapesExample() {
  return (
    <div className="flex items-center gap-4">
      {(["circle", "rounded", "square"] as const).map((shape) => (
        <Avatar key={shape} name="Ada Lovelace" shape={shape} size="lg" />
      ))}
    </div>
  );
}

export function AvatarColorsExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {(["default", "primary", "success", "error", "warning", "info"] as const).map((color) => (
        <Avatar key={color} name="Ada Lovelace" color={color} />
      ))}
    </div>
  );
}

export function AvatarFallbackExample() {
  const [broken, setBroken] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar name="Ada Lovelace" src={broken ? "/nope.png" : "/logo.png"} size="lg" />
        <Avatar name="Ada Lovelace" size="lg" />
        <Avatar name="Cher" size="lg" />
        <Avatar size="lg" />
        <Avatar fallback="AI" color="primary" size="lg" />
      </div>

      <button
        type="button"
        className="text-sm underline"
        onClick={() => setBroken((prev) => !prev)}>
        {broken ? "Fix the image" : "Break the image"}
      </button>
    </div>
  );
}

export function AvatarGroupExample() {
  return (
    <AvatarGroup max={3}>
      {PEOPLE.map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  );
}

export function AvatarGroupOverflowExample() {
  return (
    <AvatarGroup
      max={3}
      renderOverflow={({ avatars }) => (
        <div>
          <p className="mb-2 text-xs opacity-70">{avatars.length} more on this project</p>
          <ul className="space-y-1">
            {avatars.map((avatar) => (
              <li key={avatar.name}>{avatar.name}</li>
            ))}
          </ul>
        </div>
      )}>
      {PEOPLE.map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  );
}

export function AvatarGroupStaticExample() {
  return (
    <AvatarGroup max={3} interactive={false} size="lg" shape="rounded">
      {PEOPLE.map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  );
}

export function AvatarClickableExample() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <AvatarGroup max={4}>
        {PEOPLE.map((name) => (
          <Avatar key={name} name={name} onClick={() => setPicked(name)} />
        ))}
      </AvatarGroup>

      <p className="text-sm">{picked ? `You picked ${picked}` : "Click or tab to one"}</p>
    </div>
  );
}
