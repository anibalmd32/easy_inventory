"use client";
import { SalesBarChart } from "./components/SalesBarChart";
import { LastInvoices } from "./components/LastInvoices";
import { StockAlert } from "./components/StockAlert";
import { FrecuentCustomers } from "./components/FrecuentCustomers";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4 flex-1">
        <SalesBarChart />
      </div>
      <div className="flex justify-start gap-4 flex-1">
        <LastInvoices />
        <StockAlert />
        <FrecuentCustomers />
      </div>
    </div>
  );
}
