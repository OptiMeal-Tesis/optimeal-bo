export const EllipsisVerticalIcon = ({
  width = 24,
  height = 24,
  color = "currentColor",
  onClick,
}: {
  width?: number;
  height?: number;
  color?: string;
  onClick?: () => void;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      className="cursor-pointer"
    >
      <circle cx="12" cy="12" r="1"/>
      <circle cx="12" cy="5" r="1"/>
      <circle cx="12" cy="19" r="1"/>
    </svg>
  );
};


