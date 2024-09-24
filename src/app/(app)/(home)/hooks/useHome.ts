'use client';
import { HomeContext } from '../HomeProvider';
import { useContext } from 'react';

export const useHome = () => useContext(HomeContext);
