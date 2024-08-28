import { FastifyReply, FastifyRequest } from 'fastify';
import { Base64 } from 'js-base64';
import { z } from 'zod';
import { uploadImageFileUseCase } from '../use-cases/upload-image-file';
import { generateImageContentUseCase } from '../use-cases/generate-image-content';

export async function uploadController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const uploadBodySchema = z.object({
    image: z.string(),
    customer_code: z.string(),
    measure_datetime: z.string().datetime(),
    measure_type: z.enum(['WATER', 'GAS']),
  });

  const { image, customer_code, measure_datetime, measure_type } =
    uploadBodySchema.parse(request.body);

  try {
    const uploadedImage = await uploadImageFileUseCase({
      imageBase64: image,
    });

    await generateImageContentUseCase({
      uploadedImage,
    });
    reply.send({ success: true, message: 'Image uploaded successfully' });
  } catch (error: any) {
    reply.status(500).send({ success: false, message: error.message });
  }
}
