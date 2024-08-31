'use client'

import { createContext, useState } from 'react'
import { EntityCountItem, MonthlyChartItem, WeeklyChartItem, LoadingData, FETCH_STATUS } from '@/definitions'
import LoaderOperations from '@/lib/operations/LoaderOperations'
import { loaderInitialState } from '@/lib/utils'

interface IHomeCtx {
	loaderOperations: LoaderOperations;
	entityCountData: EntityCountItem[];
	monthlyChartData: MonthlyChartItem[];
	weeklyChartData: WeeklyChartItem[];
}

interface ProviderProps {
	children: React.ReactNode;
	initialData: Omit<IHomeCtx, 'loaderOperations'>;
}

export const HomeCtx = createContext<IHomeCtx>({} as IHomeCtx)

export function HomeProvider({ children, initialData }: ProviderProps) {
	/** STATES */
	const [loadingData, setLoadingData] = useState<LoadingData>(loaderInitialState)
	const [entityCountData, setEntityCountData] = useState<EntityCountItem[]>(initialData.entityCountData)
	const [monthlyChartData, setMonthlyChartData] = useState<MonthlyChartItem[]>(initialData.monthlyChartData)
	const [weeklyChartData, setWeeklyChartData] = useState<WeeklyChartItem[]>(initialData.weeklyChartData)

	/** OPERATIONS */
	const loaderOperations = new LoaderOperations(setLoadingData)

	/** RETURN CONTEXT VALUES */
	return (
		<HomeCtx.Provider value={{
			loaderOperations,
			entityCountData,
			monthlyChartData,
			weeklyChartData
		}}>
			{children}
		</HomeCtx.Provider>
	)	
}
