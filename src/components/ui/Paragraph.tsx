const Paragraph = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className="flex flex-col gap-2 text-left">{children}</div>;
};

// eslint-disable-next-line react/display-name
Paragraph.Title = ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className="text-xl font-bold sm:text-2xl">{children}</h1>
);

// eslint-disable-next-line react/display-name
Paragraph.Body = ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="text-xs sm:text-sm">{children}</p>
);

export default Paragraph;
