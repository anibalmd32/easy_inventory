"use client";
import { SalesBarChart, MonthlySalesAreaChart } from "./components/SalesBarChart";
import { LastInvoices } from "./components/LastInvoices";
import { StockAlert } from "./components/StockAlert";
import { FrecuentCustomers } from "./components/FrecuentCustomers";
import { Totals } from "./components/Totals";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-start gap-4 flex-1">
        <SalesBarChart />
        <MonthlySalesAreaChart />
        <Totals />
      </div>
      <div className="flex justify-start gap-4 flex-1">
        <LastInvoices />
        <StockAlert />
        <FrecuentCustomers />
      </div>
    </div>
  );
}
