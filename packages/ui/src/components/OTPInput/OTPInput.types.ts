export interface OTPInputProps {
  /**
   * Marks the field invalid, to a screen reader and in its colours.
   *
   * The standard attribute rather than a prop of the library's own.
   * */
  "aria-invalid"?: boolean | "true" | "false";

  /**
   * Value of the OTP input
   * */
  value: string;

  /**
   * Function to call when the OTP input value changes
   * */
  onChange: (value: string) => void;

  /**
   * Function to call when the OTP input is blurred
   * */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Function to call when the OTP input completely filled
   * i.e when the length of the OTP input is equal to the length prop
   * */
  onOTPComplete?: (value: string) => void;

  /**
   * If true, only numbers can be entered in the OTP input. (Default: true)
   * */
  numberOnly?: boolean;

  /**
   * Classname for the wrapper div that contains input fields
   * */
  className?: string;

  /**
   * Classname for the input fields
   * */
  inputClassName?: string;

  /**
   * Length of the OTP input(Default: 6)
   * Inputs will be created based on this length
   * */
  length?: number;

  /**
   * Aspect ratio of the OTP input (Default: 0.94)
   * */
  aspectRatio?: string | number;

  /**
   * If true, the OTP input will be disabled
   * */
  disabled?: boolean;
}
