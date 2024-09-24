import { Home, Sheet, CircleDollarSign, Settings } from 'lucide-react';

export type MenuItem = {
  name: string;
  href: string;
  icon: any;
};

const menuItems = [
  {
    name: 'Inicio',
    href: '/',
    icon: Home,
  },
  {
    name: 'Inventario',
    href: '/inventory',
    icon: Sheet,
  },
  {
    name: 'Facturas',
    href: '/invoices',
    icon: CircleDollarSign,
  },
  {
    name: 'Configuraciones',
    href: '/settings',
    icon: Settings,
  },
];

export default menuItems;
