/**
 * Split props into the `data-*` attributes and everything else.
 *
 * Components whose root element is not the one receiving `...rest` use this to keep
 * `data-*` on the root, next to the state attributes the styles already key off,
 * rather than leaking them onto an inner element.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- accepts any prop bag
export const splitDataAttributes = <T extends Record<string, any>>(props: T) => {
  const dataAttributes: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  Object.keys(props).forEach((key) => {
    if (key.startsWith("data-")) {
      dataAttributes[key] = props[key];
      return;
    }

    rest[key] = props[key];
  });

  return { dataAttributes, rest: rest as Omit<T, `data-${string}`> };
};
