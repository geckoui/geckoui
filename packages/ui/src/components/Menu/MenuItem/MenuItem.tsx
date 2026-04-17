import { classNames } from "../../../utils/classNames";
import { useMenu } from "../useMenu";
import type { MenuItemProps } from "./MenuItem.types";

const MenuItem = ({ label, disabled, className, onClick, children, ...rest }: MenuItemProps) => {
  const { closeMenu } = useMenu();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    closeMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      className={classNames("GeckoUIMenu__item", className)}
      data-disabled={disabled || undefined}
      onMouseMove={(e) => (e.currentTarget as HTMLElement).focus()}
      onClick={disabled ? undefined : handleClick}
      onKeyDown={handleKeyDown}
      {...rest}>
      {children ?? label}
    </div>
  );
};

MenuItem.displayName = "MenuItem";

export default MenuItem;
