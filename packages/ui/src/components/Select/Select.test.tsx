import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Select, SelectEmpty, SelectOption, SelectTrigger } from ".";

const menu = () => document.querySelector<HTMLElement>(".GeckoUISelectMenu");
const options = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".GeckoUISelectOption"));
const optionByLabel = (label: string) => options().find((o) => o.textContent?.includes(label))!;
const trigger = () => document.querySelector<HTMLElement>(".GeckoUISelectButton")!;
const searchInput = () =>
  document.querySelector<HTMLInputElement>(".GeckoUISelectButton__search__input")!;

function Fruits({
  onChange,
  ...rest
}: { onChange?: (v: unknown) => void } & Record<string, unknown>) {
  const [value, setValue] = useState<unknown>(rest.multiple ? [] : undefined);
  return (
    <Select
      value={value}
      onChange={(v: unknown) => {
        setValue(v);
        onChange?.(v);
      }}
      {...rest}>
      <SelectOption value="apple" label="Apple" />
      <SelectOption value="banana" label="Banana" />
      <SelectOption value="cherry" label="Cherry" />
    </Select>
  );
}

describe("Select", () => {
  it("renders a trigger with the default placeholder", () => {
    render(<Fruits />);

    expect(screen.getByText("Select option")).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(<Fruits placeholder="Pick a fruit" />);

    expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
  });

  it("keeps the menu closed at first", () => {
    render(<Fruits />);

    expect(menu()).toBeNull();
  });

  it("opens the menu on click and lists every option", async () => {
    render(<Fruits />);

    await userEvent.click(trigger());

    expect(menu()).toBeInTheDocument();
    expect(options().map((o) => o.textContent)).toEqual(["Apple", "Banana", "Cherry"]);
  });

  it("selects an option and shows its label", async () => {
    const onChange = vi.fn();
    render(<Fruits onChange={onChange} />);

    await userEvent.click(trigger());
    await userEvent.click(optionByLabel("Banana"));

    expect(onChange).toHaveBeenCalledWith("banana");
    expect(within(trigger()).getByText("Banana")).toBeInTheDocument();
  });

  it("closes the menu after a single select", async () => {
    render(<Fruits />);

    await userEvent.click(trigger());
    await userEvent.click(optionByLabel("Banana"));

    expect(menu()).toBeNull();
  });

  it("marks the selected option", async () => {
    render(<Fruits />);

    await userEvent.click(trigger());
    await userEvent.click(optionByLabel("Banana"));
    await userEvent.click(trigger());

    expect(optionByLabel("Banana")).toHaveAttribute("data-state", "selected");
    expect(optionByLabel("Apple")).toHaveAttribute("data-state", "unselected");
  });

  it("closes when clicking outside", async () => {
    render(
      <div>
        <button type="button">Outside</button>
        <Fruits />
      </div>
    );

    await userEvent.click(trigger());
    expect(menu()).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Outside" }));

    await waitFor(() => expect(menu()).toBeNull());
  });

  it("does not open when disabled", async () => {
    render(<Fruits disabled />);

    await userEvent.click(trigger());

    expect(menu()).toBeNull();
    expect(trigger()).toHaveAttribute("data-state", "disabled");
    expect(trigger()).toHaveAttribute("aria-disabled", "true");
  });

  it("ignores clicks on a disabled option", async () => {
    const onChange = vi.fn();
    render(
      <Select value={undefined} onChange={onChange}>
        <SelectOption value="apple" label="Apple" disabled />
      </Select>
    );

    await userEvent.click(trigger());
    await userEvent.click(optionByLabel("Apple"));

    expect(onChange).not.toHaveBeenCalled();
    expect(optionByLabel("Apple")).toHaveAttribute("data-disabled", "true");
  });

  it("shows a controlled value on first render", () => {
    render(
      <Select value="cherry" onChange={() => {}}>
        <SelectOption value="apple" label="Apple" />
        <SelectOption value="cherry" label="Cherry" />
      </Select>
    );

    expect(within(trigger()).getByText("Cherry")).toBeInTheDocument();
  });

  describe("a value that is not in the options list", () => {
    const withValue = (value: unknown, children?: React.ReactNode) =>
      render(
        <Select value={value as never} placeholder="Select option" onChange={() => {}}>
          {children ?? <SelectOption value="apple" label="Apple" />}
        </Select>
      );

    const triggerText = () => trigger().textContent;
    const showsPlaceholder = () => !!trigger().querySelector("[data-placeholder]");

    it("shows text worked out from the value", () => {
      withValue("ghost");

      expect(triggerText()).toBe("ghost");
    });

    it("uses the first property of an object", () => {
      withValue({ id: 7, name: "Ann" });

      expect(triggerText()).toBe("7");
    });

    it("skips a nil property rather than crashing", () => {
      withValue({ id: null, name: "Ann" });

      expect(triggerText()).toBe("Ann");
    });

    it("prefers a label key", () => {
      withValue({ id: null, label: "Ann" });

      expect(triggerText()).toBe("Ann");
    });

    it("uses an object's own text when it has one", () => {
      withValue(new Date(2024, 0, 15));

      expect(triggerText()).toContain("Jan 15 2024");
    });

    // Anything that would render as an empty box falls through to the placeholder
    it.each([
      ["null", null],
      ["undefined", undefined],
      ["an empty string", ""],
      ["a whitespace only string", "   "],
      ["an object whose properties are all nil", { id: null, name: null }],
      ["an object whose first property is an empty string", { id: null, name: "" }],
      ["an object that stops at an empty string", { id: null, name: "", nickname: "Ann" }],
      ["an object whose first property is whitespace", { id: null, name: "   " }],
      ["an object with no properties", {}],
      ["an object with an empty label key", { label: "" }],
      ["an empty array", []],
      ["an array of only nil", [null]]
    ])("shows the placeholder for %s", (_label, value) => {
      withValue(value);

      expect(showsPlaceholder()).toBe(true);
    });

    it.each([["0", 0, "0"], ["false", false, "false"]])(
      "keeps %s, which does print",
      (_label, value, expected) => {
        withValue(value);

        expect(triggerText()).toBe(expected);
      }
    );

    it("selects nothing in the menu, since nothing matches", async () => {
      withValue({ id: null, name: "Ann" });

      await userEvent.click(trigger());

      expect(options().every((o) => o.dataset.state === "unselected")).toBe(true);
    });
  });

  describe("the developer warning", () => {
    const warn = () => vi.spyOn(console, "warn").mockImplementation(() => {});

    it("warns when a value matches no option", () => {
      const spy = warn();

      render(
        <Select value={{ id: 7, name: "Ann" } as never} onChange={() => {}}>
          <SelectOption value="apple" label="Apple" />
        </Select>
      );

      expect(spy).toHaveBeenCalledWith(expect.stringContaining("matches no SelectOption"));
      spy.mockRestore();
    });

    it("stays quiet when an option matches", () => {
      const spy = warn();

      render(
        <Select value="apple" onChange={() => {}}>
          <SelectOption value="apple" label="Apple" />
        </Select>
      );

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it.each([["null", null], ["undefined", undefined], ["an empty string", ""]])(
      "stays quiet for %s, which just means nothing is chosen",
      (_label, value) => {
        const spy = warn();

        render(
          <Select value={value as never} onChange={() => {}}>
            <SelectOption value="apple" label="Apple" />
          </Select>
        );

        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
      }
    );

    it("stays quiet in multiple mode", () => {
      const spy = warn();

      render(
        <Select multiple value={["ghost"] as never} onChange={() => {}}>
          <SelectOption value="apple" label="Apple" />
        </Select>
      );

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe("a matching option always wins", () => {
    const cases: [string, unknown][] = [
      ["an empty string", ""],
      ["null", null],
      ["an object whose properties are all nil", { id: null, name: null }],
      ["an empty object", {}]
    ];

    cases.forEach(([label, value]) => {
      it(`shows the option label for ${label}`, () => {
        render(
          <Select value={value as never} placeholder="Select option" onChange={() => {}}>
            <SelectOption value={value as never} label="None" />
            <SelectOption value="apple" label="Apple" />
          </Select>
        );

        expect(trigger()).toHaveTextContent("None");
        expect(trigger().querySelector("[data-placeholder]")).toBeNull();
      });
    });
  });

  describe("keyboard", () => {
    it("opens the menu when the search input takes focus", async () => {
      render(<Fruits />);

      await act(async () => {
        searchInput().focus();
      });

      expect(menu()).toBeInTheDocument();
    });

    it("moves the focused option with the arrow keys", async () => {
      render(<Fruits />);

      await userEvent.click(trigger());
      expect(optionByLabel("Apple")).toHaveAttribute("data-focused", "true");

      await userEvent.keyboard("{ArrowDown}");
      expect(optionByLabel("Banana")).toHaveAttribute("data-focused", "true");

      await userEvent.keyboard("{ArrowUp}");
      expect(optionByLabel("Apple")).toHaveAttribute("data-focused", "true");
    });

    it("wraps the focused option around the ends", async () => {
      render(<Fruits />);

      await userEvent.click(trigger());
      await userEvent.keyboard("{ArrowUp}");

      expect(optionByLabel("Cherry")).toHaveAttribute("data-focused", "true");
    });

    it("selects the focused option with Enter", async () => {
      const onChange = vi.fn();
      render(<Fruits onChange={onChange} />);

      await userEvent.click(trigger());
      await userEvent.keyboard("{ArrowDown}{Enter}");

      expect(onChange).toHaveBeenCalledWith("banana");
      expect(menu()).toBeNull();
    });

    it("closes the menu on Escape", async () => {
      render(<Fruits />);

      await userEvent.click(trigger());
      await userEvent.keyboard("{Escape}");

      expect(menu()).toBeNull();
    });
  });

  describe("multiple", () => {
    it("keeps the menu open after a selection", async () => {
      render(<Fruits multiple />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));

      expect(menu()).toBeInTheDocument();
    });

    it("collects several values", async () => {
      const onChange = vi.fn();
      render(<Fruits multiple onChange={onChange} />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));
      await userEvent.click(optionByLabel("Cherry"));

      expect(onChange).toHaveBeenLastCalledWith(["apple", "cherry"]);
    });

    it("renders a chip per selected value", async () => {
      render(<Fruits multiple />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));
      await userEvent.click(optionByLabel("Cherry"));

      const chips = trigger().querySelectorAll(".GeckoUISelectButton__multiselected-chip");
      expect(Array.from(chips).map((c) => c.textContent)).toEqual(["Apple", "Cherry"]);
    });

    it("unselects an already selected option", async () => {
      const onChange = vi.fn();
      render(<Fruits multiple onChange={onChange} />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));
      await userEvent.click(optionByLabel("Apple"));

      expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it("removes a value from its chip button", async () => {
      const onChange = vi.fn();
      render(<Fruits multiple onChange={onChange} />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));
      await userEvent.click(
        trigger().querySelector(".GeckoUISelectButton__multiselected-chip__clear-button")!
      );

      expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it("removes the last value on Backspace with an empty keyword", async () => {
      const onChange = vi.fn();
      render(<Fruits multiple filterable onChange={onChange} />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));
      await userEvent.click(optionByLabel("Cherry"));
      searchInput().focus();
      await userEvent.keyboard("{Backspace}");

      expect(onChange).toHaveBeenLastCalledWith(["apple"]);
    });
  });

  describe("clearable", () => {
    it("shows no clear button without a value", async () => {
      render(<Fruits clearable />);

      expect(trigger().querySelector(".GeckoUISelectButton__clear-button")).toBeNull();
    });

    it("shows a clear button once a value is picked", async () => {
      render(<Fruits clearable />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));

      expect(trigger().querySelector(".GeckoUISelectButton__clear-button")).toBeInTheDocument();
    });

    it("clears a single value", async () => {
      const onChange = vi.fn();
      render(<Fruits clearable onChange={onChange} />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));
      await userEvent.click(trigger().querySelector(".GeckoUISelectButton__clear-button")!);

      expect(onChange).toHaveBeenLastCalledWith(undefined);
    });

    it("clears every value when multiple", async () => {
      const onChange = vi.fn();
      render(<Fruits multiple clearable onChange={onChange} />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));
      await userEvent.click(trigger().querySelector(".GeckoUISelectButton__clear-button")!);

      expect(onChange).toHaveBeenLastCalledWith([]);
    });

    it("renders no clear button when not clearable", async () => {
      render(<Fruits />);

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));

      expect(trigger().querySelector(".GeckoUISelectButton__clear-button")).toBeNull();
    });
  });

  describe("filtering", () => {
    it("filters options from the inline search", async () => {
      render(<Fruits filterable />);

      await userEvent.click(trigger());
      await userEvent.keyboard("an");

      expect(options().map((o) => o.textContent)).toEqual(["Banana"]);
    });

    it("shows the default empty message when nothing matches", async () => {
      render(<Fruits filterable />);

      await userEvent.click(trigger());
      await userEvent.keyboard("zzz");

      expect(document.querySelector(".GeckoUISelectEmpty")).toHaveTextContent("No options");
    });

    it("renders a custom empty message", async () => {
      render(
        <Select value={undefined} onChange={() => {}} filterable>
          <SelectOption value="apple" label="Apple" />
          <SelectEmpty>No fruits found</SelectEmpty>
        </Select>
      );

      await userEvent.click(trigger());
      await userEvent.keyboard("zzz");

      expect(screen.getByText("No fruits found")).toBeInTheDocument();
    });

    it("hides the default empty message when asked", async () => {
      render(<Fruits filterable hideDefaultEmptyUI />);

      await userEvent.click(trigger());
      await userEvent.keyboard("zzz");

      expect(document.querySelector(".GeckoUISelectEmpty")).toBeNull();
    });

    it("clears the keyword when the menu closes", async () => {
      render(<Fruits filterable />);

      await userEvent.click(trigger());
      await userEvent.keyboard("an");
      await userEvent.keyboard("{Escape}");
      await userEvent.click(trigger());

      expect(searchInput()).toHaveValue("");
      expect(options()).toHaveLength(3);
    });

    it("filters from a dropdown search box", async () => {
      render(<Fruits filterable="dropdown" />);

      await userEvent.click(trigger());
      const search = menu()!.querySelector<HTMLInputElement>(".GeckoUISelectDropdownSearch input")!;
      await userEvent.type(search, "ap");

      expect(options().map((o) => o.textContent)).toEqual(["Apple"]);
    });

    it("keeps an always visible option while filtering", async () => {
      render(
        <Select value={undefined} onChange={() => {}} filterable>
          <SelectOption value="apple" label="Apple" />
          <SelectOption value="new" label="+ Add new" visibility="always" />
        </Select>
      );

      await userEvent.click(trigger());
      await userEvent.keyboard("zzz");

      expect(options().map((o) => o.textContent)).toEqual(["+ Add new"]);
    });

    it("shows an empty-only option just when nothing matches", async () => {
      render(
        <Select value={undefined} onChange={() => {}} filterable>
          <SelectOption value="apple" label="Apple" />
          <SelectOption value="create" label="Create one" visibility="empty" />
        </Select>
      );

      await userEvent.click(trigger());
      expect(options().map((o) => o.textContent)).toEqual(["Apple"]);

      await userEvent.keyboard("zzz");
      expect(options().map((o) => o.textContent)).toEqual(["Create one"]);
    });
  });

  describe("SelectOption customisation", () => {
    it("renders custom content from a render function", async () => {
      render(
        <Select value="apple" onChange={() => {}}>
          <SelectOption value="apple" label="Apple">
            {({ selected }) => <span data-testid="custom">{selected ? "picked" : "not"}</span>}
          </SelectOption>
        </Select>
      );

      await userEvent.click(trigger());

      expect(screen.getByTestId("custom")).toHaveTextContent("picked");
    });

    it("hides the check icon when asked", async () => {
      render(
        <Select value={undefined} onChange={() => {}}>
          <SelectOption value="apple" label="Apple" hideCheckIcon />
        </Select>
      );

      await userEvent.click(trigger());

      expect(optionByLabel("Apple").querySelector(".GeckoUISelectOption__check-icon")).toBeNull();
    });

    it("runs a custom onClick alongside the default selection", async () => {
      const onClick = vi.fn();
      const onChange = vi.fn();
      render(
        <Select value={undefined} onChange={onChange}>
          <SelectOption value="apple" label="Apple" onClick={onClick} />
        </Select>
      );

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith("apple");
    });

    it("skips the default selection when onClick calls preventDefault", async () => {
      const onChange = vi.fn();
      render(
        <Select value={undefined} onChange={onChange}>
          <SelectOption
            value="apple"
            label="Apple"
            onClick={({ preventDefault }) => preventDefault()}
          />
        </Select>
      );

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("accepts a className function", async () => {
      render(
        <Select value="apple" onChange={() => {}}>
          <SelectOption
            value="apple"
            label="Apple"
            className={({ selected }) => (selected ? "is-selected" : "is-not")}
          />
        </Select>
      );

      await userEvent.click(trigger());

      expect(optionByLabel("Apple")).toHaveClass("is-selected");
    });

    it("calls onRemove instead of onClick for a selected option when multiple", async () => {
      const onRemove = vi.fn();
      const onClick = vi.fn();
      render(
        <Select multiple value={["apple"]} onChange={() => {}}>
          <SelectOption value="apple" label="Apple" onClick={onClick} onRemove={onRemove} />
        </Select>
      );

      await userEvent.click(trigger());
      await userEvent.click(optionByLabel("Apple"));

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("SelectTrigger", () => {
    it("replaces the default trigger", async () => {
      render(
        <Select value={undefined} onChange={() => {}}>
          <SelectTrigger>
            {({ openMenu }) => (
              <button type="button" onClick={openMenu}>
                Custom trigger
              </button>
            )}
          </SelectTrigger>
          <SelectOption value="apple" label="Apple" />
        </Select>
      );

      expect(document.querySelector(".GeckoUISelectButton")).toBeNull();

      await userEvent.click(screen.getByRole("button", { name: "Custom trigger" }));

      expect(menu()).toBeInTheDocument();
    });

    it("reports the selected option", () => {
      render(
        <Select value="apple" onChange={() => {}}>
          <SelectTrigger>
            {({ selectedOptions }) => <span>{(selectedOptions as { label: string })?.label}</span>}
          </SelectTrigger>
          <SelectOption value="apple" label="Apple" />
        </Select>
      );

      expect(screen.getByText("Apple")).toBeInTheDocument();
    });

    it("reports every selected option when multiple", () => {
      render(
        <Select multiple value={["apple", "cherry"]} onChange={() => {}}>
          <SelectTrigger multiple>
            {({ selectedOptions }) => (
              <span>{(selectedOptions as { label: string }[]).map((o) => o.label).join(",")}</span>
            )}
          </SelectTrigger>
          <SelectOption value="apple" label="Apple" />
          <SelectOption value="banana" label="Banana" />
          <SelectOption value="cherry" label="Cherry" />
        </Select>
      );

      expect(screen.getByText("Apple,Cherry")).toBeInTheDocument();
    });
  });

  describe("classes", () => {
    it("applies wrapperClassName and menuClassName", async () => {
      const { container } = render(<Fruits wrapperClassName="wrap" menuClassName="panel" />);

      expect(container.querySelector(".GeckoUISelect")).toHaveClass("wrap");

      await userEvent.click(trigger());

      expect(menu()).toHaveClass("GeckoUISelectMenu", "panel");
    });
  });
});
