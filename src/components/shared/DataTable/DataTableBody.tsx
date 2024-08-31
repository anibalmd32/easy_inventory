import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ColumnDef, flexRender, Table } from '@tanstack/react-table'

type DataTableBodyProps<TData, TValue> = {
	table: Table<TData>;
	columns: ColumnDef<TData, TValue>[]
}

export function DataTableBody<TData, TValue>({
	table,
	columns,
}: DataTableBodyProps<TData, TValue>) {
	return (
		<>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className='hover:bg-gray-800'>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id} className='min-w-16'>
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