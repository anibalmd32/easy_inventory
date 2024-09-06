import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { AlignJustify } from 'lucide-react';
import Link from 'next/link';

export function HeaderMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          {/* Icono para Mobile */}
          <Button className="bg-gray-900 hover:bg-gray-800 text-gray-200 p-2 md:hidden">
            <AlignJustify className="w-6 h-6" />
          </Button>

          {/* Botón para Desktop */}
          <Button className="bg-gray-900 hover:bg-gray-800 text-gray-200 hidden md:block">
            Operaciones
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-950 text-gray-200">
        <DropdownMenuLabel>Empresa</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/billing">Facturación</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Lista de compras</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Aplicación</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer">Cerrar Sesión</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
