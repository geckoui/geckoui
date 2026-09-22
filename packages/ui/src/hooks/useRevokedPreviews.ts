import { useEffect, useRef } from "react";

/**
 * Revokes the object URLs of files that are no longer being shown.
 *
 * `URL.createObjectURL` pins the file's bytes until the URL is revoked, so without this a
 * selection that is replaced, cleared or unmounted leaks every file it held.
 *
 * Revoked in two places: as a file leaves the list, and on unmount for whatever is left.
 */
const useRevokedPreviews = (previews: (string | undefined)[]) => {
  const held = useRef<Set<string>>(new Set());

  /*
   * What was already on screen at the first commit. Those URLs were made by someone else,
   * so they are not ours to revoke — and skipping them is what makes the unmount cleanup
   * safe under StrictMode, whose simulated remount would otherwise revoke them for good.
   */
  const inherited = useRef<Set<string> | null>(null);

  // No dependency array: the list is rebuilt each render, so an identity check buys nothing
  useEffect(() => {
    const current = new Set(previews.filter((preview): preview is string => Boolean(preview)));

    if (inherited.current === null) inherited.current = current;

    held.current.forEach((preview) => {
      if (!current.has(preview)) URL.revokeObjectURL(preview);
    });

    held.current = current;
  });

  useEffect(
    () => () => {
      held.current.forEach((preview) => {
        if (!inherited.current?.has(preview)) URL.revokeObjectURL(preview);
      });
    },
    []
  );
};

export default useRevokedPreviews;
