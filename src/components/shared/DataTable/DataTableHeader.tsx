import { TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { DataTableComponentsProps } from "./types"
import { flexRender } from "@tanstack/react-table"

export function DataTableHeader<TData>({
	table,
}: DataTableComponentsProps<TData>) {
	return (
		<TableHeader>
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header) => {
						return (
							<TableHead key={header.id}>
								{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
							</TableHead>
						)
					})}
				</TableRow>
			))}
		</TableHeader>
	)
}
