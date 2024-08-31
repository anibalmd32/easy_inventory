import { useContext } from 'react'
import { BillingContext } from './BillingProvider'

export const useBilling = () => useContext(BillingContext)
