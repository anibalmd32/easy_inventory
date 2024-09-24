'use client';
import * as ShadCard from '@/components/ui/card';
import { useSettings } from '../../hooks/useSettings';

export const MinimumStock = () => {
  const { settings } = useSettings();

  return (
    <ShadCard.Card className="bg-gray-950 text-gray-200">
      <ShadCard.CardHeader>
        <ShadCard.CardTitle>Stock mínimo de productos</ShadCard.CardTitle>
      </ShadCard.CardHeader>
      <ShadCard.CardContent>{settings.minimumStock}</ShadCard.CardContent>
    </ShadCard.Card>
  );
};
