interface Props {
  color: string;
}

const ColorChip = ({ color }: Props) => {
  return (
    <div
      style={{ backgroundColor: color }}
      // flex-shrink-0 to prevent truncated text squashing the color chip
      className="h-5 w-5 flex-shrink-0 rounded-md shadow-outline"
    />
  );
};

export default ColorChip;
