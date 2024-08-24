"use client";
import { InvoicesCharts } from './components/InvoicesCharts'
import { CountEntites } from './components/CountEntities'

export default function Home() {
  return (
    <div className="flex flex-col md:flex-col-reverse gap-4">
        <InvoicesCharts />
        <CountEntites />
    </div>
  );
}
