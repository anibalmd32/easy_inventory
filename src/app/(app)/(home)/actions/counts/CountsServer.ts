'use server'

import { entityCountData } from './counts.mock'

export class CountsServer {
	async getEntityCountData() {
		return entityCountData
	}
}
