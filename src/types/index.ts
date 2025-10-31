import type { LucideProps } from 'lucide-react';
import React from 'react';

export type IconComponent = React.ComponentType<LucideProps>;

export interface MenuItem {
  id: string;
  name: string;
  icon: IconComponent;
  href?: string;
  children?: MenuItem[];
}

export interface MenuItemComponentProps {
  item: MenuItem;
  level: number;
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
}
