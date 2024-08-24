import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { frecuentCustomersMock } from "./frecuentCustomersMock"
import { Users, ArrowRight } from 'lucide-react'

export function FrecuentCustomers() {
	return (
		<Card className="bg-gray-900 text-gray-200 flex-1">
			<CardHeader>
				<CardTitle className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Users className="w-8 h-8 text-blue-500" />
						Clientes frecuentes
					</div>
					<div>
						<div className="rounded-md hover:bg-gray-600 p-2 cursor-pointer transition-all duration-300">
							<ArrowRight className="w-8 h-8" />
						</div>
					</div>
				</CardTitle>
				<CardDescription>Lista de los clientes mas frecuentes</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{frecuentCustomersMock.map((customer, index) => (
					<div key={index} className="flex flex-col gap-2 items-center bg-gray-950 p-4 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer">
						<div className="flex justify-between w-full">
							<p className="font-bold">{customer.name}</p>
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
