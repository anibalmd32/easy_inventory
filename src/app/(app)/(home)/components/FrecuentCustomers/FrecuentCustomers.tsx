import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { frecuentCustomersMock } from "./frecuentCustomersMock"

export function FrecuentCustomers() {
	return (
		<Card className="bg-gray-900 text-gray-200 flex-1">
			<CardHeader>
				<CardTitle>Clientes frecuentes</CardTitle>
				<CardDescription>Lista de los clientes mas frecuentes</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{frecuentCustomersMock.map((customer, index) => (
					<div key={index} className="flex gap-2 text-sm items-center bg-gray-950 p-4 rounded-lg hover:bg-gray-800 transition-all duration-300">
						<p className="font-bold text-xl">{ index + 1 }</p>
						<p>{customer.name}</p>
						<p>{customer.purchases} compras</p>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
