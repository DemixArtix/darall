import prisma from '../prisma/prismaInstance'

export default async function errorHandler(res) {
  res.status(500).
  send({
    success: false,
    message: 'Ошибка запроса к БД'
  })
  if(prisma) {
    await prisma.$disconnect()
    process.exit(1)
  }
}