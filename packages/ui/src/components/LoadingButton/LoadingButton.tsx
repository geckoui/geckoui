import type { FC } from "react";

import { classNames } from "../../utils/classNames";
import { Button } from "../Button";
import { Spinner } from "../Spinner";
import type { LoadingButtonProps } from "./LoadingButton.types";

/**
 * LoadingButton extends the Button component with built-in loading state visualization.
 * Automatically displays a spinner and optional loading text while preventing user interaction
 * during asynchronous operations.
 *
 * @example
 * Form submission with loading state:
 *
 * ```tsx
 * const [isSubmitting, setIsSubmitting] = useState(false);
 *
 * const handleSubmit = async () => {
 *   setIsSubmitting(true);
 *   await saveFormData();
 *   setIsSubmitting(false);
 * };
 *
 * <LoadingButton
 *   loading={isSubmitting}
 *   loadingText="Saving..."
 *   onClick={handleSubmit}
 * >
 *   Save Changes
 * </LoadingButton>
 * ```
 *
 * @example
 * Spinner at end position:
 *
 * ```tsx
 * <LoadingButton
 *   loading={isProcessing}
 *   spinnerPosition="end"
 *   variant="outlined"
 *   size="lg"
 * >
 *   Process Payment
 * </LoadingButton>
 * ```
 *
 * @example
 * Without loading text (keeps original label):
 *
 * ```tsx
 * <LoadingButton loading={isDeleting} color="danger">
 *   Delete Account
 * </LoadingButton>
 * ```
 */
const LoadingButton: FC<LoadingButtonProps> = ({
  loading,
  spinnerPosition = "start",
  loadingText,
  className,
  children,
  disabled,
  size,
  variant = "filled",
  color,
  ...buttonProps
}) => {
  const renderContent = () => {
    if (loading && loadingText) {
      return <span>{loadingText}</span>;
    }

    if (loading && typeof children === "string") {
      return <span>{children}</span>;
    }

    return children;
  };

  return (
    <Button
      data-loading={loading || undefined}
      className={classNames("GeckoUILoadingButton", className)}
      disabled={loading || disabled}
      size={size}
      color={color}
      variant={variant}
      {...buttonProps}>
      {loading && spinnerPosition === "start" ? <Spinner className="size-3.5" /> : null}
      {renderContent()}
      {loading && spinnerPosition === "end" ? <Spinner className="size-3.5" /> : null}
    </Button>
  );
};

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;
