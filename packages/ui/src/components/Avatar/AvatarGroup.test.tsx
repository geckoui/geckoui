import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Avatar from "./Avatar/Avatar";
import AvatarGroup from "./AvatarGroup/AvatarGroup";

const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson"];

const renderGroup = (props: Record<string, unknown> = {}, count = people.length) =>
  render(
    <AvatarGroup {...props}>
      {people.slice(0, count).map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  );

// Each avatar sits in a slot that holds the hover target still while it lifts.
const avatars = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(".GeckoUIAvatarGroup > * > .GeckoUIAvatar"));

describe("AvatarGroup", () => {
  it("shows every avatar when there is no max", () => {
    const { container } = renderGroup();

    expect(avatars(container)).toHaveLength(4);
    expect(container.querySelector(".GeckoUIAvatarGroup__overflow")).not.toBeInTheDocument();
  });

  it("counts the ones past max", () => {
    const { container } = renderGroup({ max: 2 });

    // two shown, plus the chip
    expect(avatars(container)).toHaveLength(3);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("names the count for a screen reader", () => {
    renderGroup({ max: 2 });

    expect(screen.getByRole("img", { name: "2 more" })).toBeInTheDocument();
  });

  it("drops the chip when everything fits", () => {
    renderGroup({ max: 10 });

    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("hands its size and shape to every avatar inside", () => {
    const { container } = renderGroup({ size: "lg", shape: "rounded" });

    avatars(container).forEach((avatar) => {
      expect(avatar).toHaveAttribute("data-size", "lg");
      expect(avatar).toHaveAttribute("data-shape", "rounded");
    });
  });

  it("lets an avatar keep a size of its own", () => {
    const { container } = render(
      <AvatarGroup size="lg">
        <Avatar name="Ada Lovelace" size="xs" />
      </AvatarGroup>
    );

    expect(avatars(container)[0]).toHaveAttribute("data-size", "xs");
  });

  it("reverses the children, so the first avatar paints over the second", () => {
    const { container } = renderGroup({}, 3);
    const rendered = avatars(container).map((el) => el.getAttribute("aria-label"));

    expect(rendered).toEqual(["Alan Turing", "Grace Hopper", "Ada Lovelace"]);
  });

  describe("interactive", () => {
    it("names an avatar on hover", async () => {
      const { container } = renderGroup({}, 2);

      await userEvent.hover(avatars(container)[1]);

      expect(await screen.findByRole("tooltip")).toHaveTextContent("Ada Lovelace");
    });

    it("opens the overflow from the count on hover", async () => {
      renderGroup({ max: 2 });

      await userEvent.hover(screen.getByText("+2"));

      const tooltip = await screen.findByRole("tooltip");

      expect(within(tooltip).getByText("Alan Turing")).toBeInTheDocument();
      expect(within(tooltip).getByText("Katherine Johnson")).toBeInTheDocument();
    });

    it("keeps the hover target still while the avatar lifts", async () => {
      const { container } = renderGroup({}, 2);
      const slot = container.querySelector(".GeckoUIAvatarGroup__slot") as HTMLElement;

      // The slot is what carries the hover, and only the avatar inside it is moved. If the
      // avatar were the hover target, lifting it out from under the pointer would drop the
      // hover and drop it straight back down, flickering.
      expect(slot).toBeInTheDocument();
      expect(slot.querySelector(".GeckoUIAvatar")).toBeInTheDocument();
    });

    it("stays quiet when it is turned off", async () => {
      const { container } = renderGroup({ max: 2, interactive: false });

      await userEvent.hover(avatars(container)[1]);
      await userEvent.hover(screen.getByText("+2"));

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      expect(screen.getByText("+2")).toBeInTheDocument();
    });
  });

  describe("renderOverflow", () => {
    it("hands over the props of the avatars that did not fit", async () => {
      render(
        <AvatarGroup
          max={1}
          renderOverflow={({ avatars: rest }) => (
            <ul>
              {rest.map((avatar) => (
                <li key={avatar.name}>{`${avatar.name} - ${avatar.src ?? "no photo"}`}</li>
              ))}
            </ul>
          )}>
          <Avatar name="Ada Lovelace" />
          <Avatar name="Grace Hopper" src="/grace.png" />
          <Avatar name="Alan Turing" />
        </AvatarGroup>
      );

      await userEvent.hover(screen.getByText("+2"));

      const tooltip = await screen.findByRole("tooltip");

      expect(within(tooltip).getByText("Grace Hopper - /grace.png")).toBeInTheDocument();
      expect(within(tooltip).getByText("Alan Turing - no photo")).toBeInTheDocument();
    });

    it("keeps an entry for a child that is not an avatar, so the count still adds up", async () => {
      render(
        <AvatarGroup
          max={1}
          renderOverflow={({ avatars: rest }) => <span>{`got ${rest.length}`}</span>}>
          <Avatar name="Ada Lovelace" />
          <Avatar name="Grace Hopper" />
          {"a stray string"}
        </AvatarGroup>
      );

      expect(screen.getByText("+2")).toBeInTheDocument();

      await userEvent.hover(screen.getByText("+2"));

      expect(await screen.findByText("got 2")).toBeInTheDocument();
    });

    it("does not open a tooltip for each avatar inside the overflow", async () => {
      renderGroup({ max: 2 });

      await userEvent.hover(screen.getByText("+2"));

      const tooltip = await screen.findByRole("tooltip");

      await userEvent.hover(within(tooltip).getByText("Alan Turing"));

      expect(screen.getAllByRole("tooltip")).toHaveLength(1);
    });
  });
});
