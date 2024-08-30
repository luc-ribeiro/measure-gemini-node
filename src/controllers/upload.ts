import { FastifyReply, FastifyRequest } from 'fastify'
import dayjs from 'dayjs'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import fs from 'fs'

import { uploadImageBase64ToGoogleUseCase } from '../use-cases/upload-image-base64-to-google'
import { generateImageMeasureValueUseCase } from '../use-cases/generate-image-measure-value'
import { createImageFileFromBase64 } from '../utils/create-image-file-from-base64'
import { handleError } from '../errors/handle-errors'

export async function uploadController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const uploadBodySchema = z.object({
    image: z.string().base64(),
    customer_code: z.string(),
    measure_datetime: z.string().datetime(),
    measure_type: z.enum(['WATER', 'GAS']),
  })

  const { image, customer_code, measure_datetime, measure_type } =
    uploadBodySchema.parse(request.body)

  const startOfMonth = dayjs(measure_datetime).startOf('month')
  const endOfMonth = dayjs(measure_datetime).endOf('month')

  const alreadyExistsMeasureType = await prisma.measure.findFirst({
    where: {
      customer_code,
      type: measure_type,
      measured_at: {
        gte: startOfMonth.toDate(),
        lt: endOfMonth.toDate(),
      },
    },
  })

  if (alreadyExistsMeasureType) {
    return reply.status(409).send({
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura do mês já realizada',
    })
  }

  const imageFilePath = createImageFileFromBase64({ base64Image: image })

  try {
    const uploadedImage = await uploadImageBase64ToGoogleUseCase({
      imageFilePath,
    })

    const uploadedImageMeasureValue = await generateImageMeasureValueUseCase({
      uploadedImage,
    })

    const measure = await prisma.measure.create({
      data: {
        value: Number(uploadedImageMeasureValue),
        measured_at: new Date(measure_datetime),
        type: measure_type,
        image_url: uploadedImage.file.uri,
        customer_code,
      },
    })

    fs.unlinkSync(imageFilePath)

    return reply.status(201).send({
      image_url: measure.image_url,
      measure_value: measure.value,
      measure_uuid: measure.id,
    })
  } catch (error: any) {
    return handleError(reply, error)
  }
}
