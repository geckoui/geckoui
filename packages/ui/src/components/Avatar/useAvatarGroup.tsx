import { createContext, useContext } from "react";

import type { AvatarShapeMap, AvatarSizeMap } from "./Avatar.types";

export interface AvatarGroupContextValue {
  size?: keyof AvatarSizeMap;
  shape?: keyof AvatarShapeMap;

  /** Whether each avatar lifts and names itself in a tooltip on hover. */
  interactive?: boolean;
}

export const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

/** The surrounding group, or `null` for an avatar standing on its own. */
export const useAvatarGroup = () => useContext(AvatarGroupContext);
