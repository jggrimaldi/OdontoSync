import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { dentist } = useAuth();

  const initials =
    dentist?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "D";

  return (
    <header className="bg-white border-b border-pink-100 px-5 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-pink-400 rounded-xl flex items-center justify-center shadow-sm">
          <svg
            width="20"
            height="20"
            viewBox="0 0 64 64"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M32 6C26 6 22 9 18 9C12 9 8 14 8 21C8 30 14 40 16 48C17 52 20 56 24 56C28 56 29 50 32 50C35 50 36 56 40 56C44 56 47 52 48 48C50 40 56 30 56 21C56 14 52 9 46 9C42 9 38 6 32 6Z" />
          </svg>
        </div>
        <span className="font-bold text-gray-800 text-lg">OdontoSync</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{dentist?.name}</p>
            <p className="text-xs text-gray-400">{dentist?.cro || "Dentista"}</p>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-linear-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
            {dentist?.imageUrl ? (
              <img
                src={dentist.imageUrl}
                alt={dentist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </div>

        <button
          onClick={() => {
            onToggleSidebar?.();
          }}
          className="md:hidden w-9 h-9 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center hover:bg-pink-100 transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="#f472b6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
