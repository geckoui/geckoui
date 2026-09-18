import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Tab, TabList, TabPanel, Tabs, useTabs } from ".";

const tabs = () => Array.from(document.querySelectorAll<HTMLElement>("[data-gecko-tab]"));
const tabByName = (name: string) => tabs().find((t) => t.textContent === name)!;
const panels = () => Array.from(document.querySelectorAll<HTMLElement>(".GeckoUITabs__panel"));
const list = () => document.querySelector<HTMLElement>(".GeckoUITabs__list")!;
const root = () => document.querySelector<HTMLElement>(".GeckoUITabs")!;
const selectedName = () => tabs().find((t) => t.dataset.state === "selected")?.textContent;

function Basic({ children, ...rest }: Record<string, unknown> = {}) {
  return (
    <Tabs {...rest}>
      <TabList>
        <Tab value="a">A</Tab>
        <Tab value="b">B</Tab>
        <Tab value="c">C</Tab>
      </TabList>

      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
      <TabPanel value="c">Panel C</TabPanel>
      {children as never}
    </Tabs>
  );
}

describe("Tabs", () => {
  describe("rendering", () => {
    it("renders a tablist with one tab each", () => {
      render(<Basic />);

      expect(list()).toHaveAttribute("role", "tablist");
      expect(tabs().map((t) => t.textContent)).toEqual(["A", "B", "C"]);
    });

    it("renders only the selected panel", () => {
      render(<Basic />);

      expect(panels().map((p) => p.textContent)).toEqual(["Panel A"]);
    });

    it("marks the variant, size and orientation on the container", () => {
      render(<Basic variant="segmented" size="lg" orientation="vertical" fullWidth />);

      expect(root()).toHaveAttribute("data-variant", "segmented");
      expect(root()).toHaveAttribute("data-size", "lg");
      expect(root()).toHaveAttribute("data-orientation", "vertical");
      expect(root()).toHaveAttribute("data-full-width", "true");
    });

    it("defaults to the underline variant, md size and horizontal", () => {
      render(<Basic />);

      expect(root()).toHaveAttribute("data-variant", "underline");
      expect(root()).toHaveAttribute("data-size", "md");
      expect(root()).toHaveAttribute("data-orientation", "horizontal");
      expect(root()).not.toHaveAttribute("data-full-width");
    });

    it("passes className and other attributes through", () => {
      render(<Basic className="custom" id="account" />);

      expect(root()).toHaveClass("GeckoUITabs", "custom");
      expect(root()).toHaveAttribute("id", "account");
    });

    it("lets TabList take its own class and attributes", () => {
      render(
        <Tabs defaultValue="a">
          <TabList className="strip" data-testid="strip">
            <Tab value="a">A</Tab>
          </TabList>
        </Tabs>
      );

      expect(list()).toHaveClass("GeckoUITabs__list", "strip");
      expect(screen.getByTestId("strip")).toBe(list());
    });

    it("finds tabs even when TabList is wrapped in other markup", () => {
      render(
        <Tabs>
          <header>
            <h1>Settings</h1>
            <TabList>
              <Tab value="a">A</Tab>
              <Tab value="b">B</Tab>
            </TabList>
          </header>
          <main>
            <TabPanel value="a">Panel A</TabPanel>
            <TabPanel value="b">Panel B</TabPanel>
          </main>
        </Tabs>
      );

      expect(document.querySelector("header .GeckoUITabs__list")).toBeInTheDocument();
      expect(document.querySelector("main .GeckoUITabs__panel")).toBeInTheDocument();
      expect(selectedName()).toBe("A");
    });
  });

  describe("selection", () => {
    it("selects the first tab when nothing is given", () => {
      render(<Basic />);

      expect(selectedName()).toBe("A");
    });

    it("selects the first tab that is not disabled", () => {
      render(
        <Tabs>
          <TabList>
            <Tab value="a" disabled>
              A
            </Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      );

      expect(selectedName()).toBe("B");
    });

    it("honours defaultValue", () => {
      render(<Basic defaultValue="c" />);

      expect(selectedName()).toBe("C");
      expect(panels().map((p) => p.textContent)).toEqual(["Panel C"]);
    });

    it("selects on click and swaps the panel", async () => {
      render(<Basic />);

      await userEvent.click(tabByName("B"));

      expect(selectedName()).toBe("B");
      expect(panels().map((p) => p.textContent)).toEqual(["Panel B"]);
    });

    it("calls onChange with the value that was picked", async () => {
      const onChange = vi.fn();
      render(<Basic onChange={onChange} />);

      await userEvent.click(tabByName("B"));

      expect(onChange).toHaveBeenCalledWith("b");
    });

    it("follows a controlled value and ignores its own clicks", async () => {
      const onChange = vi.fn();
      render(<Basic value="c" onChange={onChange} />);

      expect(selectedName()).toBe("C");

      await userEvent.click(tabByName("A"));

      expect(onChange).toHaveBeenCalledWith("a");
      expect(selectedName()).toBe("C");
    });

    it("updates when a controlled value changes", async () => {
      function Controlled() {
        const [value, setValue] = useState("a");
        return (
          <>
            <button type="button" onClick={() => setValue("b")}>
              outside
            </button>
            <Basic value={value} onChange={setValue} />
          </>
        );
      }

      render(<Controlled />);
      await userEvent.click(screen.getByRole("button", { name: "outside" }));

      expect(selectedName()).toBe("B");
    });

    it("does not select a disabled tab", async () => {
      const onChange = vi.fn();
      render(
        <Tabs onChange={onChange}>
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b" disabled>
              B
            </Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      );

      await userEvent.click(tabByName("B"));

      expect(onChange).not.toHaveBeenCalled();
      expect(selectedName()).toBe("A");
    });

    it("marks a disabled tab", () => {
      render(
        <Tabs>
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b" disabled>
              B
            </Tab>
          </TabList>
        </Tabs>
      );

      expect(tabByName("B")).toHaveAttribute("data-disabled", "true");
      expect(tabByName("B")).toBeDisabled();
      expect(tabByName("A")).not.toHaveAttribute("data-disabled");
    });
  });

  describe("keyboard", () => {
    const withDisabled = (
      <Tabs>
        <TabList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
          <Tab value="c" disabled>
            C
          </Tab>
          <Tab value="d">D</Tab>
        </TabList>
        <TabPanel value="a">Panel A</TabPanel>
        <TabPanel value="b">Panel B</TabPanel>
        <TabPanel value="c">Panel C</TabPanel>
        <TabPanel value="d">Panel D</TabPanel>
      </Tabs>
    );

    it("moves focus with the arrow keys without changing the panel", async () => {
      render(withDisabled);

      await userEvent.click(tabByName("A"));
      await userEvent.keyboard("{ArrowRight}");

      expect(tabByName("B")).toHaveFocus();
      expect(selectedName()).toBe("A");
    });

    it("skips disabled tabs", async () => {
      render(withDisabled);

      await userEvent.click(tabByName("A"));
      await userEvent.keyboard("{ArrowRight}{ArrowRight}");

      expect(tabByName("D")).toHaveFocus();
    });

    it("wraps at both ends", async () => {
      render(withDisabled);

      await userEvent.click(tabByName("A"));
      await userEvent.keyboard("{ArrowLeft}");
      expect(tabByName("D")).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      expect(tabByName("A")).toHaveFocus();
    });

    it("jumps to the ends with Home and End", async () => {
      render(withDisabled);

      await userEvent.click(tabByName("B"));
      await userEvent.keyboard("{End}");
      expect(tabByName("D")).toHaveFocus();

      await userEvent.keyboard("{Home}");
      expect(tabByName("A")).toHaveFocus();
    });

    it("selects the focused tab with Enter", async () => {
      render(withDisabled);

      await userEvent.click(tabByName("A"));
      await userEvent.keyboard("{ArrowRight}{Enter}");

      expect(selectedName()).toBe("B");
    });

    it("selects the focused tab with Space", async () => {
      render(withDisabled);

      await userEvent.click(tabByName("A"));
      await userEvent.keyboard("{ArrowRight} ");

      expect(selectedName()).toBe("B");
    });

    it("uses up and down when vertical, and ignores left and right", async () => {
      render(
        <Tabs orientation="vertical">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      );

      await userEvent.click(tabByName("A"));
      await userEvent.keyboard("{ArrowDown}");
      expect(tabByName("B")).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      expect(tabByName("B")).toHaveFocus();
    });

    it("keeps only the selected tab in the tab order", () => {
      render(<Basic defaultValue="b" />);

      expect(tabs().map((t) => t.tabIndex)).toEqual([-1, 0, -1]);
    });

    it("moves the tab stop with the selection", async () => {
      render(<Basic />);

      await userEvent.click(tabByName("C"));

      expect(tabs().map((t) => t.tabIndex)).toEqual([-1, -1, 0]);
    });
  });

  describe("keepMounted", () => {
    it("unmounts hidden panels by default", () => {
      render(<Basic />);

      expect(panels()).toHaveLength(1);
    });

    it("keeps every panel mounted when set on Tabs", () => {
      render(<Basic keepMounted />);

      expect(panels().map((p) => `${p.textContent}${p.hidden ? ":hidden" : ""}`)).toEqual([
        "Panel A",
        "Panel B:hidden",
        "Panel C:hidden"
      ]);
    });

    it("keeps one panel mounted when set on that panel", () => {
      render(
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b" keepMounted>
            Panel B
          </TabPanel>
        </Tabs>
      );

      expect(panels().map((p) => p.textContent)).toEqual(["Panel A", "Panel B"]);
    });

    it("keeps form state across a switch when mounted", async () => {
      render(
        <Tabs defaultValue="a" keepMounted>
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">
            <input aria-label="field" />
          </TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      );

      await userEvent.type(screen.getByLabelText("field"), "typed");
      await userEvent.click(tabByName("B"));
      await userEvent.click(tabByName("A"));

      expect(screen.getByLabelText("field")).toHaveValue("typed");
    });

    it("loses form state across a switch when unmounted", async () => {
      render(
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabList>
          <TabPanel value="a">
            <input aria-label="field" />
          </TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </Tabs>
      );

      await userEvent.type(screen.getByLabelText("field"), "typed");
      await userEvent.click(tabByName("B"));
      await userEvent.click(tabByName("A"));

      expect(screen.getByLabelText("field")).toHaveValue("");
    });
  });

  describe("accessibility", () => {
    it("wires each tab to its panel", () => {
      render(<Basic />);

      const tab = tabByName("A");
      const panel = panels()[0];

      expect(tab).toHaveAttribute("role", "tab");
      expect(panel).toHaveAttribute("role", "tabpanel");
      expect(tab).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    });

    it("reports which tab is selected", async () => {
      render(<Basic />);

      expect(tabByName("A")).toHaveAttribute("aria-selected", "true");
      expect(tabByName("B")).toHaveAttribute("aria-selected", "false");

      await userEvent.click(tabByName("B"));

      expect(tabByName("B")).toHaveAttribute("aria-selected", "true");
    });

    it("reports the orientation on the tablist", () => {
      render(<Basic orientation="vertical" />);

      expect(list()).toHaveAttribute("aria-orientation", "vertical");
    });
  });

  describe("as navigation", () => {
    const nav = (
      <Tabs as="nav" value="/b">
        <TabList>
          <Tab value="/a" asChild>
            <a href="/a">A</a>
          </Tab>
          <Tab value="/b" asChild>
            <a href="/b">B</a>
          </Tab>
        </TabList>
      </Tabs>
    );

    it("renders a nav landmark rather than a tablist", () => {
      render(nav);

      expect(document.querySelector("nav")).toBeInTheDocument();
      expect(document.querySelector("[role=tablist]")).toBeNull();
      expect(document.querySelector("[role=tab]")).toBeNull();
    });

    it("marks the current page rather than a selected tab", () => {
      render(nav);

      expect(tabByName("B")).toHaveAttribute("aria-current", "page");
      expect(tabByName("A")).not.toHaveAttribute("aria-current");
      expect(tabByName("B")).not.toHaveAttribute("aria-selected");
    });

    it("keeps every link in the tab order", () => {
      render(nav);

      expect(tabs().map((t) => t.tabIndex)).toEqual([0, 0]);
    });

    it("leaves the arrow keys to the browser", async () => {
      render(nav);

      tabByName("A").focus();
      await userEvent.keyboard("{ArrowRight}");

      expect(tabByName("A")).toHaveFocus();
    });

    it("renders no panels", () => {
      render(nav);

      expect(panels()).toHaveLength(0);
    });
  });

  describe("asChild", () => {
    it("renders the child instead of a button", () => {
      render(
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a" asChild>
              <a href="/a">A</a>
            </Tab>
          </TabList>
        </Tabs>
      );

      expect(tabByName("A").tagName).toBe("A");
      expect(tabByName("A")).toHaveAttribute("href", "/a");
    });

    it("keeps the child's own class alongside the tab class", () => {
      render(
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a" asChild className="given-to-tab">
              <a href="/a" className="own-class">
                A
              </a>
            </Tab>
          </TabList>
        </Tabs>
      );

      expect(tabByName("A")).toHaveClass("GeckoUITabs__tab", "own-class", "given-to-tab");
    });

    // classNames runs through tailwind-merge, so two classes that look like the same
    // Tailwind utility collide and the last one wins. That is library-wide behaviour
    // rather than anything specific to Tab, but it surprises people.
    it("lets tailwind-merge resolve a genuine utility clash", () => {
      render(
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a" asChild className="p-4">
              <a href="/a" className="p-2">
                A
              </a>
            </Tab>
          </TabList>
        </Tabs>
      );

      expect(tabByName("A")).toHaveClass("p-4");
      expect(tabByName("A")).not.toHaveClass("p-2");
    });

    it("hands the child the state and aria wiring", () => {
      render(
        <Tabs defaultValue="a">
          <TabList>
            <Tab value="a" asChild>
              <a href="/a">A</a>
            </Tab>
          </TabList>
          <TabPanel value="a">Panel A</TabPanel>
        </Tabs>
      );

      const tab = tabByName("A");
      expect(tab).toHaveAttribute("data-state", "selected");
      expect(tab).toHaveAttribute("role", "tab");
      expect(tab).toHaveAttribute("aria-controls", panels()[0].id);
    });
  });

  describe("useTabs", () => {
    it("throws when used outside a Tabs", () => {
      const Outside = () => {
        useTabs();
        return null;
      };
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => render(<Outside />)).toThrow("useTabs must be used within a Tabs");

      spy.mockRestore();
    });

    it("reports the selected value to anything inside", async () => {
      const Readout = () => {
        const { selectedValue } = useTabs();
        return <p>showing {selectedValue}</p>;
      };

      render(<Basic>{<Readout />}</Basic>);
      await userEvent.click(tabByName("B"));

      expect(screen.getByText("showing b")).toBeInTheDocument();
    });
  });

  describe("scrolling the strip", () => {
    // jsdom reports no layout, so the rectangles are stubbed. This checks the maths
    // that centres the selected tab, not that the browser scrolls.
    const overflowing = (scrollTo: ReturnType<typeof vi.fn>) => {
      const strip = list();
      strip.scrollTo = scrollTo as never;
      Object.defineProperty(strip, "scrollWidth", { value: 1200, configurable: true });
      Object.defineProperty(strip, "clientWidth", { value: 400, configurable: true });
      Object.defineProperty(strip, "scrollLeft", { value: 100, configurable: true });
      strip.getBoundingClientRect = () => ({ left: 200, top: 0, width: 400, height: 40 }) as DOMRect;
    };

    it("centres the selected tab when the strip overflows", async () => {
      const scrollTo = vi.fn();
      render(<Basic />);
      overflowing(scrollTo);

      const target = tabByName("C");
      target.getBoundingClientRect = () =>
        ({ left: 320, top: 0, width: 80, height: 40 }) as DOMRect;

      await userEvent.click(target);

      // scrollLeft 100 + (320 - 200) - (400 - 80) / 2
      await waitFor(() => expect(scrollTo).toHaveBeenLastCalledWith({ left: 60, behavior: "smooth" }));
    });

    it("leaves the strip alone when the tabs fit", async () => {
      const scrollTo = vi.fn();
      render(<Basic />);

      const strip = list();
      strip.scrollTo = scrollTo as never;
      Object.defineProperty(strip, "scrollWidth", { value: 300, configurable: true });
      Object.defineProperty(strip, "clientWidth", { value: 300, configurable: true });

      await userEvent.click(tabByName("B"));

      expect(scrollTo).not.toHaveBeenCalled();
    });
  });
});
