"use server"
import { prisma } from "@/lib/prisma"

export async function testPrisma () {
	try {
		const result = await prisma.product.findMany()

		return result
	} catch (err) {
		console.log(err)
	}
}
