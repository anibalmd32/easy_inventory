import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { frecuentCustomersMock } from "./frecuentCustomersMock"
import { Users } from 'lucide-react'

export function FrecuentCustomers() {
	return (
		<Card className="bg-gray-900 text-gray-200 flex-1">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Users className="w-8 h-8" />
					Clientes frecuentes
				</CardTitle>
				<CardDescription>Lista de los clientes mas frecuentes</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{frecuentCustomersMock.map((customer, index) => (
					<div key={index} className="flex flex-col gap-2 text-sm items-center bg-gray-950 p-4 rounded-lg hover:bg-gray-800 transition-all duration-300">
						<div className="flex justify-between w-full">
							<p className="font-bold text-xl">{customer.name}</p>
							<p className="font-bold">Compras</p>
						</div>
						<div className="flex justify-between w-full">
							<p className="text-sm">{customer.dni}</p>
							<p className="text-sm text-blue-500">{customer.purchases}</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
