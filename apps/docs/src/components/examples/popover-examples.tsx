"use client";

import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopover
} from "@geckoui/geckoui";
import { useState } from "react";

export function PopoverBasicExample() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button>Open</Button>
      </PopoverTrigger>

      <PopoverContent>
        <p className="text-sm">Anything can live in here.</p>
      </PopoverContent>
    </Popover>
  );
}

export function PopoverPlacementExample() {
  return (
    <div className="flex flex-wrap gap-3">
      {(["top", "right", "bottom", "left"] as const).map((placement) => (
        <Popover key={placement} placement={placement} arrow>
          <PopoverTrigger>
            <Button variant="outlined">{placement}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm">placement=&quot;{placement}&quot;</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

export function PopoverFormExample() {
  const Body = () => {
    const { close } = usePopover();

    return (
      <form
        className="flex w-56 flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          close();
        }}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="popover-min">Minimum</Label>
          <Input id="popover-min" placeholder="0" />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            Apply
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button>Filters</Button>
      </PopoverTrigger>

      <PopoverContent>
        <Body />
      </PopoverContent>
    </Popover>
  );
}

export function PopoverControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Button variant="outlined" onClick={() => setOpen((prev) => !prev)}>
        {open ? "Close it" : "Open it"}
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button>The trigger</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">Driven from outside.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
