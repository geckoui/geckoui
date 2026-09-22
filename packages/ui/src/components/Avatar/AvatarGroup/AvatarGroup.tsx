import { Children, isValidElement } from "react";

import { classNames } from "../../../utils/classNames";
import { Tooltip } from "../../Tooltip";
import type { AvatarGroupOverflow, AvatarGroupProps, AvatarProps } from "../Avatar.types";
import Avatar from "../Avatar/Avatar";
import { AvatarGroupContext } from "../useAvatarGroup";

/** Long enough not to fire while the pointer crosses the row, short enough to feel instant. */
const NAME_DELAY = 150;

const defaultOverflow = ({ avatars }: AvatarGroupOverflow) => (
  <ul className="GeckoUIAvatarGroup__list">
    {avatars.map((avatar, index) => (
      <li key={index} className="GeckoUIAvatarGroup__list__item">
        <Avatar {...avatar} size="xs" />
        {avatar.name}
      </li>
    ))}
  </ul>
);

/**
 * Overlapping avatars, with the rest counted once there are more than `max`.
 *
 * `size` and `shape` set here apply to every avatar inside, so the overlap lines up
 * without repeating them. Each avatar sits on top of the one after it, so the children are
 * handed over reversed and the styles lay them out right to left.
 *
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar name="Ada Lovelace" />
 *   <Avatar name="Grace Hopper" />
 *   <Avatar name="Alan Turing" />
 *   <Avatar name="Katherine Johnson" />
 * </AvatarGroup>
 * ```
 *
 * @example
 * Your own contents behind the count:
 *
 * ```tsx
 * <AvatarGroup
 *   max={3}
 *   renderOverflow={({ avatars }) => (
 *     <ul>
 *       {avatars.map((avatar) => (
 *         <li key={avatar.name}>{avatar.name}</li>
 *       ))}
 *     </ul>
 *   )}>
 *   …
 * </AvatarGroup>
 * ```
 */
const AvatarGroup = ({
  max,
  size = "md",
  shape = "circle",
  interactive = true,
  renderOverflow = defaultOverflow,
  className,
  children,
  ...rest
}: AvatarGroupProps) => {
  const items = Children.toArray(children);
  const visible = max && max > 0 ? items.slice(0, max) : items;

  // Handed over as data, not as the elements, so the overflow can be rendered as something
  // other than avatars. Anything that is not an avatar stays in the list as an empty entry,
  // so the count never disagrees with what is behind it.
  const avatars = items
    .slice(visible.length)
    .map((child) => (isValidElement(child) ? (child.props as AvatarProps) : {}));

  const chip = avatars.length ? (
    <Avatar
      className="GeckoUIAvatarGroup__overflow"
      fallback={`+${avatars.length}`}
      role="img"
      aria-label={`${avatars.length} more`}
    />
  ) : null;

  return (
    <AvatarGroupContext.Provider value={{ size, shape, interactive }}>
      <div
        className={classNames("GeckoUIAvatarGroup", className)}
        data-size={size}
        data-interactive={interactive || undefined}
        {...rest}>
        {chip && interactive ? (
          <Tooltip
            placement="top"
            delayDuration={NAME_DELAY}
            triggerAsChild
            content={
              /*
               * Still under the group's provider, so it is turned off here. Otherwise each
               * avatar inside opens a tooltip of its own within the tooltip it is already
               * in. An explicit `size` on an avatar still wins over the `xs` default.
               */
              <AvatarGroupContext.Provider value={{ size: "xs", interactive: false }}>
                {renderOverflow({ avatars })}
              </AvatarGroupContext.Provider>
            }>
            {chip}
          </Tooltip>
        ) : (
          chip
        )}

        {[...visible].reverse()}
      </div>
    </AvatarGroupContext.Provider>
  );
};

AvatarGroup.displayName = "AvatarGroup";

export default AvatarGroup;
