export const StatsIcon = ({
  width = 24,
  height = 24,
  color = "black",
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16.5V21.5"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 14.5V21.5"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20 10.5V21.5"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22 3.5L13.354 12.146C13.3076 12.1926 13.2524 12.2295 13.1916 12.2547C13.1309 12.2799 13.0658 12.2929 13 12.2929C12.9342 12.2929 12.8691 12.2799 12.8084 12.2547C12.7476 12.2295 12.6924 12.1926 12.646 12.146L9.354 8.854C9.26024 8.76026 9.13308 8.70761 9.0005 8.70761C8.86792 8.70761 8.74076 8.76026 8.647 8.854L2 15.5"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4 18.5V21.5"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 14.5V21.5"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
