import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FileText,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import type { MenuItem, MenuItemComponentProps } from "@/types";
import { useNavigate } from "react-router-dom";

const menuItems: MenuItem[] = [
  {
    id: "solicitacoes",
    name: "Solicitações",
    icon: FileText,
    href: "/",
  },
  {
    id: "parametros",
    name: "Parâmetros",
    icon: Settings,
    href: "/parametros",
  },
  {
    id: "usuarios",
    name: "Usuários",
    icon: Users,
    href: "/usuarios",
  },
];

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ item, level, expandedItems, onToggleExpand }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item.id);

  const paddingLeft = `${(level + 1) * 12}px`;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      onToggleExpand(item.id);
    }
  };

  const content = (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer hover:bg-secondary hover:text-foreground ${
        level > 0 ? "text-sm" : ""
      } ${level > 1 ? "text-xs" : ""}`}
      style={{ paddingLeft }}
      onClick={handleClick}
    >
      <item.icon size={level > 1 ? 14 : level > 0 ? 16 : 18} />
      <span className="flex-1">{item.name}</span>
      {hasChildren &&
        (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
    </div>
  );

  return (
    <div>
      {item.href && !hasChildren ? (
        <NavLink
          to={item.href}
          className={({ isActive }) =>
            `block text-muted-foreground ${
              isActive ? "text-primary bg-primary/10" : ""
            }`
          }
        >
          {content}
        </NavLink>
      ) : (
        <div className="text-muted-foreground">{content}</div>
      )}

      {hasChildren && isExpanded && (
        <div className="ml-2 mt-1 space-y-1">
          {item.children?.map((child) => (
            <MenuItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleLogout = () => {
    console.log('Logout');
    navigate('/login');
  };

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col h-screen">
      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              level={0}
              expandedItems={expandedItems}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};
