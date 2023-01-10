import { IconExternalLink } from "@tabler/icons";
import clsx from "clsx";
import Link from "next/link";
import type { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import React from "react";

interface Props
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  icon?: React.ReactElement;
  inMenu?: boolean;
  external?: boolean;
}

const NavLink = React.forwardRef<HTMLAnchorElement, Props>(
  (
    { children, href, icon, inMenu = false, external = false, ...props },
    ref,
  ) => (
    <Link
      {...props}
      ref={ref}
      href={{ pathname: href }}
      target={external ? "_blank" : undefined}
      className={clsx(
        "flex items-center text-text-black-100 hover:text-text-black-200",
        icon && inMenu ? "gap-2" : icon && "gap-[6px]",
        inMenu
          ? "border-b border-border-gray-100 px-4 py-2 first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md last:border-b-0 hover:bg-bg-light-200 hover:ring-0 hover:ring-offset-0 active:bg-bg-light-200"
          : `shadow-[0_2px_transparent] transition-shadow hover:shadow-[0_2px_#003366]`,
      )}
    >
      {icon}
      <div className={clsx("flex items-center", external && "gap-1")}>
        {children}
        {external && <IconExternalLink stroke={1.75} className="h-4 w-4" />}
      </div>
    </Link>
  ),
);
NavLink.displayName = "NavLink";

export default NavLink;
