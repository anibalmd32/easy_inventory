import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';

export function HeaderMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="bg-gray-900 hover:bg-gray-800 text-gray-200">
					Operaciones
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-gray-950 text-gray-200">
				<DropdownMenuLabel>Empresa</DropdownMenuLabel>
				<DropdownMenuItem className="cursor-pointer">Facturacion</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer">Lista de compras</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer">Reportes</DropdownMenuItem>

				<DropdownMenuSeparator />
				<DropdownMenuLabel>Aplicacion</DropdownMenuLabel>
				<DropdownMenuItem className="cursor-pointer">Cerrar Sesion</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
