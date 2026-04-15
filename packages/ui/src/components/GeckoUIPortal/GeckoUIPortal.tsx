import { type FC } from "react";
import { Toaster } from "sonner";

import { DialogContainer } from "../Dialog/DialogContainer";
import { DrawerContainer } from "../Drawer/DrawerContainer";
import type { GeckoUIPortalProps } from "./GeckoUIPortal.types";

const GeckoUIPortal: FC<GeckoUIPortalProps> = ({ toastOptions = {} }) => {
  const { style, ...restToastOptions } = toastOptions;

  return (
    <>
      <Toaster
        position="bottom-right"
        style={
          {
            "--normal-bg": "var(--color-surface-primary)",
            "--normal-text": "var(--color-text-primary)",
            "--normal-border": "var(--color-border-primary)",
            ...style
          } as React.CSSProperties
        }
        {...restToastOptions}
      />
      <DrawerContainer />
      <DialogContainer />
    </>
  );
};

export default GeckoUIPortal;
