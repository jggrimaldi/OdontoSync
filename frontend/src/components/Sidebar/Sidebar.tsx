import { ChangeEvent, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiEdit2, FiLoader, FiLogOut, FiMail, FiX } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onEditDentist?: () => void;
}

export default function Sidebar({ isOpen, onClose, onEditDentist }: SidebarProps) {
  const { dentist, logout, updateDentistProfileImage } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const displayName = dentist?.name ?? "Emylle";
  const displayEmail = dentist?.email ?? "emylle@clinica.com";
  const displayCro = dentist?.cro ?? "12345-SP";

  const initials =
    displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "D";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditProfile = () => {
    onEditDentist?.();
    onClose();
  };

  async function fileToDataUrl(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
      reader.readAsDataURL(file);
    });
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      setIsUploadingImage(true);
      const imageUrl = await fileToDataUrl(file);
      await updateDentistProfileImage({ imageUrl });
    } catch (error) {
      console.error("Erro ao atualizar foto do dentista", error);
      alert("Não foi possível atualizar a foto de perfil.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-pink-100 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-[73px] lg:z-auto lg:shadow-none lg:w-64 lg:h-[calc(100vh-73px)] lg:self-start overflow-y-auto flex flex-col
        `}
      >
        <div className="p-6 grow">
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 text-pink-400 hover:text-pink-600"
          >
            <FiX size={24} />
          </button>

          <div className="flex flex-col items-center text-center bg-pink-50 rounded-2xl p-4 border border-pink-100 shadow-sm">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploadingImage}
              className="group relative w-20 h-20 mb-3 rounded-full overflow-hidden border-4 border-white shadow-sm bg-linear-to-br from-pink-400 to-pink-500 text-white disabled:cursor-wait"
              aria-label="Trocar foto do dentista"
            >
              {dentist?.imageUrl ? (
                <img
                  src={dentist.imageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-lg font-bold">
                  {initials}
                </span>
              )}

              <span className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isUploadingImage ? <FiLoader className="animate-spin" size={18} /> : <FiCamera size={18} />}
              </span>
            </button>

            <h2 className="text-md font-bold text-gray-800 uppercase tracking-tight">
              Dra. {displayName}
            </h2>
            <p className="text-xs text-pink-500 font-semibold mb-1">Dentista Especialista</p>
            <p className="text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded-full border border-pink-100">
              CRO: {displayCro}
            </p>
            <p className="mt-2 text-[11px] text-gray-400">
              Clique na foto para trocar a imagem de perfil.
            </p>

            <button
              onClick={handleEditProfile}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-white border border-pink-200 text-pink-600 rounded-xl hover:bg-pink-100 transition-all font-bold text-xs shadow-sm"
            >
              <FiEdit2 size={14} />
              Editar Perfil
            </button>
          </div>

          <div className="mt-6 px-2">
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <FiMail className="text-pink-400" />
              <span className="truncate">{displayEmail}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-pink-50 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <FiLogOut className="text-gray-500 group-hover:text-red-500" size={18} />
            </div>
            <span className="font-bold text-sm tracking-wide">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
