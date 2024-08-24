import { InvoicesCharts } from './components/InvoicesCharts'
import { CountEntites } from './components/CountEntities'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Home() {
  
  const result = await prisma.customer.findMany()

  return (
    <div className="flex flex-col md:flex-col-reverse gap-4">
        <InvoicesCharts message={result} />
        <CountEntites />
    </div>
  );
}
