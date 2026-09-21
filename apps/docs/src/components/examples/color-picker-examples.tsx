"use client";

import { ColorInput, ColorPicker } from "@geckoui/geckoui";
import { useState } from "react";

const SWATCHES = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
  "#0f172a"
];

function Readout({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className="w-20 shrink-0" style={{ color: "var(--color-text-placeholder)" }}>
        {label}
      </span>
      <span
        className="size-4 shrink-0 rounded"
        style={{ background: color, boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.15)" }}
      />
      <span style={{ color: "var(--color-text-primary)" }}>{color}</span>
    </div>
  );
}

export function ColorPickerBasicExample() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="flex flex-wrap items-start gap-8">
      <ColorPicker value={color} onChange={setColor} />
      <Readout label="value" color={color} />
    </div>
  );
}

export function ColorPickerCompleteExample() {
  const [live, setLive] = useState("#8b5cf6");
  const [saved, setSaved] = useState("#8b5cf6");

  return (
    <div className="flex flex-wrap items-start gap-8">
      <ColorPicker value={live} onChange={setLive} onChangeComplete={setSaved} />

      <div className="space-y-2">
        <Readout label="onChange" color={live} />
        <Readout label="onComplete" color={saved} />
      </div>
    </div>
  );
}

export function ColorPickerFormatsExample() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="flex flex-wrap items-start gap-8">
      <ColorPicker value={color} onChange={setColor} formats={["rgb", "hex", "hsl"]} />
      <Readout label="value" color={color} />
    </div>
  );
}

export function ColorPickerAlphaExample() {
  const [color, setColor] = useState("rgba(59, 130, 246, 0.5)");

  return (
    <div className="flex flex-wrap items-start gap-8">
      <ColorPicker value={color} onChange={setColor} formats={["rgb", "hex"]} />
      <Readout label="value" color={color} />
    </div>
  );
}

export function ColorPickerSwatchesExample() {
  const [color, setColor] = useState("#10b981");

  return (
    <div className="flex flex-wrap items-start gap-8">
      <ColorPicker value={color} onChange={setColor} swatches={SWATCHES} eyeDropper />
      <Readout label="value" color={color} />
    </div>
  );
}

export function ColorPickerRenderExample() {
  const [color, setColor] = useState("#f59e0b");

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      renderSaturation={({ color: current, dragging }) => (
        <span
          className="block rounded-full border-2 border-white shadow"
          style={{
            background: current,
            width: dragging ? 28 : 20,
            height: dragging ? 28 : 20
          }}
        />
      )}
      renderHueThumb={({ hsva }) => (
        <span
          className="block h-5 w-3 rounded-sm border-2 border-white shadow"
          style={{ background: `hsl(${hsva.h}, 100%, 50%)` }}
        />
      )}
    />
  );
}

export function ColorInputBasicExample() {
  const [color, setColor] = useState("#3b82f6");

  return (
    <div className="max-w-xs space-y-3">
      <ColorInput value={color} onChange={setColor} swatches={SWATCHES} />
      <Readout label="value" color={color} />
    </div>
  );
}

export function ColorInputStatesExample() {
  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <ColorInput defaultValue="#3b82f6" />
      <ColorInput value="" placeholder="Pick a colour" />
      <ColorInput defaultValue="#ef4444" hasError />
      <ColorInput defaultValue="#64748b" disabled />
      <ColorInput defaultValue="#10b981" readOnly />
      <ColorInput defaultValue="rgba(15, 23, 42, 0.6)" formats={["rgb", "hex"]} />
    </div>
  );
}

export function ColorInputRenderExample() {
  const [dot, setDot] = useState("#06b6d4");
  const [pill, setPill] = useState("#8b5cf6");

  return (
    <div className="flex flex-wrap items-center gap-6">
      <ColorInput
        value={dot}
        onChange={setDot}
        swatches={SWATCHES}
        render={({ color }) => (
          <span
            className="block size-8 rounded-full"
            style={{ background: color, boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.15)" }}
          />
        )}
      />

      <ColorInput
        value={pill}
        onChange={setPill}
        swatches={SWATCHES}
        render={({ color, open }) => (
          <span
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
            style={{ borderColor: "var(--color-border-secondary)" }}>
            <span className="size-4 rounded-full" style={{ background: color }} />
            {open ? "Picking…" : "Theme colour"}
          </span>
        )}
      />
    </div>
  );
}
