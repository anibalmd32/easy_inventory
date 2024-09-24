'use server';
import { Setting } from '@/definitions';
import { settingsMock } from './settings.mock';

export async function getSettings(): Promise<Setting> {
  try {
    return settingsMock;
  } catch (error) {
    return {} as Setting;
  }
}
