'use client';
import * as ShadCard from '@/components/ui/card';
import { useSettings } from '../../hooks/useSettings';
import NextImage from 'next/image';

export const Logo = () => {
  const { settings } = useSettings();

  return (
    <ShadCard.Card className="bg-gray-950 text-gray-200">
      <ShadCard.CardHeader>
        <ShadCard.CardTitle>Logo del negocio</ShadCard.CardTitle>
      </ShadCard.CardHeader>
      <ShadCard.CardContent>
        <NextImage
          src={settings.logoUrl}
          alt="logo"
          className="w-8 h-8"
          width={40}
          height={40}
        />
      </ShadCard.CardContent>
    </ShadCard.Card>
  );
};
