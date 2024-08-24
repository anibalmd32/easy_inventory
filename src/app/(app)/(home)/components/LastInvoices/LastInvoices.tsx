import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { lastInvoicesMock } from "./lastInvoicesMock"
import { BanknoteIcon, Check, Calculator } from 'lucide-react'
import { InvoiceStatus } from "@/definitions/enums";

export function LastInvoices() {
	return (
		<Card className="bg-gray-900 text-gray-200 flex-1">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calculator className="w-8 h-8 text-green-500" />
					Ultimas facturas
				</CardTitle>
				<CardDescription>Ultimas facturas pagadas</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{lastInvoicesMock.map((invoice, index) => (
					<div key={index} className="flex flex-col gap-2 justify-start items-center bg-gray-950 p-4 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer">
						<div className="flex justify-between w-full">
							<p className="font-bold">
								${invoice.total}
							</p>
							<p className="font-bold">
								Estado
							</p>
						</div>
						<div className="flex justify-between w-full">
							<p className="text-sm">
								{new Date(invoice.generatedAt).toLocaleDateString()}
							</p>
							<p className="text-sm flex items-center gap-1 text-green-500">
								{invoice.status === InvoiceStatus.PAID && "Pagada"}
								<Check className="w-4 h-4" />
							</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
