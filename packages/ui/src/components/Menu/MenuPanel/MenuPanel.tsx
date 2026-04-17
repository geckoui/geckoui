import { type PropsWithChildren, useEffect, useRef } from "react";

import { classNames } from "../../../utils/classNames";
import { useMenu } from "../useMenu";

interface MenuPanelProps extends PropsWithChildren {
  className?: string;
}

const MenuPanel = ({ children, className }: MenuPanelProps) => {
  const {
    open,
    disabled,
    closeMenu,
    menuRef,
    floating: { refs, floatingStyles }
  } = useMenu();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    panelRef.current.focus();
  }, [open]);

  if (!open || disabled) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]:not([data-disabled])") ?? []
    );
    const current = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(current);

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = items[(currentIndex + 1) % items.length];
        next?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = items[(currentIndex - 1 + items.length) % items.length];
        prev?.focus();
        break;
      }
      case "Escape":
      case "Tab":
        e.preventDefault();
        closeMenu();
        break;
    }
  };

  return (
    <div
      ref={(r) => {
        refs.setFloating(r);
        menuRef.current = r;
        (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = r;
      }}
      role="menu"
      tabIndex={-1}
      style={floatingStyles}
      className={classNames("GeckoUIMenu__items", className)}
      onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};

MenuPanel.displayName = "MenuPanel";

export default MenuPanel;
