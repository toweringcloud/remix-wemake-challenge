interface PlaceholderImageProps {
  text: string;
  className?: string;
}

export function PlaceholderImage({
  text,
  className = "",
}: PlaceholderImageProps) {
  return (
    <svg
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Placeholder: ${text}`}
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <rect width="100%" height="100%" fill="#f5f5f4"></rect>
      <text
        x="50%"
        y="50%"
        fill="#a1887f"
        dy=".3em"
        fontFamily="sans-serif"
        fontSize="16"
        textAnchor="middle"
      >
        {text}
      </text>
    </svg>
  );
}
