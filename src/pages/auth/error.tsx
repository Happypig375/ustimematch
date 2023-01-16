import Header from "@components/Header";

const Error = () => {
  return (
    <Header>
      <div className="grid w-full place-items-center">
        <h1 className="text-[clamp(1rem,1.5vw,2rem)] text-2xl">
          Oops! something went wrong.
        </h1>
      </div>
    </Header>
  );
};

export default Error;
