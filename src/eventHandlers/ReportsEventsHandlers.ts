import { SaleReport } from '@/definitions';
import { Dispatch, SetStateAction } from 'react';
import { getSalesReport } from '@/core/frameworks/server-actions/dashboard.actions';

interface EventHandler {
  onGetReport: ({ start, end }: Partial<{ start: Date; end: Date }>) => void;
}

interface EventHandlerDeps {
  setReportData: Dispatch<SetStateAction<SaleReport>>;
}

export class ReportsEventHandlers implements EventHandler {
  constructor(private deps: EventHandlerDeps) {}

  onGetReport = async ({ start, end }: Partial<{ start: Date; end: Date }>) => {
    try {
      const result = await getSalesReport({ end, start });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
}
