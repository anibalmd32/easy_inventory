'use client';

import * as ShadCard from '@/components/ui/card';
import { useSettings } from '../../hooks/useSettings';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';

export const Logo = () => {
  const { setBusinessForm } = useSettings();

  const onEditClicked = () => {
    setBusinessForm(true);
  };

  return (
    <ShadCard.Card className="bg-gray-950 text-gray-200">
      <ShadCard.CardHeader>
        <ShadCard.CardTitle>
          <div className="flex items-center gap-3">
            <span>Inverciones Jeicar</span>
            <Button
              className="bg-gray-800 hover:bg-gray-800/20 transition-all duration-300 text-gray-200"
              onClick={onEditClicked}
            >
              Editar
            </Button>
          </div>
        </ShadCard.CardTitle>
      </ShadCard.CardHeader>
      <ShadCard.CardContent>
        <div className="flex justify-center">
          <NextImage
            src="/logo.png"
            // src={settings.logoUrl}
            alt="logo"
            className="bg-white p-1 rounded-full"
            width={80}
            height={80}
          />
        </div>
      </ShadCard.CardContent>
    </ShadCard.Card>
  );
};
