import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RHFSelect } from "..";
import { SelectOption } from "../../Select";
import { Form, submit } from "../testUtils";

describe("RHFSelect", () => {
  it("renders a select with the stored value", () => {
    const { container } = render(
      <Form defaultValues={{ fruit: "apple" }}>
        <RHFSelect name="fruit">
          <SelectOption value="apple" label="Apple" />
          <SelectOption value="banana" label="Banana" />
        </RHFSelect>
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFSelectButton")).toHaveTextContent("Apple");
  });

  it("stores the picked option", async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <Form defaultValues={{ fruit: undefined }} onSubmit={onSubmit}>
        <RHFSelect name="fruit">
          <SelectOption value="apple" label="Apple" />
          <SelectOption value="banana" label="Banana" />
        </RHFSelect>
      </Form>
    );

    await userEvent.click(container.querySelector(".GeckoUIRHFSelectButton")!);
    await userEvent.click(screen.getByText("Banana"));
    await submit();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ fruit: "banana" }));
  });

  it("applies the wrapper class", () => {
    const { container } = render(
      <Form defaultValues={{ fruit: undefined }}>
        <RHFSelect name="fruit">
          <SelectOption value="apple" label="Apple" />
        </RHFSelect>
      </Form>
    );

    expect(container.querySelector(".GeckoUIRHFSelect")).toBeInTheDocument();
  });

  it("marks the styled trigger as errored", async () => {
    const { container } = render(
      <Form defaultValues={{ fruit: undefined }}>
        <RHFSelect name="fruit" rules={{ required: "Required" }}>
          <SelectOption value="apple" label="Apple" />
        </RHFSelect>
      </Form>
    );

    await submit();

    await waitFor(() =>
      expect(container.querySelector(".GeckoUIRHFSelectButton")).toHaveAttribute(
        "aria-invalid",
        "true"
      )
    );
  });
});
