'use client';
import NextImage from 'next/image';
import { HeaderMenu } from './HeaderMenu';
import { Notifications } from './Notifications';
import { useEffect, useState } from 'react';
import { useDolarStore } from '@/store/dolarStore';

export interface AppHeaderProps {
  appName: string;
  appLogo: string;
}

export function AppHeader(props: AppHeaderProps) {
  const { price } = useDolarStore();

  return (
    <>
      {/* Fondo fijo detrás del header */}
      <div className="fixed top-0 w-full min-h-[64px] bg-gray-950 z-40"></div>

      {/* Contenido del header */}
      <div className="w-full max-h-[64px] sticky top-0 flex z-50 p-2 bg-gray-950 text-gray-200">
        <header className="justify-between items-center w-full">
          <div className="md:container flex items-center justify-between flex-1">
            <div className="flex items-center">
              <NextImage
                src={props.appLogo}
                alt="logo"
                className="w-8 h-8"
                width={40}
                height={40}
              />
              <span className="text-sm md:text-xl font-bold ml-2">
                {props.appName}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {price && <div className="font-bold">$1 = Bs. {price}</div>}
              {/* <Notifications /> */}
              <HeaderMenu />
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
