import { NextResponse } from 'next/server';
import DashboardService from '@/core/application/dashboard.services';
import DashboardRepository from '@/core/infrastructure/dashboard.repository';

export const POST = async (req: Request) => {
  const dashboardService = new DashboardService(new DashboardRepository());

  const body = await req.json();
  const { start, end } = body as {
    start: Date;
    end: Date;
  };

  // await new Promise((resolve) => setTimeout(resolve, 5000));

  const result = await dashboardService.getSalesReport({ start, end });

  return NextResponse.json(result);
};
