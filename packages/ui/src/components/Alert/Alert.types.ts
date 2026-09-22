import type { FC, HTMLAttributes, ReactNode } from "react";

/** Extensible color map - To allow module augmentation */
export interface AlertColorMap {
  error: unknown;
  warning: unknown;
  info: unknown;
  success: unknown;
  default: unknown;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * What the alert means. Drives the accent colour.(Default: 'default')
   *
   * Named `color` to match `Button` and `Badge`, where `variant` is the visual
   * treatment rather than the meaning.
   * */
  color?: keyof AlertColorMap;

  /**
   * Determines if the alert should be condensed.(Default: false)
   * */
  condensed?: boolean;

  /**
   * Main message to display in the alert.
   */
  title: ReactNode | FC;

  /**
   * Extra description to display in the alert.
   */
  description?: ReactNode | FC;

  /**
   * Callback function to handle the remove event.
   */
  onRemove?: () => void;

  /**
   * Custom icon to display in the alert.
   * If provided, iconClassName will be ignored.
   */
  icon?: ReactNode | FC;

  /**
   * Custom class name for the icon.
   * Only used if icon is not provided.
   */
  iconClassName?: string;
}
