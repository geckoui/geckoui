import type { JSX, ReactNode } from "react";
import type { ControllerFieldState } from "react-hook-form";

import type { RHFBaseProps } from "../RHF.types";

export type RHFErrorRenderProps = ControllerFieldState;

export interface RHFErrorProps extends RHFBaseProps {
  /**
   * Class name to be applied on the error message.
   * Only applicable when `render` prop is not provided.
   * */
  className?: string;

  /**
   * To customize the error message.
   * If not provided, default error message will be displayed.
   *
   * @example
   * ```js
   * <RHFError
   *   name="email"
   *   render={({ error }) => {
   *     return (
   *        <div className="flex items-center space-x-2">
   *         <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
   *         <span className="text-sm font-normal text-red-600">{error}</span>
   *        </div>
   *     );
   *   }}
   * />
   * ```
   * */
  render?: ReactNode | ((props: RHFErrorRenderProps) => JSX.Element);
}
