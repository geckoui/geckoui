import { fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useRevokedPreviews from "./useRevokedPreviews";

const revoke = vi.fn();

beforeEach(() => {
  revoke.mockClear();
  vi.stubGlobal("URL", { ...URL, revokeObjectURL: revoke });
});

afterEach(() => vi.unstubAllGlobals());

const Holder = ({ previews }: { previews: (string | undefined)[] }) => {
  useRevokedPreviews(previews);

  return <p>{previews.length}</p>;
};

describe("useRevokedPreviews", () => {
  it("revokes a preview once its file leaves the list", () => {
    const { rerender } = render(<Holder previews={["blob:a", "blob:b"]} />);

    expect(revoke).not.toHaveBeenCalled();

    rerender(<Holder previews={["blob:b"]} />);

    expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:a");
  });

  it("revokes everything when the list is emptied", () => {
    const { rerender } = render(<Holder previews={["blob:a", "blob:b"]} />);

    rerender(<Holder previews={[]} />);

    expect(revoke).toHaveBeenCalledTimes(2);
    expect(revoke).toHaveBeenCalledWith("blob:a");
    expect(revoke).toHaveBeenCalledWith("blob:b");
  });

  it("revokes the whole of a replaced selection, which is where the leak was", () => {
    const { rerender } = render(<Holder previews={["blob:a", "blob:b"]} />);

    rerender(<Holder previews={["blob:c", "blob:d"]} />);

    expect(revoke).toHaveBeenCalledTimes(2);
    expect(revoke).toHaveBeenCalledWith("blob:a");
    expect(revoke).toHaveBeenCalledWith("blob:b");
  });

  it("leaves the ones still held alone", () => {
    const { rerender } = render(<Holder previews={["blob:a"]} />);

    rerender(<Holder previews={["blob:a"]} />);
    rerender(<Holder previews={["blob:a"]} />);

    expect(revoke).not.toHaveBeenCalled();
  });

  it("revokes what is left on unmount", () => {
    const { rerender, unmount } = render(<Holder previews={[]} />);

    rerender(<Holder previews={["blob:a", "blob:b"]} />);
    expect(revoke).not.toHaveBeenCalled();

    unmount();

    expect(revoke).toHaveBeenCalledTimes(2);
    expect(revoke).toHaveBeenCalledWith("blob:a");
    expect(revoke).toHaveBeenCalledWith("blob:b");
  });

  it("leaves previews it inherited alone, so a StrictMode remount keeps them", () => {
    // Already on screen at the first commit, so made by someone else
    const { unmount } = render(<Holder previews={["blob:theirs"]} />);

    unmount();

    expect(revoke).not.toHaveBeenCalled();
  });

  it("revokes its own on unmount but not the ones it inherited", () => {
    const { rerender, unmount } = render(<Holder previews={["blob:theirs"]} />);

    rerender(<Holder previews={["blob:theirs", "blob:ours"]} />);
    unmount();

    expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:ours");
  });

  it("ignores files that have no preview", () => {
    const { rerender } = render(<Holder previews={[undefined, "blob:a"]} />);

    rerender(<Holder previews={[]} />);

    expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:a");
  });

  it("revokes each preview once, not once per render", () => {
    const Wrapper = () => {
      const [previews, setPreviews] = useState(["blob:a"]);
      const [, bump] = useState(0);

      return (
        <>
          <button type="button" onClick={() => setPreviews([])}>
            clear
          </button>
          <button type="button" onClick={() => bump((n) => n + 1)}>
            rerender
          </button>
          <Holder previews={previews} />
        </>
      );
    };

    const { getByText } = render(<Wrapper />);

    fireEvent.click(getByText("clear"));
    fireEvent.click(getByText("rerender"));
    fireEvent.click(getByText("rerender"));

    expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:a");
  });
});
