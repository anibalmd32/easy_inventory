'use client';
import * as ShadCard from '@/components/ui/card';
import { useSettings } from '../../hooks/useSettings';

export const Name = () => {
  const { settings } = useSettings();

  return (
    <ShadCard.Card className="bg-gray-950 text-gray-200">
      <ShadCard.CardHeader>
        <ShadCard.CardTitle>Nombre del negocio</ShadCard.CardTitle>
      </ShadCard.CardHeader>
      <ShadCard.CardContent>{settings.businessName}</ShadCard.CardContent>
    </ShadCard.Card>
  );
};
