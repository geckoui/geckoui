import type { ReactNode } from "react";
import { useRef } from "react";
import { type Root, createRoot } from "react-dom/client";

import { useClickOutside, useEscListener } from "../../hooks";
import { classNames } from "../../utils/classNames";
import type { DrawerProps } from "./Drawer.types";
import { DRAWER_CONTAINER_ID } from "./DrawerContainer";

/**
 * Drawer is a slide-out panel component that displays auxiliary content from any edge of the viewport.
 * It provides a less intrusive alternative to modals for navigation menus, settings panels, filters,
 * and contextual information.
 *
 * The component supports four placement directions (top, right, bottom, left) with smooth transitions,
 * optional backdrop overlay, and flexible dismissal behaviors including ESC key and click-outside handling.
 *
 * @example
 * Mobile navigation menu:
 *
 * ```tsx
 * const [menuOpen, setMenuOpen] = useState(false);
 *
 * <button onClick={() => setMenuOpen(true)}>
 *   <MenuIcon />
 * </button>
 *
 * <Drawer
 *   open={menuOpen}
 *   handleClose={() => setMenuOpen(false)}
 *   placement="left"
 *   allowClickOutside
 *   dismissOnEscape
 *   className="w-80 bg-white shadow-xl"
 * >
 *   <nav className="p-6">
 *     <NavigationLinks />
 *   </nav>
 * </Drawer>
 * ```
 *
 * @example
 * Filter panel with backdrop:
 *
 * ```tsx
 * const [filtersOpen, setFiltersOpen] = useState(false);
 *
 * <Drawer
 *   open={filtersOpen}
 *   handleClose={() => setFiltersOpen(false)}
 *   placement="right"
 *   allowClickOutside={true}
 *   backdropClassName="bg-black/60"
 *   className="w-96 p-6"
 * >
 *   <FilterPanel
 *     onApply={(filters) => {
 *       applyFilters(filters);
 *       setFiltersOpen(false);
 *     }}
 *   />
 * </Drawer>
 * ```
 *
 * @example
 * Notification center from top:
 *
 * ```tsx
 * <Drawer
 *   open={showNotifications}
 *   handleClose={() => setShowNotifications(false)}
 *   placement="top"
 *   hideBackdrop={false}
 *   allowClickOutside
 *   className="h-96 border-b shadow-lg"
 * >
 *   <NotificationList
 *     notifications={notifications}
 *     onMarkAllRead={handleMarkAllRead}
 *   />
 * </Drawer>
 * ```
 *
 * @example
 * Bottom sheet for mobile actions:
 *
 * ```tsx
 * <Drawer
 *   open={isBottomSheetOpen}
 *   handleClose={() => setBottomSheetOpen(false)}
 *   placement="bottom"
 *   allowClickOutside
 *   dismissOnEscape={false}
 *   backdropClassName="bg-black/40"
 *   className="h-64 rounded-t-2xl"
 * >
 *   <ActionSheet
 *     actions={mobileActions}
 *     onSelect={handleActionSelect}
 *   />
 * </Drawer>
 * ```
 *
 * @example
 * Settings panel without backdrop:
 *
 * ```tsx
 * <Drawer
 *   open={settingsVisible}
 *   handleClose={() => setSettingsVisible(false)}
 *   placement="right"
 *   hideBackdrop
 *   allowClickOutside={false}
 *   className="w-[600px] border-l"
 * >
 *   <SettingsPanel
 *     sections={settingsSections}
 *     onSave={saveSettings}
 *   />
 * </Drawer>
 * ```
 */
function Drawer({
  open = false,
  allowClickOutside,
  handleClose,
  hideBackdrop = false,
  placement = "right",
  backdropClassName,
  className,
  children,
  dismissOnEscape = true
}: DrawerProps) {
  const drawerRootRef = useRef(null);

  const handleDismiss = () => {
    if (open) handleClose?.();
  };

  useClickOutside(() => {
    if (!allowClickOutside) return;

    handleDismiss();
  }, [drawerRootRef]);

  useEscListener(dismissOnEscape ? handleDismiss : undefined);

  return (
    <div className="GeckoUIDrawer" ref={drawerRootRef} role="dialog">
      <div
        data-state={open && !hideBackdrop ? "visible" : "hidden"}
        data-clickthrough={allowClickOutside || undefined}
        className={classNames("GeckoUIDrawer__backdrop", backdropClassName)}
        onClick={handleDismiss}
        onKeyDown={handleDismiss}
        role="presentation"
      />
      <div
        data-placement={placement}
        data-state={open ? "open" : "closed"}
        className={classNames("GeckoUIDrawer__drawer", className)}>
        {children}
      </div>
    </div>
  );
}

let root: Root | null = null;

/**
 * Drawer.show provides an imperative API for displaying drawers without managing React state.
 * This is particularly useful for one-off drawers triggered by user actions or global events.
 *
 * @example
 * Quick action drawer:
 *
 * ```tsx
 * const openQuickActions = () => {
 *   Drawer.show(
 *     <QuickActionsMenu
 *       actions={globalActions}
 *       onActionClick={(action) => {
 *         handleAction(action);
 *         Drawer.dismiss();
 *       }}
 *     />,
 *     {
 *       placement: "bottom",
 *       handleClose: () => Drawer.dismiss(),
 *       className: "h-80 rounded-t-xl"
 *     }
 *   );
 * };
 * ```
 *
 * @example
 * Contextual help panel:
 *
 * ```tsx
 * // Show help drawer from any component
 * Drawer.show(
 *   <HelpDocumentation topic={currentTopic} />,
 *   {
 *     placement: "right",
 *     handleClose: () => {
 *       logHelpUsage(currentTopic);
 *       Drawer.dismiss();
 *     },
 *     allowClickOutside: true,
 *     className: "w-[500px]"
 *   }
 * );
 * ```
 */
Drawer.show = (node: ReactNode, options: Omit<DrawerProps, "open" | "children"> = {}) => {
  const el = document.getElementById(DRAWER_CONTAINER_ID);

  if (!el) {
    throw new Error("DrawerContainer not found");
  }

  root = createRoot(el);
  root.render(
    <Drawer {...options} open>
      {node}
    </Drawer>
  );
};

Drawer.dismiss = () => {
  if (!root) {
    console.warn("Drawer is not mounted.");
    return;
  }

  root.unmount();
};

export default Drawer;
