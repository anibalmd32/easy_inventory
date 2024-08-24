"use client";
import { SalesBarChart } from "./components/SalesBarChart";
import { LastInvoices } from "./components/LastInvoices";
import { StockAlert } from "./components/StockAlert";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <SalesBarChart />
      </div>
      <div className="flex justify-start gap-4">
        <LastInvoices />
        <StockAlert />
      </div>
    </div>
  );
}
