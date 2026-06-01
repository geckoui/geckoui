import React, { forwardRef, useRef } from "react";

import { classNames } from "../../utils/classNames";
import type { OTPInputProps } from "./OTPInput.types";

/**
 * OTPInput provides a segmented input field for entering one-time passwords or verification codes.
 * Each digit is displayed in a separate box with automatic focus management and keyboard navigation.
 * Supports both numeric-only mode (default) and alphanumeric input.
 *
 * @example
 * Two-factor authentication:
 *
 * ```tsx
 * const [verificationCode, setVerificationCode] = useState('');
 *
 * <OTPInput
 *   value={verificationCode}
 *   onChange={setVerificationCode}
 *   length={6}
 *   numberOnly
 *   onOTPComplete={async (code) => {
 *     await verifyTwoFactorCode(code);
 *   }}
 * />
 * ```
 *
 * @example
 * Alphanumeric code with custom styling:
 *
 * ```tsx
 * <OTPInput
 *   value={activationCode}
 *   onChange={setActivationCode}
 *   length={8}
 *   numberOnly={false}
 *   className="gap-2"
 *   inputClassName="border-2 rounded-md"
 * />
 * ```
 *
 * @example
 * SMS verification with aspect ratio:
 *
 * ```tsx
 * <OTPInput
 *   value={smsCode}
 *   onChange={setSmsCode}
 *   length={4}
 *   aspectRatio={1}
 *   onOTPComplete={(code) => submitVerification(code)}
 *   disabled={isVerifying}
 * />
 * ```
 */
const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  (
    {
      value = "",
      onChange,
      onBlur,
      className,
      inputClassName,
      length = 6,
      numberOnly = true,
      aspectRatio,
      onOTPComplete,
      disabled
    },
    ref
  ) => {
    const divRef = useRef<HTMLDivElement>(null);

    const focus = (index: number) => {
      const children = divRef.current?.children;
      if (!children) return;

      const el = children[Math.min(index, length - 1)]?.children[0] as HTMLInputElement;
      if (el) el.focus();
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
      let updatedValue: string | string[] = value.split("");
      updatedValue[i] = numberOnly ? e.target.value.replace(/\D/g, "") : e.target.value;
      updatedValue = updatedValue.join("").replaceAll(" ", "").substring(0, length);

      if (value.length > updatedValue.length) return;

      focus(updatedValue.length);
      onChange(updatedValue);

      if (updatedValue.length === length && onOTPComplete) {
        onOTPComplete(updatedValue);
      }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const isDelete = e.keyCode === 8 || e.keyCode === 46;
      if (!isDelete) return;

      onChange(value.substring(0, value.length - 1));
      focus(value.length - 1);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      focus(value.length);
    };

    return (
      <div
        className={classNames("GeckoUIOTPInput", className)}
        data-state={disabled ? "disabled" : "enabled"}
        ref={divRef}>
        {Array.from({ length })
          .map((_, i) => i)
          .map((key, index) => {
            const isLast = index === length - 1;

            return (
              <div
                key={key}
                style={{
                  position: "relative",
                  flex: 1,
                  maxWidth: 56,
                  aspectRatio: aspectRatio === undefined ? 0.94 : aspectRatio
                }}>
                <input
                  // Set tabIndex to 0 for the input that is not filled yet
                  // So when we press tab, it will focus on the input that is not filled yet
                  className={classNames("GeckoUIOTPInput__input", inputClassName)}
                  disabled={disabled}
                  inputMode={numberOnly ? "numeric" : "text"}
                  onBlur={onBlur}
                  onChange={(e) => handleOnChange(e, index)}
                  placeholder="•"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (index < length - 1) {
                        e.preventDefault();
                        return false;
                      }

                      if (isLast && value.length < length) {
                        e.preventDefault();
                        return false;
                      }

                      return true;
                    }
                  }}
                  onKeyUp={(e) => handleKeyUp(e)}
                  // Bind ref to the input that is not filled yet.
                  // So that we can focus on the input that is not filled yet by using the ref
                  ref={value.length === index ? ref : undefined}
                  tabIndex={(() => {
                    if (isLast && value.length === length) {
                      return 0;
                    }

                    if (value.length === index) {
                      return 0;
                    }

                    return -1;
                  })()}
                  type="text"
                  value={value[index] || ""}
                />

                <button
                  className="GeckoUIOTPInput__overlay-button"
                  onClick={(e) => {
                    handleClick(e);
                  }}
                  tabIndex={-1}
                  type="button"
                />
              </div>
            );
          })}
      </div>
    );
  }
);

OTPInput.displayName = "OTPInput";

export default OTPInput;
