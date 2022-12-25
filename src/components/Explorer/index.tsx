import { BanknotesIcon } from "@heroicons/react/20/solid";
import Button from "@ui/Button";

const Explorer = () => {
  return (
    <div className="m-4 flex flex-col items-center gap-4">
      <Button fullWidth>Full Width</Button>
      <Button icon>
        <BanknotesIcon className="h-5 w-5" />
      </Button>
      <Button loading fullWidth>
        Loading
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  );
};

export default Explorer;
