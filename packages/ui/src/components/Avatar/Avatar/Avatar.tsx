import { forwardRef, useState } from "react";

import { classNames } from "../../../utils/classNames";
import { DynamicComponentRenderer } from "../../DynamicComponentRenderer";
import { Tooltip } from "../../Tooltip";
import type { AvatarProps } from "../Avatar.types";
import { initialsFrom } from "../Avatar.utils";
import { useAvatarGroup } from "../useAvatarGroup";

/** Long enough not to fire while the pointer crosses the row, short enough to feel instant. */
const NAME_DELAY = 150;

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * A picture of someone, falling back to their initials.
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src={user.image} />
 * <Avatar name="Ada Lovelace" size="lg" />
 * <Avatar shape="rounded" fallback={<BotIcon />} />
 * ```
 */
const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      fallback,
      size,
      shape,
      color = "default",
      className,
      onClick,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const group = useAvatarGroup();

    // Which src failed, rather than whether one did. A new src is then a fresh attempt on
    // its own, with no effect needed to reset anything.
    const [failedSrc, setFailedSrc] = useState<string>();

    const label = alt ?? name;
    const showImage = !!src && failedSrc !== src;
    const initials = name ? initialsFrom(name) : "";
    const clickable = !!onClick;

    /*
     * A clickable avatar is a control, so it takes the focus and the role of one. The
     * image carries its own alt otherwise, and the label is only needed when the fallback
     * is what is on screen.
     */
    const roleProps = clickable
      ? { role: "button" as const, tabIndex: 0, "aria-label": label }
      : !showImage && label
        ? { role: "img" as const, "aria-label": label }
        : {};

    const avatar = (
      <span
        ref={ref}
        className={classNames("GeckoUIAvatar", className)}
        data-size={size ?? group?.size ?? "md"}
        data-shape={shape ?? group?.shape ?? "circle"}
        data-color={color}
        data-clickable={clickable || undefined}
        onClick={onClick}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (!clickable || (event.key !== "Enter" && event.key !== " ")) return;

          // Dispatching a real click rather than calling the handler, so it arrives with a
          // mouse event like every other one does.
          event.preventDefault();
          event.currentTarget.click();
        }}
        {...roleProps}
        {...rest}>
        {showImage ? (
          <img
            className="GeckoUIAvatar__image"
            src={src}
            alt={label ?? ""}
            onError={() => setFailedSrc(src)}
          />
        ) : (
          <span className="GeckoUIAvatar__fallback" aria-hidden="true">
            {fallback ? (
              <DynamicComponentRenderer component={fallback} />
            ) : (
              initials || <PersonIcon />
            )}
          </span>
        )}
      </span>
    );

    if (!group) return avatar;

    /*
     * Inside a group the avatar sits in a slot that never moves. The lift is applied to the
     * avatar within it, so the pointer target stays where it was: raise the avatar itself
     * and hovering near its bottom edge drops it straight back out from under the pointer,
     * which flickers. Hovering the slot covers both the space the avatar left and the
     * avatar wherever it has risen to, because it is still a descendant.
     */
    const slot = <span className="GeckoUIAvatarGroup__slot">{avatar}</span>;

    if (!group.interactive || !name) return slot;

    // Tooltip clones the slot rather than wrapping it, so the group still sees the slot as
    // its own child and the overlap holds.
    return (
      <Tooltip content={name} placement="top" delayDuration={NAME_DELAY} triggerAsChild>
        {slot}
      </Tooltip>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
