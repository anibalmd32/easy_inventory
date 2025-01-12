import { Home, Sheet, CircleDollarSign } from 'lucide-react';

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
];

export default menuItems;
