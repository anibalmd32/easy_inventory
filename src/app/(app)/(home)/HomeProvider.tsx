'use client'
import { createContext, useState } from 'react'
import { EntityCountItem, MonthlyChartItem, WeeklyChartItem, LoadingData } from '@/definitions'
import LoaderOperations from '@/operations/LoaderOperations'
import { loaderInitialState } from '@/lib/utils'

interface HomeCtx {
	loaderOperations: LoaderOperations;
	entityCountData: EntityCountItem[];
	monthlyChartData: MonthlyChartItem[];
	weeklyChartData: WeeklyChartItem[];
}

interface ProviderProps {
	children: React.ReactNode;
	initialData: Omit<HomeCtx, 'loaderOperations'>;
}

export const HomeContext = createContext<HomeCtx>({} as HomeCtx)

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
		<HomeContext.Provider value={{
			loaderOperations,
			entityCountData,
			monthlyChartData,
			weeklyChartData
		}}>
			{children}
		</HomeContext.Provider>
	)	
}
