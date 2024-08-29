import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { DataTableProps } from './types'
import { flexRender } from '@tanstack/react-table'

export function DataTableBody<TData, TValue>({
	tableHook: table,
	columns,
}: DataTableProps<TData, TValue>) {
	return (
		<>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							Sin resultados.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</>
	)
}
