import { useEffect, useRef } from "react";

/**
 * Revokes the object URL of any file that has left the list.
 *
 * `URL.createObjectURL` pins the file's bytes until the URL is revoked, so replacing a
 * selection would otherwise leak every file picked before it, for the life of the document.
 *
 * Only files that have left are revoked, never the ones still held: revoking on unmount
 * would kill previews that React's StrictMode remount goes on using.
 */
const useRevokedPreviews = (previews: (string | undefined)[]) => {
  const held = useRef<Set<string>>(new Set());

  // No dependency array: the list is rebuilt each render, so an identity check buys nothing
  useEffect(() => {
    const current = new Set(previews.filter((preview): preview is string => Boolean(preview)));

    held.current.forEach((preview) => {
      if (!current.has(preview)) URL.revokeObjectURL(preview);
    });

    held.current = current;
  });
};

export default useRevokedPreviews;
