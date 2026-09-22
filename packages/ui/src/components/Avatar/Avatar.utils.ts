/**
 * The first letter of the first and last word, so "Ada Lovelace" gives "AL" and "Ada"
 * gives "A".
 *
 * Split by code point rather than by index, or a name starting with an emoji or any
 * character outside the basic plane is cut in half.
 */
export const initialsFrom = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "";

  const first = Array.from(words[0])[0] ?? "";
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? "") : "";

  return (first + last).toUpperCase();
};
