import clsx from "clsx";
import type { HTMLAttributes } from "react";

const Spinner = ({ className }: HTMLAttributes<HTMLOrSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("h-5 w-5 fill-fg-100", className)}
    >
      <style>{"@keyframes spinner{to{transform:rotate(360deg)}}"}</style>
      <path
        d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 19a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"
        opacity={0.2}
      />
      <path
        d="M12 4a8 8 0 0 1 7.89 6.7 1.53 1.53 0 0 0 1.49 1.3 1.5 1.5 0 0 0 1.48-1.75 11 11 0 0 0-21.72 0A1.5 1.5 0 0 0 2.62 12a1.53 1.53 0 0 0 1.49-1.3A8 8 0 0 1 12 4Z"
        style={{
          transformOrigin: "center",
          animation: "spinner 1s infinite linear",
        }}
      />
    </svg>
  );
};

export default Spinner;
