import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function confirmController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const confirmBodySchema = z.object({
    measure_uuid: z.string().uuid(),
    confirmed_value: z.number(),
  })

  const { measure_uuid, confirmed_value } = confirmBodySchema.parse(
    request.body,
  )

  const existedMeasure = await prisma.measure.findFirst({
    where: {
      id: measure_uuid,
    },
  })

  if (!existedMeasure) {
    return reply.status(404).send({
      error_code: 'MEASURE_NOT_FOUND',
      error_description: 'Leitura não encontrada',
    })
  }

  if (existedMeasure.has_confirmed) {
    return reply.status(409).send({
      error_code: 'MEASURE_ALREADY_CONFIRMED',
      error_description: 'Leitura já confirmada',
    })
  }

  await prisma.measure.update({
    where: {
      id: existedMeasure.id,
    },
    data: {
      has_confirmed: true,
      value: confirmed_value,
    },
  })

  return reply.send({ success: true })
}
