import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function fetchCustomerMeasuresController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCustomerMeasuresParamsSchema = z.object({
    customer_code: z.string().uuid(),
  });

  const validateMeasureType = (measureType: string) => {
    return ['WATER', 'GAS'].includes(measureType.toUpperCase());
  };

  const fetchCustomerMeasuresQuerySchema = z.object({
    measure_type: z
      .string()
      .refine(measureType => validateMeasureType(measureType), {
        message: 'O tipo de medição deve ser "WATER" ou "GAS".',
        params: {
          errorCodes: 'INVALID_MEASURE_TYPE',
        },
      })
      .optional(),
  });

  const { customer_code } = fetchCustomerMeasuresParamsSchema.parse(
    request.params,
  );
  const { measure_type } = fetchCustomerMeasuresQuerySchema.parse(
    request.query,
  );

  const whereClause: any = {
    customer_code,
  };

  if (measure_type) {
    whereClause.type = measure_type.toUpperCase();
  }

  const customerMeasures = await prisma.measure.findMany({
    where: whereClause,
  });

  if (customerMeasures.length === 0) {
    return reply.status(404).send({
      error_code: 'MEASURES_NOT_FOUND',
      error_description: 'Nenhuma leitura encontrada',
    });
  }

  const mappedMeasures = customerMeasures.map(measure => ({
    measure_uuid: measure.id,
    measure_datetime: measure.measured_at,
    measure_type: measure.type,
    has_confirmed: measure.has_confirmed,
    image_url: measure.image_url,
  }));

  return reply.send({ customer_code, measures: mappedMeasures });
}
