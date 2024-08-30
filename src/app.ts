import fastify from 'fastify'
import { uploadController } from './controllers/upload'
import { ZodError } from 'zod'
import { env } from './env'
import { confirmController } from './controllers/confirm'
import { fetchCustomerMeasuresController } from './controllers/fetch-customer-measures'

export const app = fastify()

app.post('/upload', uploadController)
app.patch('/confirm', confirmController)
app.get('/:customer_code/list', fetchCustomerMeasuresController)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ error_code: 'INVALID_DATA', error_description: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
