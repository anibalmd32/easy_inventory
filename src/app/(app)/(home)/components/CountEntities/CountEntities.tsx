import { CountCustomers } from './CountCustomers'
import { CountPaidInvoices } from './CountPaidInvoices'
import { CountSoldProduct } from './CountSoldProduct'
import { CountLastMonthSales } from './CountLastMonthSales'
import { CountLastWeekSales } from './CountLastWeekSales'

export function CountEntites() {
	return (
		<div className="grid gap-4 grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-5">
			<CountLastMonthSales />
			<CountLastWeekSales />
			<CountCustomers />
			<CountPaidInvoices />

			<div className='col-span-2 md:col-span-1'>
				<CountSoldProduct />
			</div>
		</div>
	)
}
