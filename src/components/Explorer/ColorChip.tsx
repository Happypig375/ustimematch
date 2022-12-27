interface Props {
  color: string;
}

const ColorChip = ({ color }: Props) => {
  return (
    <div
      style={{ backgroundColor: color }}
      // flex-shrink-0 to prevent truncated text squashing the color chip
      className="h-5 w-5 flex-shrink-0 rounded-md shadow-[1.5px_1.5px_2px_0_hsla(0,0%,80%,0.8),inset_0_0_2px_1px_hsla(0,0%,100%,0.2)]"
    />
  );
};

export default ColorChip;
