interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-gray-600">
        {label}
        {required && <span className="text-pink-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 bg-gray-50 border-2 rounded-xl text-sm text-gray-700
          placeholder-gray-500 focus:outline-none focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-50"
              : "border-gray-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-50"
          }
        `}
      />
      {error && (
        <span className="text-xs text-red-400 flex items-center gap-1">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
