const Paragraph = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className="flex w-full flex-col gap-2 text-left">{children}</div>;
};

// eslint-disable-next-line react/display-name
Paragraph.Title = ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className="text-2xl font-black">{children}</h1>
);

// eslint-disable-next-line react/display-name
Paragraph.Body = ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="text-sm sm:text-base">{children}</p>
);

export default Paragraph;
