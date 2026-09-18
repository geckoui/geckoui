import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  useAccordion,
  useAccordionItem
} from ".";
import type { AccordionValue } from ".";

const items = () => Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIAccordion__item"));
const headers = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-gecko-accordion-header]"));
const headerByName = (name: string) => screen.getByRole("button", { name: new RegExp(name) });
const panels = () => Array.from(document.querySelectorAll<HTMLElement>(".GeckoUIAccordion__panel"));
const openValues = () =>
  items()
    .filter((i) => i.dataset.state === "open")
    .map((i) => i.querySelector("[data-gecko-accordion-header]")?.textContent?.trim());
const root = () => document.querySelector<HTMLElement>(".GeckoUIAccordion")!;

function Faq({ children, ...rest }: Record<string, unknown> = {}) {
  return (
    <Accordion {...rest}>
      <AccordionItem value="shipping">
        <AccordionHeader>Shipping</AccordionHeader>
        <AccordionPanel>Ships in two days.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionHeader>Returns</AccordionHeader>
        <AccordionPanel>Thirty days.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="warranty">
        <AccordionHeader>Warranty</AccordionHeader>
        <AccordionPanel>Two years.</AccordionPanel>
      </AccordionItem>
      {children as never}
    </Accordion>
  );
}

describe("Accordion", () => {
  describe("rendering", () => {
    it("renders a header and a panel per item", () => {
      render(<Faq />);

      expect(items()).toHaveLength(3);
      expect(headers().map((h) => h.textContent?.trim())).toEqual([
        "Shipping",
        "Returns",
        "Warranty"
      ]);
    });

    it("starts with everything closed when nothing is given", () => {
      render(<Faq />);

      expect(openValues()).toEqual([]);
    });

    it("marks the variant and size on the container", () => {
      render(<Faq variant="contained" size="lg" />);

      expect(root()).toHaveAttribute("data-variant", "contained");
      expect(root()).toHaveAttribute("data-size", "lg");
    });

    it("defaults to the plain variant and md size", () => {
      render(<Faq />);

      expect(root()).toHaveAttribute("data-variant", "plain");
      expect(root()).toHaveAttribute("data-size", "md");
    });

    it("marks each item open or closed", () => {
      render(<Faq defaultValue="returns" />);

      expect(items().map((i) => i.dataset.state)).toEqual(["closed", "open", "closed"]);
    });

    it("passes className and attributes through", () => {
      render(<Faq className="custom" id="faq" />);

      expect(root()).toHaveClass("GeckoUIAccordion", "custom");
      expect(root()).toHaveAttribute("id", "faq");
    });
  });

  describe("one at a time", () => {
    it("opens on click", async () => {
      render(<Faq />);

      await userEvent.click(headerByName("Shipping"));

      expect(openValues()).toEqual(["Shipping"]);
    });

    it("closes whatever was open when another opens", async () => {
      render(<Faq defaultValue="shipping" />);

      await userEvent.click(headerByName("Returns"));

      expect(openValues()).toEqual(["Returns"]);
    });

    it("honours defaultValue", () => {
      render(<Faq defaultValue="warranty" />);

      expect(openValues()).toEqual(["Warranty"]);
    });

    it("reports the open value", async () => {
      const onChange = vi.fn();
      render(<Faq onChange={onChange} />);

      await userEvent.click(headerByName("Returns"));

      expect(onChange).toHaveBeenCalledWith("returns");
    });
  });

  describe("collapsible", () => {
    it("closes the open item on a second click", async () => {
      render(<Faq defaultValue="shipping" />);

      await userEvent.click(headerByName("Shipping"));

      expect(openValues()).toEqual([]);
    });

    it("reports an empty string when the last one closes", async () => {
      const onChange = vi.fn();
      render(<Faq defaultValue="shipping" onChange={onChange} />);

      await userEvent.click(headerByName("Shipping"));

      expect(onChange).toHaveBeenCalledWith("");
    });

    it("keeps one open when collapsible is off", async () => {
      const onChange = vi.fn();
      render(<Faq defaultValue="shipping" collapsible={false} onChange={onChange} />);

      await userEvent.click(headerByName("Shipping"));

      expect(openValues()).toEqual(["Shipping"]);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("still swaps between items when collapsible is off", async () => {
      render(<Faq defaultValue="shipping" collapsible={false} />);

      await userEvent.click(headerByName("Returns"));

      expect(openValues()).toEqual(["Returns"]);
    });
  });

  describe("multiple", () => {
    it("opens several at once", async () => {
      render(<Faq multiple />);

      await userEvent.click(headerByName("Shipping"));
      await userEvent.click(headerByName("Returns"));

      expect(openValues()).toEqual(["Shipping", "Returns"]);
    });

    it("takes an array as defaultValue", () => {
      render(<Faq multiple defaultValue={["shipping", "warranty"]} />);

      expect(openValues()).toEqual(["Shipping", "Warranty"]);
    });

    it("reports an array", async () => {
      const onChange = vi.fn();
      render(<Faq multiple onChange={onChange} />);

      await userEvent.click(headerByName("Shipping"));
      await userEvent.click(headerByName("Returns"));

      expect(onChange).toHaveBeenLastCalledWith(["shipping", "returns"]);
    });

    it("closes one without touching the others", async () => {
      const onChange = vi.fn();
      render(<Faq multiple defaultValue={["shipping", "returns"]} onChange={onChange} />);

      await userEvent.click(headerByName("Shipping"));

      expect(openValues()).toEqual(["Returns"]);
      expect(onChange).toHaveBeenLastCalledWith(["returns"]);
    });
  });

  describe("controlled", () => {
    it("follows the value it is given", async () => {
      const onChange = vi.fn();
      render(<Faq value="warranty" onChange={onChange} />);

      expect(openValues()).toEqual(["Warranty"]);

      await userEvent.click(headerByName("Shipping"));

      expect(onChange).toHaveBeenCalledWith("shipping");
      expect(openValues()).toEqual(["Warranty"]);
    });

    it("updates when the value changes from outside", async () => {
      function Controlled() {
        const [value, setValue] = useState<AccordionValue>("shipping");
        return (
          <>
            <button type="button" onClick={() => setValue("returns")}>
              outside
            </button>
            <Faq value={value} onChange={setValue} />
          </>
        );
      }

      render(<Controlled />);
      await userEvent.click(screen.getByRole("button", { name: "outside" }));

      expect(openValues()).toEqual(["Returns"]);
    });
  });

  describe("disabled", () => {
    const withDisabled = (
      <Accordion>
        <AccordionItem value="a">
          <AccordionHeader>Alpha</AccordionHeader>
          <AccordionPanel>A</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b" disabled>
          <AccordionHeader>Beta</AccordionHeader>
          <AccordionPanel>B</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    it("cannot be opened", async () => {
      render(withDisabled);

      await userEvent.click(headerByName("Beta"));

      expect(openValues()).toEqual([]);
    });

    it("is marked on the item and the header", () => {
      render(withDisabled);

      expect(items()[1]).toHaveAttribute("data-disabled", "true");
      expect(headerByName("Beta")).toBeDisabled();
      expect(items()[0]).not.toHaveAttribute("data-disabled");
    });
  });

  describe("keyboard", () => {
    const four = (
      <Accordion>
        <AccordionItem value="a">
          <AccordionHeader>Alpha</AccordionHeader>
          <AccordionPanel>A</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>Beta</AccordionHeader>
          <AccordionPanel>B</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="c" disabled>
          <AccordionHeader>Gamma</AccordionHeader>
          <AccordionPanel>C</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="d">
          <AccordionHeader>Delta</AccordionHeader>
          <AccordionPanel>D</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    it("moves between headers with the arrow keys", async () => {
      render(four);

      headerByName("Alpha").focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(headerByName("Beta")).toHaveFocus();

      await userEvent.keyboard("{ArrowUp}");
      expect(headerByName("Alpha")).toHaveFocus();
    });

    it("skips a disabled header", async () => {
      render(four);

      headerByName("Beta").focus();
      await userEvent.keyboard("{ArrowDown}");

      expect(headerByName("Delta")).toHaveFocus();
    });

    it("wraps at both ends", async () => {
      render(four);

      headerByName("Alpha").focus();
      await userEvent.keyboard("{ArrowUp}");
      expect(headerByName("Delta")).toHaveFocus();

      await userEvent.keyboard("{ArrowDown}");
      expect(headerByName("Alpha")).toHaveFocus();
    });

    it("jumps to the ends with Home and End", async () => {
      render(four);

      headerByName("Beta").focus();
      await userEvent.keyboard("{End}");
      expect(headerByName("Delta")).toHaveFocus();

      await userEvent.keyboard("{Home}");
      expect(headerByName("Alpha")).toHaveFocus();
    });

    it("opens with Enter and Space", async () => {
      render(four);

      headerByName("Alpha").focus();
      await userEvent.keyboard("{Enter}");
      expect(openValues()).toEqual(["Alpha"]);

      await userEvent.keyboard(" ");
      expect(openValues()).toEqual([]);
    });

    it("leaves the arrow keys alone inside a panel", async () => {
      render(
        <Accordion defaultValue="a">
          <AccordionItem value="a">
            <AccordionHeader>Alpha</AccordionHeader>
            <AccordionPanel>
              <input aria-label="field" />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionHeader>Beta</AccordionHeader>
            <AccordionPanel>B</AccordionPanel>
          </AccordionItem>
        </Accordion>
      );

      const field = screen.getByLabelText("field");
      await userEvent.type(field, "abc");
      await userEvent.keyboard("{ArrowDown}{ArrowUp}");

      expect(field).toHaveFocus();
      expect(field).toHaveValue("abc");
    });
  });

  describe("keepMounted", () => {
    it("keeps closed panels in the DOM by default", () => {
      render(<Faq defaultValue="shipping" />);

      expect(panels()).toHaveLength(3);
      expect(panels().map((p) => p.dataset.state)).toEqual(["open", "closed", "closed"]);
    });

    it("unmounts closed panels when turned off", () => {
      render(<Faq defaultValue="shipping" keepMounted={false} />);

      expect(panels()).toHaveLength(1);
    });

    it("keeps one panel mounted when set on that panel", () => {
      render(
        <Accordion keepMounted={false}>
          <AccordionItem value="a">
            <AccordionHeader>Alpha</AccordionHeader>
            <AccordionPanel>A</AccordionPanel>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionHeader>Beta</AccordionHeader>
            <AccordionPanel keepMounted>B</AccordionPanel>
          </AccordionItem>
        </Accordion>
      );

      expect(panels()).toHaveLength(1);
      expect(panels()[0]).toHaveTextContent("B");
    });

    it("keeps form state while a panel is closed", async () => {
      render(
        <Accordion defaultValue="a">
          <AccordionItem value="a">
            <AccordionHeader>Alpha</AccordionHeader>
            <AccordionPanel>
              <input aria-label="field" />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionHeader>Beta</AccordionHeader>
            <AccordionPanel>B</AccordionPanel>
          </AccordionItem>
        </Accordion>
      );

      await userEvent.type(screen.getByLabelText("field"), "typed");
      await userEvent.click(headerByName("Beta"));
      await userEvent.click(headerByName("Alpha"));

      expect(screen.getByLabelText("field")).toHaveValue("typed");
    });
  });

  describe("the icon", () => {
    it("renders a chevron by default", () => {
      render(<Faq />);

      expect(document.querySelectorAll(".GeckoUIAccordion__header__icon")).toHaveLength(3);
    });

    it("hides it when asked", () => {
      render(
        <Accordion>
          <AccordionItem value="a">
            <AccordionHeader hideIcon>Alpha</AccordionHeader>
            <AccordionPanel>A</AccordionPanel>
          </AccordionItem>
        </Accordion>
      );

      expect(document.querySelector(".GeckoUIAccordion__header__icon")).toBeNull();
    });

    it("takes one of your own", () => {
      render(
        <Accordion>
          <AccordionItem value="a">
            <AccordionHeader icon={<span data-testid="mine">+</span>}>Alpha</AccordionHeader>
            <AccordionPanel>A</AccordionPanel>
          </AccordionItem>
        </Accordion>
      );

      expect(screen.getByTestId("mine")).toBeInTheDocument();
      expect(document.querySelector(".GeckoUIAccordion__header__icon")).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("wires each header to its panel", async () => {
      render(<Faq defaultValue="shipping" />);

      const header = headerByName("Shipping");
      const panel = panels()[0];

      expect(panel).toHaveAttribute("role", "region");
      expect(header).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", header.id);
    });

    it("reports whether the item is open", async () => {
      render(<Faq />);

      expect(headerByName("Shipping")).toHaveAttribute("aria-expanded", "false");

      await userEvent.click(headerByName("Shipping"));

      expect(headerByName("Shipping")).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("hooks", () => {
    it("useAccordion throws outside an Accordion", () => {
      const Outside = () => {
        useAccordion();
        return null;
      };
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => render(<Outside />)).toThrow("useAccordion must be used within an Accordion");

      spy.mockRestore();
    });

    it("useAccordionItem throws outside an AccordionItem", () => {
      const Outside = () => {
        useAccordionItem();
        return null;
      };
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => render(<Accordion>{<Outside />}</Accordion>)).toThrow(
        "useAccordionItem must be used within an AccordionItem"
      );

      spy.mockRestore();
    });

    it("reports what is open to anything inside", async () => {
      const Readout = () => {
        const { openValues: open } = useAccordion();
        return <p>open: {open.join(",") || "none"}</p>;
      };

      render(<Faq>{<Readout />}</Faq>);
      expect(screen.getByText("open: none")).toBeInTheDocument();

      await userEvent.click(headerByName("Returns"));
      expect(screen.getByText("open: returns")).toBeInTheDocument();
    });
  });
});
