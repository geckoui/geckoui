import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Breadcrumb from "./Breadcrumb/Breadcrumb";
import BreadcrumbItem from "./BreadcrumbItem/BreadcrumbItem";

const TRAIL = ["Home", "Library", "Data", "2026", "Q3", "September"];

const trail = (props: Record<string, unknown> = {}, names = TRAIL) => (
  <Breadcrumb {...props}>
    {names.map((name, index) => (
      <BreadcrumbItem key={name} href={index === names.length - 1 ? undefined : `/${name}`}>
        {name}
      </BreadcrumbItem>
    ))}
  </Breadcrumb>
);

const crumbs = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(".GeckoUIBreadcrumb__crumb")).map((crumb) =>
    (crumb.textContent ?? "").trim()
  );

const menu = () => document.querySelector(".GeckoUIBreadcrumb__menu");

describe("Breadcrumb", () => {
  describe("markup", () => {
    it("is a named nav around an ordered list, which is what a reader expects", () => {
      const { container } = render(trail());
      const nav = screen.getByRole("navigation", { name: "Breadcrumb" });

      expect(nav.tagName).toBe("NAV");
      expect(container.querySelector("ol")).toBeInTheDocument();
    });

    it("takes a name of its own", () => {
      render(trail({ "aria-label": "You are here" }));

      expect(screen.getByRole("navigation", { name: "You are here" })).toBeInTheDocument();
    });

    it("puts a separator between the crumbs, and not after the last", () => {
      const { container } = render(trail({}, ["Home", "Docs", "Here"]));

      expect(container.querySelectorAll(".GeckoUIBreadcrumb__separator")).toHaveLength(2);
    });

    it("hides the separators from a reader, which has the list to go on", () => {
      const { container } = render(trail({}, ["Home", "Here"]));

      expect(container.querySelector(".GeckoUIBreadcrumb__separator")).toHaveAttribute(
        "aria-hidden",
        "true"
      );
    });

    it("takes a separator of its own", () => {
      render(trail({ separator: "/" }, ["Home", "Here"]));

      expect(screen.getByText("/")).toBeInTheDocument();
    });
  });

  describe("the current page", () => {
    it("is the last crumb, drawn as text rather than a link", () => {
      render(trail({}, ["Home", "Docs", "Here"]));

      const here = screen.getByText("Here");

      expect(here.tagName).toBe("SPAN");
      expect(here).toHaveAttribute("aria-current", "page");
      expect(screen.getByText("Home").tagName).toBe("A");
    });

    it("is text even when it was given somewhere to go", () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/here">Here</BreadcrumbItem>
        </Breadcrumb>
      );

      // the page you are on is not somewhere to go
      expect(screen.getByText("Here").tagName).toBe("SPAN");
    });

    it("moves when another crumb claims it, rather than there being two", () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem current>Settings</BreadcrumbItem>
          <BreadcrumbItem href="/settings/profile">Profile</BreadcrumbItem>
        </Breadcrumb>
      );

      expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
      expect(screen.getByText("Settings")).toHaveAttribute("aria-current", "page");
      // and the last one goes back to being a real link
      expect(screen.getByText("Profile").tagName).toBe("A");
    });

    it("is a span when there is nowhere to go, even in the middle", () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem>Nowhere</BreadcrumbItem>
          <BreadcrumbItem href="/here">Here</BreadcrumbItem>
        </Breadcrumb>
      );

      expect(screen.getByText("Nowhere").tagName).toBe("SPAN");
      expect(screen.getByText("Nowhere")).not.toHaveAttribute("aria-current");
    });
  });

  describe("folding a long trail", () => {
    it("keeps the ends and folds the middle away", () => {
      const { container } = render(trail({ maxItems: 3 }));

      expect(crumbs(container)).toEqual(["Home", "…", "September"]);
    });

    it("keeps as many of each end as it is asked for", () => {
      const { container } = render(
        trail({ maxItems: 4, itemsBeforeCollapse: 2, itemsAfterCollapse: 2 })
      );

      expect(crumbs(container)).toEqual(["Home", "Library", "…", "Q3", "September"]);
    });

    it("leaves a short trail alone", () => {
      const { container } = render(trail({ maxItems: 10 }));

      expect(crumbs(container)).toEqual(TRAIL);
    });

    it("shows them all without a maxItems", () => {
      const { container } = render(trail());

      expect(crumbs(container)).toEqual(TRAIL);
    });

    it("keeps the last crumb the current one while the middle is away", () => {
      render(trail({ maxItems: 3 }));

      expect(screen.getByText("September")).toHaveAttribute("aria-current", "page");
    });
  });

  describe("the folded list", () => {
    it("opens the ones that were folded away", async () => {
      render(trail({ maxItems: 3 }));

      expect(menu()).not.toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: "Show the rest" }));

      const opened = menu() as HTMLElement;

      // the middle, and only the middle: the ends are already on the row
      expect(within(opened).getByText("Library")).toBeInTheDocument();
      expect(within(opened).getByText("Q3")).toBeInTheDocument();
      expect(within(opened).queryByText("Home")).not.toBeInTheDocument();
      expect(within(opened).queryByText("September")).not.toBeInTheDocument();
    });

    it("says whether it is open", async () => {
      render(trail({ maxItems: 3 }));

      const trigger = screen.getByRole("button", { name: "Show the rest" });

      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await userEvent.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("takes a name of its own", () => {
      render(trail({ maxItems: 3, expandLabel: "Four more" }));

      expect(screen.getByRole("button", { name: "Four more" })).toBeInTheDocument();
    });

    it("closes when one is picked", async () => {
      render(trail({ maxItems: 3 }));

      await userEvent.click(screen.getByRole("button", { name: "Show the rest" }));
      await userEvent.click(within(menu() as HTMLElement).getByText("Library"));

      expect(menu()).not.toBeInTheDocument();
    });
  });

  describe("asChild", () => {
    it("hands the crumb to your own element, keeping both class names", () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem asChild>
            <button type="button" className="mine">
              Home
            </button>
          </BreadcrumbItem>
          <BreadcrumbItem>Here</BreadcrumbItem>
        </Breadcrumb>
      );

      const own = screen.getByRole("button", { name: "Home" });

      expect(own).toHaveClass("GeckoUIBreadcrumb__link", "mine");
    });

    it("marks your element as the current page when it is the last", async () => {
      const onClick = vi.fn();

      render(
        <Breadcrumb>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem asChild>
            <button type="button" onClick={onClick}>
              Here
            </button>
          </BreadcrumbItem>
        </Breadcrumb>
      );

      const own = screen.getByRole("button", { name: "Here" });

      expect(own).toHaveAttribute("aria-current", "page");

      await userEvent.click(own);

      expect(onClick).toHaveBeenCalled();
    });

    it("passes its own onClick down to your element", async () => {
      const onClick = vi.fn();

      render(
        <Breadcrumb>
          <BreadcrumbItem asChild onClick={onClick}>
            <a href="/">Home</a>
          </BreadcrumbItem>
          <BreadcrumbItem>Here</BreadcrumbItem>
        </Breadcrumb>
      );

      await userEvent.click(screen.getByRole("link", { name: "Home" }));

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("a crumb that runs code", () => {
    it("is a button when it has an onClick and no href", async () => {
      const onClick = vi.fn();

      render(
        <Breadcrumb>
          <BreadcrumbItem onClick={onClick}>Home</BreadcrumbItem>
          <BreadcrumbItem>Here</BreadcrumbItem>
        </Breadcrumb>
      );

      const crumb = screen.getByRole("button", { name: "Home" });

      expect(crumb).toHaveAttribute("type", "button");

      await userEvent.click(crumb);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("answers the keyboard, which a span with a handler would not", async () => {
      const onClick = vi.fn();

      render(
        <Breadcrumb>
          <BreadcrumbItem onClick={onClick}>Home</BreadcrumbItem>
          <BreadcrumbItem>Here</BreadcrumbItem>
        </Breadcrumb>
      );

      await userEvent.tab();

      expect(screen.getByRole("button", { name: "Home" })).toHaveFocus();

      await userEvent.keyboard("{Enter}");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("stays an anchor when it has a href, still calling onClick", async () => {
      const onClick = vi.fn();

      render(
        <Breadcrumb>
          <BreadcrumbItem href="/" onClick={onClick}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem>Here</BreadcrumbItem>
        </Breadcrumb>
      );

      await userEvent.click(screen.getByRole("link", { name: "Home" }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("is plain text on the page you are on, handler or not", () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem onClick={vi.fn()}>Here</BreadcrumbItem>
        </Breadcrumb>
      );

      expect(screen.queryByRole("button", { name: "Here" })).not.toBeInTheDocument();
      expect(screen.getByText("Here")).toHaveAttribute("aria-current", "page");
    });

    it("is plain text with neither a href nor a handler", () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Here</BreadcrumbItem>
        </Breadcrumb>
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  it.each(["sm", "md", "lg"] as const)("exposes size %s", (size) => {
    const { container } = render(trail({ size }, ["Home", "Here"]));

    expect(container.firstChild).toHaveAttribute("data-size", size);
  });
});
