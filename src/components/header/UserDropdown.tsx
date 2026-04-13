import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import UserForm from "../../modals/FormUser";
import { Modal } from "../ui/modal";
import { UserFormData } from "../../interface";
import { logout } from "../../utils/auth";

interface Props {
  user?: UserFormData | null;
}

export default function UserDropdown({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);

  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const getInitials = (name?: string) => {
    if (!name) return "US";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePerfil = () => {
    if (!user) return;

    setSelectedUser(user);
    setIsModalOpen(true);
    closeDropdown();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/signin");
    }
  };

  return (
    <div className="relative">
      {/* BOTÃO */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-800 dark:text-white"
      >
        <span className="mr-3 flex items-center justify-center rounded-full h-11 w-11 bg-gray-200 dark:bg-gray-700 text-sm font-bold">
          {getInitials(user?.name)}
        </span>

        <span className="mr-1">{user?.name || "Usuário"}</span>

        <ChevronDown
          size={18}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4 w-[260px] rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
      >
        {/* INFO USUÁRIO */}
        <div>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.username || "Nome Usuário"}
          </span>
        </div>

        {/* MENU */}
        <ul className="pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={handlePerfil}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <User size={18} />
              Perfil
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <Settings size={18} />
              Configurações
            </DropdownItem>
          </li>
        </ul>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-3 py-2 mt-3 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
        >
          <LogOut size={18} />
          Sair
        </button>
      </Dropdown>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm
          user={selectedUser}
          onCancel={() => setIsModalOpen(false)}
          onSave={(data) => {
            console.log("Dados:", data);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
