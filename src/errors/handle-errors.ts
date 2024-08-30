import { FastifyReply } from 'fastify'

interface CustomError extends Error {
  statusCode?: number;
  errorCode?: string;
}

export function handleError(
  reply: FastifyReply,
  error: CustomError,
  customMessage?: string,
) {
  let statusCode = 500
  let errorCode = 'INTERNAL SERVER ERROR'
  let message = customMessage || 'An unknown error occurred'

  if (error.statusCode) {
    statusCode = error.statusCode
    errorCode = error.errorCode || 'FAILED_OPERATION'
    message = customMessage || error.message
  } else {
    message = error.message || message
  }

  reply.status(statusCode).send({
    error_code: errorCode,
    error_description: message,
  })
}
