'use client'

import { EntityCountItem, TRENDING } from '@/definitions'
import { Receipt, DollarSign, Users, Calculator, ShoppingCart } from 'lucide-react'

export const entityCountData: EntityCountItem[] = [
	{
		title: 'Ventas del último mes',
		icon: Receipt,
		percentage: {
			rate: '20.1',
			tendency: TRENDING.UP
		},
		totalCount: 1325,
		isCash: true,
	},
	{
		title: 'Ventas la última semana',
		icon: DollarSign,
		percentage: {
			rate: '20.1',
			tendency: TRENDING.UP
		},
		totalCount: 324,
		isCash: true,
	},
	{
		title: 'Total de clientes',
		icon: Users,
		percentage: {
			rate: '20.1',
			tendency: TRENDING.UP,
		},
		totalCount: 92,
	},
	{
		title: 'Facturas Pagadas',
		icon: Calculator,
		percentage: {
			rate: '20.1',
			tendency: TRENDING.UP
		},
		totalCount: 100,
	},
	{
		title: 'Productos vendidos',
		icon: ShoppingCart,
		percentage: {
			rate: '20.1',
			tendency: TRENDING.UP
		},
		totalCount: 325
	}
]