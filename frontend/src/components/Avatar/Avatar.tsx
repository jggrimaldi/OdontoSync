import { getAvatarColor, getInitials } from "../../utils/helpers";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  border?: boolean;
}

const sizeClasses = {
  sm: "w-9 h-9 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-16 h-16 text-lg",
};

export default function Avatar({
  name,
  size = "md",
  border = false,
}: AvatarProps) {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${getAvatarColor(name)}
        ${border ? "border-4 border-white shadow" : ""}
        rounded-full flex items-center justify-center font-bold shrink-0
      `}
    >
      {getInitials(name)}
    </div>
  );
}
