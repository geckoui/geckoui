import type { FC } from "react";

import type { BaseIconProps } from "../../icons/Icon.types";

const base = {
  fill: "none",
  height: "18",
  width: "18",
  viewBox: "0 0 20 20",
  xmlns: "http://www.w3.org/2000/svg"
} as const;

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round"
} as const;

export const ToastSuccessIcon: FC<BaseIconProps> = (props) => (
  <svg {...base} {...props}>
    <circle cx="10" cy="10" r="8.2" {...stroke} />
    <path d="M6.4 10.3l2.4 2.4 4.8-5" {...stroke} />
  </svg>
);

export const ToastErrorIcon: FC<BaseIconProps> = (props) => (
  <svg {...base} {...props}>
    <circle cx="10" cy="10" r="8.2" {...stroke} />
    <path d="M7.2 7.2l5.6 5.6M12.8 7.2l-5.6 5.6" {...stroke} />
  </svg>
);

export const ToastWarningIcon: FC<BaseIconProps> = (props) => (
  <svg {...base} {...props}>
    <path d="M10 2.6L18.4 17H1.6L10 2.6z" {...stroke} />
    <path d="M10 8v3.4" {...stroke} />
    <circle cx="10" cy="14.2" r="0.9" fill="currentColor" />
  </svg>
);

export const ToastInfoIcon: FC<BaseIconProps> = (props) => (
  <svg {...base} {...props}>
    <circle cx="10" cy="10" r="8.2" {...stroke} />
    <path d="M10 9.2v4.4" {...stroke} />
    <circle cx="10" cy="6.4" r="0.9" fill="currentColor" />
  </svg>
);
