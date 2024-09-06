import { Bell, ShoppingBag, ShoppingCart, User, Pencil } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Notification, APP_ACTIONS } from '@/definitions';

const NotificationsMockData: Notification[] = [
  {
    id: 1,
    action: APP_ACTIONS.SELL,
    description: 'Se ha añadido un nuevo pedido',
    emittedAt: '2022-01-03',
  },
  {
    id: 2,
    action: APP_ACTIONS.ADD,
    description: 'Se ha añadido un nuevo pedido',
    emittedAt: '2022-01-03',
  },
];

export function Notifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer relative hover:bg-gray-800 transition-all duration-300 rounded-md p-2 flex items-center">
          <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-gray-200 text-white flex items-center justify-center'></span>
          <Bell className="h-6 w-6" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-950 text-gray-200">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        {NotificationsMockData.map((notification, index) => (
          <DropdownMenuItem key={index} className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="ml-2 text-sm">{notification.description}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-[12px]">
          Marcar como leído <Pencil className="ml-2 h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
