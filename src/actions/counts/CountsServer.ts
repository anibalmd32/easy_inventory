'use server';
import { entityCountData } from './counts.mock';

export async function getEntityCountData() {
  return entityCountData;
}
