import clsx from "clsx";
import Spinner from "./Spinner";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = ({
  children,
  disabled = false,
  loading = false,
  fullWidth = false,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "bg-bg-light-3 disabled:bg-bg-light whitespace-nowrap rounded-md border border-gray-200 py-1 px-5 text-gray-600 transition-all enabled:hover:border-gray-300 enabled:hover:text-gray-900",
        fullWidth && "w-full",
      )}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
