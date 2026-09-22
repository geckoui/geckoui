"use client";

import { Badge, TagInput, TagInputOption } from "@geckoui/geckoui";
import { useState } from "react";

const SUGGESTIONS = ["React", "Vue", "Svelte", "Angular", "Solid", "Qwik", "United State"];

export function TagInputBasicExample() {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="w-full max-w-md space-y-3">
      <TagInput value={tags} onChange={setTags} placeholder="Add a tag" />
      <p className="text-sm">
        value: <code>{JSON.stringify(tags)}</code>
      </p>
    </div>
  );
}

export function TagInputOptionsExample() {
  const [tags, setTags] = useState<string[]>(["React"]);

  return (
    <div className="w-full max-w-md space-y-3">
      <TagInput value={tags} onChange={setTags} placeholder="Add a framework">
        {SUGGESTIONS.map((name) => (
          <TagInputOption key={name} value={name}>
            {name}
          </TagInputOption>
        ))}
      </TagInput>
      <p className="text-sm">
        value: <code>{JSON.stringify(tags)}</code>
      </p>
    </div>
  );
}

export function TagInputValidateExample() {
  const [emails, setEmails] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  return (
    <div className="w-full max-w-md space-y-3">
      <TagInput
        value={emails}
        onChange={setEmails}
        validate={(tag) => /.+@.+\..+/.test(tag)}
        onReject={setRejected}
        placeholder="Add an address"
      />
      <p className="text-sm">
        value: <code>{JSON.stringify(emails)}</code>
      </p>
      {!!rejected.length && (
        <p className="text-sm text-red-600">
          turned away: <code>{JSON.stringify(rejected)}</code>
        </p>
      )}
    </div>
  );
}

export function TagInputMaxExample() {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="w-full max-w-md">
      <TagInput value={tags} onChange={setTags} max={3} placeholder="Three at most" />
    </div>
  );
}

export function TagInputRenderTagExample() {
  const [tags, setTags] = useState<string[]>(["React", "Vue"]);

  return (
    <div className="w-full max-w-md">
      <TagInput
        value={tags}
        onChange={setTags}
        renderTag={({ value, remove }) => (
          <Badge color="primary" onClick={remove} className="cursor-pointer">
            {value} ×
          </Badge>
        )}
      />
    </div>
  );
}

export function TagInputStatesExample() {
  return (
    <div className="w-full max-w-md space-y-3">
      <TagInput value={["Locked"]} onChange={() => {}} disabled />
      <TagInput value={["Read only"]} onChange={() => {}} readOnly />
      <TagInput value={["Wrong"]} onChange={() => {}} aria-invalid />
    </div>
  );
}
