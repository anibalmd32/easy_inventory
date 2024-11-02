'use client';

import * as ShadCard from '@/components/ui/card';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '@/components/ui/button';

export const MinimumStock = () => {
  const { settings, setMinStockForm } = useSettings();

  return (
    <ShadCard.Card className="bg-gray-950 text-gray-200">
      <ShadCard.CardHeader>
        <ShadCard.CardTitle className="flex-1">
          <div className="flex items-center gap-3">
            <span>Stock mínimo de productos</span>
            <Button
              className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
              onClick={() => {
                setMinStockForm(true);
              }}
            >
              Editar
            </Button>
          </div>
        </ShadCard.CardTitle>
      </ShadCard.CardHeader>
      <ShadCard.CardContent>
        <div className="flex justify-center gap-2">
          <span className="pt-0.5">Stock minimo: </span>{' '}
          <span className="text-5xl font-bold text-white">
            {settings.minimumStock}
          </span>
        </div>
      </ShadCard.CardContent>
    </ShadCard.Card>
  );
};
