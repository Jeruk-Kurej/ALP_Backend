import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient()

export async function runSeeder() {
  console.log('🌱 Starting payment seeder...')

  // Seed Payment methods
  const payments = [
    { id: 1, name: 'QRIS' },
    { id: 2, name: 'Cash' },
  ]

  for (const payment of payments) {
    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id: payment.id }
    })

    if (!existingPayment) {
      await prisma.payment.create({
        data: payment
      })
      console.log(`✅ Created payment: ${payment.name} (ID: ${payment.id})`)
    } else {
      console.log(`⏭️  Payment already exists: ${payment.name} (ID: ${payment.id})`)
    }
  }

  console.log('🎉 Payment seeder completed!')
}

async function main() {
  await runSeeder()
}

main()
  .catch((e) => {
    console.error('❌ Error in payment seeder:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })