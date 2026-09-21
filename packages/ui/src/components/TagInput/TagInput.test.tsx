import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import TagInput from "./TagInput/TagInput";
import TagInputOption from "./TagInputOption/TagInputOption";

const SUGGESTIONS = ["React", "Vue", "Svelte", "United State"];

const field = () => document.querySelector(".GeckoUITagInput") as HTMLElement;
const input = () => screen.getByRole("combobox");
const tags = () =>
  Array.from(document.querySelectorAll(".GeckoUITagInput__tag")).map((tag) =>
    (tag.textContent ?? "").trim()
  );
const options = () => screen.queryAllByRole("option").map((option) => option.textContent);

const Controlled = ({
  start = [],
  withOptions = false,
  ...rest
}: {
  start?: string[];
  withOptions?: boolean;
} & Record<string, unknown>) => {
  const [value, setValue] = useState(start);

  return (
    <TagInput value={value} onChange={setValue} {...rest}>
      {withOptions
        ? SUGGESTIONS.map((name) => (
            <TagInputOption key={name} value={name}>
              {name}
            </TagInputOption>
          ))
        : null}
    </TagInput>
  );
};

describe("TagInput", () => {
  describe("adding", () => {
    it("turns what is typed into a tag on Enter", async () => {
      render(<Controlled />);

      await userEvent.click(input());
      await userEvent.keyboard("react{Enter}");

      expect(tags()).toEqual(["react"]);
      expect(input()).toHaveValue("");
    });

    it("takes a comma as well, and whatever else is asked for", async () => {
      render(<Controlled separators={["Enter", ",", " "]} />);

      await userEvent.click(input());
      await userEvent.keyboard("one,two three{Enter}");

      expect(tags()).toEqual(["one", "two", "three"]);
    });

    it("finishes the tag being typed when the field is left", async () => {
      render(
        <>
          <Controlled />
          <button type="button">Elsewhere</button>
        </>
      );

      await userEvent.click(input());
      await userEvent.keyboard("react");
      await userEvent.click(screen.getByRole("button", { name: "Elsewhere" }));

      expect(tags()).toEqual(["react"]);
    });

    it("leaves it alone with addOnBlur off", async () => {
      render(
        <>
          <Controlled addOnBlur={false} />
          <button type="button">Elsewhere</button>
        </>
      );

      await userEvent.click(input());
      await userEvent.keyboard("react");
      await userEvent.click(screen.getByRole("button", { name: "Elsewhere" }));

      expect(tags()).toEqual([]);
    });

    it("ignores whitespace on its own", async () => {
      render(<Controlled />);

      await userEvent.click(input());
      await userEvent.keyboard("   {Enter}");

      expect(tags()).toEqual([]);
    });
  });

  describe("removing", () => {
    it("takes one out from its own cross", async () => {
      render(<Controlled start={["react", "vue"]} />);

      await userEvent.click(screen.getByRole("button", { name: "Remove react" }));

      expect(tags()).toEqual(["vue"]);
    });

    it("takes the last one out on backspace in an empty field", async () => {
      render(<Controlled start={["react", "vue"]} />);

      await userEvent.click(input());
      await userEvent.keyboard("{Backspace}");

      expect(tags()).toEqual(["react"]);
    });

    it("leaves the tags alone while there is something typed", async () => {
      render(<Controlled start={["react"]} />);

      await userEvent.click(input());
      await userEvent.keyboard("vu{Backspace}");

      expect(tags()).toEqual(["react"]);
      expect(input()).toHaveValue("v");
    });
  });

  describe("turning tags away", () => {
    it("refuses a duplicate and says so", async () => {
      const onReject = vi.fn();

      render(<Controlled start={["react"]} onReject={onReject} />);

      await userEvent.click(input());
      await userEvent.keyboard("react{Enter}");

      expect(tags()).toEqual(["react"]);
      expect(onReject).toHaveBeenCalledWith(["react"]);
    });

    it("allows one when it is asked to", async () => {
      render(<Controlled start={["react"]} allowDuplicates />);

      await userEvent.click(input());
      await userEvent.keyboard("react{Enter}");

      expect(tags()).toEqual(["react", "react"]);
    });

    it("stops at max", async () => {
      const onReject = vi.fn();

      render(<Controlled start={["one", "two"]} max={2} onReject={onReject} />);

      await userEvent.click(input());
      await userEvent.keyboard("three{Enter}");

      expect(tags()).toEqual(["one", "two"]);
      expect(onReject).toHaveBeenCalledWith(["three"]);
    });

    it("clears the text when there is no room, since correcting it cannot help", async () => {
      render(<Controlled start={["one", "two"]} max={2} />);

      await userEvent.click(input());
      await userEvent.keyboard("three{Enter}");

      expect(input()).toHaveValue("");
    });

    it("marks itself full, so a limit can be shown", async () => {
      render(<Controlled start={["one"]} max={2} />);

      expect(field()).not.toHaveAttribute("data-full");

      await userEvent.click(input());
      await userEvent.keyboard("two{Enter}");

      expect(field()).toHaveAttribute("data-full", "true");
    });

    it("keeps the list away once it is full", async () => {
      render(<Controlled start={["React"]} max={1} withOptions />);

      await userEvent.click(input());

      expect(screen.queryAllByRole("option")).toHaveLength(0);
    });

    it("keeps what validate turned down in the field, so it can be corrected", async () => {
      const onReject = vi.fn();

      render(<Controlled validate={(tag: string) => tag.includes("@")} onReject={onReject} />);

      await userEvent.click(input());
      await userEvent.keyboard("nope{Enter}");

      expect(tags()).toEqual([]);
      expect(input()).toHaveValue("nope");
      expect(onReject).toHaveBeenCalledWith(["nope"]);
    });
  });

  describe("pasting", () => {
    it("makes a tag of each part", async () => {
      render(<Controlled />);

      await userEvent.click(input());
      await userEvent.paste("ada, grace, alan");

      expect(tags()).toEqual(["ada", "grace", "alan"]);
    });

    it("reports the ones it could not take", async () => {
      const onReject = vi.fn();

      render(<Controlled validate={(tag: string) => tag.includes("@")} onReject={onReject} />);

      await userEvent.click(input());
      await userEvent.paste("ada@x.com, nope, grace@x.com");

      expect(tags()).toEqual(["ada@x.com", "grace@x.com"]);
      expect(onReject).toHaveBeenCalledWith(["nope"]);
    });

    it("leaves a single word in the field, so it can still be edited", async () => {
      render(<Controlled />);

      await userEvent.click(input());
      await userEvent.paste("react");

      expect(tags()).toEqual([]);
      expect(input()).toHaveValue("react");
    });
  });

  describe("options", () => {
    it("shows them all, and filters as you type", async () => {
      render(<Controlled withOptions />);

      await userEvent.click(input());

      expect(options()).toEqual(SUGGESTIONS);

      await userEvent.keyboard("vu");

      expect(options()).toEqual(["Vue"]);
    });

    it("drops one out of the list once it is a tag", async () => {
      render(<Controlled start={["React"]} withOptions />);

      await userEvent.click(input());

      expect(options()).not.toContain("React");
    });

    it("adds one when it is picked, and keeps the focus in the field", async () => {
      render(<Controlled withOptions />);

      await userEvent.click(input());
      await userEvent.click(screen.getByRole("option", { name: "Vue" }));

      expect(tags()).toEqual(["Vue"]);
      expect(input()).toHaveFocus();
    });

    it("adds only the option when one was typed towards", async () => {
      // the pointer going down on an option used to blur the field first, so addOnBlur
      // committed the half typed word before the click added the option
      render(<Controlled withOptions />);

      await userEvent.click(input());
      await userEvent.keyboard("vue");
      await userEvent.click(screen.getByRole("option", { name: "Vue" }));

      expect(tags()).toEqual(["Vue"]);
    });

    it("walks the list with the arrows and takes one on Enter", async () => {
      render(<Controlled withOptions />);

      await userEvent.click(input());
      await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");

      expect(tags()).toEqual(["Vue"]);
    });

    it("stays away once there is nothing left to show", async () => {
      render(<Controlled withOptions />);

      await userEvent.click(input());
      await userEvent.keyboard("zzz");

      expect(options()).toEqual([]);
    });
  });

  describe("preferOption", () => {
    it.each([
      ["vue", "Vue"],
      ["VUE", "Vue"],
      ["united  state", "United State"],
      ["  React  ", "React"]
    ])("takes the spelling from the option for %s", async (typed, expected) => {
      render(<Controlled withOptions />);

      await userEvent.click(input());
      await userEvent.paste(typed);
      await userEvent.keyboard("{Enter}");

      expect(tags()).toEqual([expected]);
    });

    it("leaves anything that matches no option exactly as typed", async () => {
      render(<Controlled withOptions />);

      await userEvent.click(input());
      await userEvent.keyboard("Something New{Enter}");

      expect(tags()).toEqual(["Something New"]);
    });

    it("makes a differently cased repeat a duplicate", async () => {
      const onReject = vi.fn();

      render(<Controlled start={["Vue"]} withOptions onReject={onReject} />);

      await userEvent.click(input());
      await userEvent.keyboard("VUE{Enter}");

      expect(tags()).toEqual(["Vue"]);
      expect(onReject).toHaveBeenCalledWith(["Vue"]);
    });

    it("adds what was typed when it is turned off", async () => {
      render(<Controlled withOptions preferOption={false} />);

      await userEvent.click(input());
      await userEvent.keyboard("vue{Enter}");

      expect(tags()).toEqual(["vue"]);
    });
  });

  describe("states", () => {
    it.each(["disabled", "readonly"] as const)("adds nothing while %s", async (state) => {
      render(
        <Controlled
          start={["react"]}
          disabled={state === "disabled"}
          readOnly={state === "readonly"}
        />
      );

      await userEvent.click(field());

      expect(screen.queryAllByRole("option")).toHaveLength(0);
      expect(field()).toHaveAttribute("data-state", state);
      expect(screen.queryByRole("button", { name: "Remove react" })).not.toBeInTheDocument();
    });

    it("marks itself in error", () => {
      render(<Controlled hasError />);

      expect(field()).toHaveAttribute("data-error", "true");
    });
  });

  it("draws the tags however it is told to", () => {
    render(
      <Controlled
        start={["react"]}
        renderTag={({ value }: { value: string }) => <b>{value.toUpperCase()}</b>}
      />
    );

    expect(screen.getByText("REACT")).toBeInTheDocument();
    expect(document.querySelector(".GeckoUITagInput__tag")).not.toBeInTheDocument();
  });

  it("shows the placeholder as text, because the field is only as wide as what is typed", async () => {
    render(<Controlled placeholder="Add a tag" />);

    expect(screen.getByText("Add a tag")).toBeInTheDocument();
    expect(input()).not.toHaveAttribute("placeholder");

    await userEvent.click(input());
    await userEvent.keyboard("a");

    // the styles are not loaded here, so the flag the styles key off is what is checked
    expect(screen.getByText("Add a tag")).toHaveAttribute("data-hidden");
  });
});
