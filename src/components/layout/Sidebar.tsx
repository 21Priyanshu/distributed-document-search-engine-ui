import {
  FileText,
  Upload,
  Search,
  Settings,
  X
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const navItems = [
  { label: "Documents", icon: FileText },
  { label: "Upload", icon: Upload },
  { label: "Search", icon: Search },
  { label: "Settings", icon: Settings }
];

export const Sidebar = ({ open, onClose }: Props) => {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50
          h-full w-64 bg-white border-r
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button */}
        <div className="flex items-center justify-between p-4">
          <span className="font-semibold">Menu</span>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};
