"use client";

import { Checkbox } from "@geckoui/geckoui";
import { useState } from "react";

export function CheckboxBasicExample() {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <Checkbox defaultChecked />
      <span>I agree to the terms and conditions</span>
    </label>
  );
}

export function CheckboxIndeterminateExample() {
  const [items, setItems] = useState([
    { id: 1, label: "Item 1", checked: true },
    { id: 2, label: "Item 2", checked: false },
    { id: 3, label: "Item 3", checked: true }
  ]);

  const allChecked = items.every((item) => item.checked);
  const someChecked = items.some((item) => item.checked);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItems(items.map((item) => ({ ...item, checked: e.target.checked })));
  };

  const handleItemChange = (id: number, checked: boolean) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked } : item)));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2">
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={handleSelectAll}
        />
        <span>Select All</span>
      </label>
      <div className="ml-6 flex flex-col gap-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-2">
            <Checkbox
              checked={item.checked}
              onChange={(e) => handleItemChange(item.id, e.target.checked)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function CheckboxDisabledExample() {
  return (
    <div className="flex gap-4">
      <Checkbox checked disabled />
      <Checkbox disabled />
    </div>
  );
}

export function CheckboxMultipleExample() {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true
  });

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.checked })}
        />
        <span>Email notifications</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={settings.sms}
          onChange={(e) => setSettings({ ...settings, sms: e.target.checked })}
        />
        <span>SMS notifications</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={settings.push}
          onChange={(e) => setSettings({ ...settings, push: e.target.checked })}
        />
        <span>Push notifications</span>
      </label>
    </div>
  );
}
