import Link from "next/link";
import type { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import React from "react";

interface Props
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  inMenu?: boolean;
  external?: boolean;
}

const NavLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ children, href, inMenu = false, external, ...props }, ref) => (
    <Link
      {...props}
      ref={ref}
      href={{ pathname: href }}
      className={clsx(
        "flex items-center gap-1 text-gray-600 hover:text-gray-900",
        inMenu
          ? "w-full border-b border-gray-200 px-4 py-2 first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md last:border-b-0 hover:bg-bg-light-200 hover:ring-0 hover:ring-offset-0"
          : "underline decoration-transparent decoration-[1.5px] underline-offset-4 transition-[text-decoration] hover:decoration-brand",
      )}
      target={external ? "_blank" : undefined}
    >
      {children}
      {external && <ArrowTopRightOnSquareIcon className="h-4 w-4" />}
    </Link>
  ),
);
NavLink.displayName = "NavLink";

export default NavLink;
