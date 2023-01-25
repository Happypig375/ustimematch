import { IconRefresh } from "@tabler/icons-react";
import clsx from "clsx";
import type { HTMLAttributes } from "react";

const Spinner = ({ className }: HTMLAttributes<HTMLOrSVGElement>) => {
  return (
    <IconRefresh
      strokeWidth={1.75}
      className={clsx("h-5 w-5 animate-spin", className)}
    />
  );
};

export default Spinner;
