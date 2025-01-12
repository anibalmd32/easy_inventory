'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SaleReport } from '@/definitions';
import { useEffect, useState } from 'react';
import { InvoicesProvider } from '@/app/(app)/invoices/InvoicesProvider';
import { InvoicesTable } from '@/app/(app)/invoices/components/InvoicesTable';

export const ReportResult = ({ report }: { report: SaleReport }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (report.items.length > 0) {
      setOpen(true);
    }
  }, [report]);

  return (
    <InvoicesProvider initialInvoices={report.items}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:min-w-[800px] bg-gray-950 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl">Reporte de ventas</DialogTitle>
            <DialogDescription>
              Fecha: {new Date(report.start).toLocaleDateString()}{' '}
              {report.end && `- ${new Date(report.end).toLocaleDateString()}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 items-start">
            <div className="flex gap-4 flex-col md:flex-row">
              <p>Total en USD: ${report.totalUSD}</p>
              <p>Total de facturas pagadas: {report.totalPaidInvoices}</p>
            </div>

            <div className="w-full">
              <InvoicesTable />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </InvoicesProvider>
  );
};
