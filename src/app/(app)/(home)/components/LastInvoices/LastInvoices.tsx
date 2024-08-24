import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { lastInvoicesMock } from "./lastInvoicesMock"
import { InvoiceStatus } from "@/definitions/enums";
import { BanknoteIcon } from 'lucide-react'

export function LastInvoices() {
	return (
		<Card className="bg-gray-900 text-gray-200 w-[400px]">
			<CardHeader>
				<CardTitle>Ultimas facturas</CardTitle>
				<CardDescription>Ultimas facturas pagadas</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{lastInvoicesMock.map((invoice, index) => (
					<div key={index} className="flex gap-2 items-center bg-gray-950 p-4 rounded-lg hover:bg-gray-800 transition-all duration-300">
						<BanknoteIcon className="w-8 h-8" />
						<p>${invoice.total}</p>
						<p>{new Date(invoice.generatedAt).toLocaleDateString()}</p>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
