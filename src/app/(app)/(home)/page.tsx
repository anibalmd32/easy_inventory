"use client";
import { SalesBarChart } from "./components/SalesBarChart";
import { LastInvoices } from "./components/LastInvoices";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <SalesBarChart />
      </div>
      <div className="flex justify-between gap-4">
        <LastInvoices />
      </div>
    </div>
  );
}
