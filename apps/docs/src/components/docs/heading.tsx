import { Link2 } from "lucide-react";
import type { ComponentProps } from "react";

type Level = "h2" | "h3" | "h4";

export function heading(Tag: Level) {
  function Heading({ id, children, ...props }: ComponentProps<Level>) {
    return (
      <Tag id={id} className="group" {...props}>
        {children}
        {id && (
          <a
            href={`#${id}`}
            data-plain
            aria-label="Link to this section"
            className="ml-2 inline-flex align-middle text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100">
            <Link2 className="size-4" />
          </a>
        )}
      </Tag>
    );
  }

  return Heading;
}
