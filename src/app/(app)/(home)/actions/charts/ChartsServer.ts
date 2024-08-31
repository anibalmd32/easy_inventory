'use server'

import { monthlyChartData, weeklyChartData } from './charts.mock'

export class ChartsServer {
	async getMonthlyChartData() {
		return monthlyChartData
	}

	async getWeeklyChartData() {
		return weeklyChartData
	}
}
