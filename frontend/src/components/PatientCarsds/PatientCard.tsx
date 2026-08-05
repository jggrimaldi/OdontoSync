import { PatientResponse } from "../../types";
import Avatar from "../Avatar/Avatar";
import { formatCpf, formatPhone } from "../../utils/helpers";

interface PacienteCardProps {
  patient: PatientResponse;
  selected: boolean;
  onClick: () => void;
  onAvatarClick?: () => void;
  animationDelay?: number;
}

export default function PacienteCard({
  patient,
  selected,
  onClick,
  onAvatarClick,
  animationDelay = 0,
}: PacienteCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        fade-up relative bg-white border-2 rounded-2xl p-5 cursor-pointer card-hover shadow-sm
        flex items-center gap-4
        sm:aspect-square sm:flex-col sm:items-center sm:justify-center sm:gap-3 sm:p-6 sm:text-center
        ${selected ? "border-pink-400 bg-pink-50 ring-2 ring-pink-100" : "border-pink-200 hover:border-pink-300"}
      `}
      style={{
        animationDelay: `${animationDelay}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation(); // não dispara o onClick do card
          onAvatarClick?.();
        }}
      >
        <Avatar name={patient.name} size="lg" />
      </div>

      <div className="flex-1 min-w-0 sm:flex-none sm:w-full">
        <div className="flex items-center justify-between gap-2 mb-1 sm:flex-col sm:gap-1 sm:mb-2">
          <span className="font-semibold text-gray-800 truncate sm:max-w-full">
            {patient.name}
          </span>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {patient.age} anos
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 sm:justify-center">
          <span className="text-xs text-gray-400">
            {formatCpf(patient.cpf)}
          </span>
          <span className="text-xs text-gray-200 sm:hidden">·</span>
          <span className="text-xs text-gray-400">
            {formatPhone(patient.phone)}
          </span>
        </div>
      </div>

      <svg
        className={`shrink-0 transition-transform duration-200 sm:hidden ${
          selected ? "rotate-90 text-pink-400" : "text-gray-200"
        }`}
        width="17"
        height="17"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 18l6-6-6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
