'use client'

import { InvoicesCharts } from './components/InvoicesCharts'
import { CountEntites } from './components/CountEntities'
import { useEffect } from 'react'
import { testPrisma } from './actions/testPrisma'

export default function Home() {

  useEffect(() => {
    testPrisma()
      .then(res => {
        console.log('Esta es la respuesta del server action:', res)
      })

  }, [])
  
  return (
    <div className="flex flex-col md:flex-col-reverse gap-4">
        <InvoicesCharts />
        <CountEntites />
    </div>
  );
}
