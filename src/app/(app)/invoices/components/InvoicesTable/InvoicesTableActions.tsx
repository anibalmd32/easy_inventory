import { InvoiceData } from "../../definitions/invoicesData"
import { Calendar, User, Loader, Printer} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { InvoiceStatus, } from "@/definitions/enums"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Item } from "./invoicesMock"
import { DialogDescription } from "@radix-ui/react-dialog"
import {Button} from "@/components/ui/button"

interface InvoiceActionsProps {
	rowData: InvoiceData
}

export const InvoiceDetails = ({ rowData }: InvoiceActionsProps) => {
	const date = rowData.generatedAt
	const formatedDate = new Date(date).toLocaleDateString('es-ES', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	const status = rowData.status;
	const quantityClass = status === InvoiceStatus.PAID ? 'text-green-500' : 'text-red-500';
	const items = rowData.items as unknown as Item[];
	const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

	return (
		<Dialog>
			<DialogTrigger className="cursor-pointer hover:bg-gray-200 text-gray-200 hover:text-black transition-all duration-300 w-full p-1 pl-2 rounded-sm text-left mt-1 text-sm">Ver Detalles</DialogTrigger>
			<DialogContent aria-describedby="modal-heading" className="md:min-w-[800px] bg-gray-950 text-gray-200">
				<DialogHeader id="modal-heading">
					<DialogTitle className="text-2xl font-bold">Factura #{rowData.id}</DialogTitle>
				</DialogHeader>

				{/* Short details */}
				<div className="flex gap-4 flex-col md:flex-row text-sm" aria-describedby="modal-heading">
					<div className="flex gap-2 items-center">
						<User />
						<span>{rowData.customer.name}</span>
					</div>
					<div className="flex gap-2 items-center">
						<Calendar />
						<span>{formatedDate}</span>
					</div>
					<div className="flex gap-2 items-center">
						<Loader />
						<Badge className={quantityClass}>
							{status === InvoiceStatus.PAID && "Pagada"}
							{status === InvoiceStatus.CANCELED && "Cancelada"}
							{status === InvoiceStatus.PENDING && "Por pagar"}
						</Badge>
					</div>
				</div>

				{/* Table items */}
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-gray-900/20">
							<TableHead>Producto</TableHead>
							<TableHead>Precio</TableHead>
							<TableHead>Cantidad</TableHead>
							<TableHead className="text-right">Total</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items && items.map((item) => (
							<TableRow key={item.id} className="hover:bg-gray-800/20">
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.price}</TableCell>
								<TableCell>{item.quantity}</TableCell>
								<TableCell className="text-right">${item.price * item.quantity}</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter className="bg-gray-900">
						<TableRow className="hover:bg-gray-800/20">
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right">${total}</TableCell>
						</TableRow>
					</TableFooter>
				</Table>

				<div>
					<Button variant="outline" className="text-sm w-full flex gap-2 items-center bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white">
						<Printer />
						<span>
							Imprimir
						</span>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
