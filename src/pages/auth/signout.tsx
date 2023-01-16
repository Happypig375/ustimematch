import Header from "@components/Header";

const SignOut = () => {
  return (
    <Header>
      <div className="grid w-full place-items-center">
        <h1 className="text-[clamp(1rem,1.5vw,2rem)] text-2xl">
          You have been sucessfully signed out.
        </h1>
      </div>
    </Header>
  );
};

export default SignOut;
