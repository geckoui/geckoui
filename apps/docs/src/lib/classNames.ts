import { twMerge } from "tailwind-merge";

export const classNames = (...classes: (string | boolean | undefined | null)[]) =>
  twMerge(classes.filter(Boolean).join(" "));
