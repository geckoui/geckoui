import { type FC } from "react";

import { classNames } from "../../utils/classNames";
import { DynamicComponentRenderer } from "../DynamicComponentRenderer";
import type { AlertProps } from "./Alert.types";

/**
 * An alert component for displaying important messages with different severity levels.
 *
 * Supports multiple variants (error, success, warning, info), optional descriptions,
 * custom icons, and dismissal functionality. The `condensed` prop reduces vertical padding
 * for a more compact appearance.
 *
 * @example
 * ```tsx
 * // Basic alert
 * <Alert title="This is an alert message" />
 *
 * // Different variants
 * <Alert variant="success" title="Success!" />
 * <Alert variant="warning" title="Warning!" />
 * <Alert variant="info" title="Information" />
 *
 * // Condensed style
 * <Alert variant="success" condensed title="This is a success message" />
 *
 * // With description and remove button
 * <Alert
 *   variant="warning"
 *   title="Warning!"
 *   description="This is a detailed warning message with more context."
 *   onRemove={() => console.log('Alert dismissed')}
 * />
 *
 * // With custom icon
 * <Alert
 *   variant="info"
 *   title="Custom Icon"
 *   icon={<CustomIcon />}
 * />
 * ```
 */
const Alert: FC<AlertProps> = (props) => {
  const {
    variant = "default",
    condensed = false,
    onRemove,
    className,
    title,
    description,
    icon,
    iconClassName
  } = props;

  return (
    <div
      className={classNames("GeckoUIAlert", className)}
      data-variant={variant}
      {...(condensed ? { "data-condensed": "" } : {})}>
      <div className="GeckoUIAlert__body">
        {icon ? (
          <DynamicComponentRenderer component={icon} />
        ) : (
          <div className={classNames("GeckoUIAlert__icon", iconClassName)} data-variant={variant} />
        )}
        <DynamicComponentRenderer component={title} className="GeckoUIAlert__title" />
        {Boolean(onRemove) && (
          <button className="GeckoUIAlert__remove-button" onClick={onRemove} type="button">
            <span className="GeckoUIAlert__remove-button__icon" />
          </button>
        )}
      </div>
      {description ? (
        <div className="GeckoUIAlert__description">
          <DynamicComponentRenderer component={description} />
        </div>
      ) : null}
    </div>
  );
};

export default Alert;
