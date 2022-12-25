import Link from "next/link";
import type { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface Props
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  inMenu?: boolean;
  external?: boolean;
}

const Header = ({ children, href, inMenu = false, external }: Props) => {
  return (
    <Link
      href={{ pathname: href }}
      className={clsx(
        "flex items-center gap-1 text-gray-600",
        inMenu
          ? "w-full px-4 py-2 text-gray-900"
          : "underline decoration-transparent decoration-auto underline-offset-4 transition-[text-decoration] hover:text-brand hover:decoration-brand",
      )}
      target={external ? "_blank" : undefined}
    >
      {children}
      {external && <ArrowTopRightOnSquareIcon className="h-4 w-4" />}
    </Link>
  );
};

export default Header;
