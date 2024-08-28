import { Table as ITable, flexRender } from "@tanstack/react-table";
import { InvoiceData } from "../../definitions/data";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { InvoicesTableColumns } from "./InvoicesTableColumn"

interface InvoicesTableProps {
	table: ITable<InvoiceData>;
}

export function InvoicesTable({ table }: InvoicesTableProps) {
	return (
		<div className="rounded-md border bg-gray-950">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)
										}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => {

							return (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								className="hover:bg-gray-800/20"
							>
								{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id} className="whitespace-nowrap">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
								))}
							</TableRow>
						)
					})
					) : (	
						<TableRow>
							<TableCell colSpan={InvoicesTableColumns.length} className="h-24 text-center">
								Sin resultados.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
