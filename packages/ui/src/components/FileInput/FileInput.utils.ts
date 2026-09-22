/** What the field says once files are held, the way a native input counts them. */
export const countLabel = (count: number) => {
  if (!count) return undefined;

  return count === 1 ? "1 file" : `${count} files`;
};
