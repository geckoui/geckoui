import type { CSSProperties, ReactNode } from "react";

/** Extensible placement map - To allow module augmentation */
export interface DrawerPlacementMap {
  top: unknown;
  bottom: unknown;
  left: unknown;
  right: unknown;
}

export interface DrawerProps {
  /**
   * Open/Close the drawer
   * */
  open: boolean;

  /**
   * Allow clicking outside of drawer to close
   * If true, you can click through backdrop to close the drawer
   * If you pass `onClose` prop, you can use it to close the drawer
   * Use it with caution, it may cause bad UX in some cases
   * Eg. let's say you have an `a` tag that points to another page,
   * if you click on that element, it will close the drawer and navigate to the new page
   *
   * ---
   * Default: false
   * */
  allowClickOutside?: boolean;

  /**
   * Callback fired when the drawer asks to be closed (Esc key, backdrop click, or a
   * click outside when `allowClickOutside` is set).
   * */
  onClose?: () => void;

  /**
   * Backdrop show/hide If true,
   * This is just a visual effect just setting opacity to 0
   * So, you can still click the backdrop to close the drawer if you pass `onClose` prop to close the drawer
   * */
  hideBackdrop?: boolean;

  /**
   * Display the content of the drawer
   * */
  children?: ReactNode;

  /**
   * The placement of Drawer
   *
   * Default: 'right'
   * */
  placement?: keyof DrawerPlacementMap;

  /**
   * Additional class name for the backdrop
   * */
  backdropClassName?: string;

  /**
   * Additional class name for drawer
   * */
  className?: string;

  /**
   * If true, the drawer will dismiss when the escape key is pressed
   * Default is true
   * */
  dismissOnEscape?: boolean;

  /**
   * Inline styles for the drawer root.
   * `GeckoUIProvider` uses it to stack drawers opened with `Drawer.show()`.
   * */
  style?: CSSProperties;
}
