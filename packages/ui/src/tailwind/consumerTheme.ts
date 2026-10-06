const THEME_BLOCK = /@theme\b[^{;]*\{([^}]*)\}/;
const COLOR_TOKEN = /(--color-[\w-]+)\s*:/g;

export const getThemeColorTokens = (css: string) => {
  const block = css.match(THEME_BLOCK)?.[1] ?? "";

  return [...new Set([...block.matchAll(COLOR_TOKEN)].map(([, token]) => token))];
};

/**
 * Tailwind compiles `@theme` away, so an app importing the built stylesheet would never
 * learn the tokens and `bg-surface-primary` would not exist there. This block is left
 * for the app's Tailwind to read: `inline` makes each utility use the variable itself,
 * so dark mode and app overrides still apply, and `reference` keeps Tailwind from
 * declaring the variables again.
 */
export const createConsumerTheme = (tokens: string[]) => {
  if (!tokens.length) {
    return "";
  }

  const declarations = tokens.map((token) => `  ${token}: var(${token});`).join("\n");

  return `@theme inline reference {\n${declarations}\n}\n`;
};
