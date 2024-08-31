'use server'
import { monthlyChartData, weeklyChartData } from './charts.mock'

export async function getMonthlyChartData() {
	return monthlyChartData
}

export async function getWeeklyChartData() {
	return weeklyChartData
}
