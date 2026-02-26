import { Menu, Flame } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 bg-navy-800 border-b border-navy-600 flex items-center px-4 gap-4 shrink-0">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden text-gray-400 hover:text-gold-400 transition-colors"
      >
        <Menu size={24} />
      </button>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 bg-gold-500 rounded-lg flex items-center justify-center">
          <Flame size={22} className="text-navy-900" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">Brasa</h1>
          <p className="text-xs text-gray-400 leading-tight">Dashboard de Vendas</p>
        </div>
      </div>
    </header>
  );
}
