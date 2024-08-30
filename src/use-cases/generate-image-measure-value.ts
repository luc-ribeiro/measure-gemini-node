import { GoogleGenerativeAI } from '@google/generative-ai'
import { UploadFileResponse } from '@google/generative-ai/dist/server/server'
import { env } from '../env'

interface GenerateImageMeasureValueUseCaseRequest {
  uploadedImage: UploadFileResponse;
}

export async function generateImageMeasureValueUseCase({
  uploadedImage,
}: GenerateImageMeasureValueUseCaseRequest) {
  try {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    })

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadedImage.file.mimeType,
          fileUri: uploadedImage.file.uri,
        },
      },
      {
        text: 'Me informe somente o valor numérico da medição a partir da foto do medidor, não quero texto, apenas o valor.',
      },
    ])

    return result.response.text()
  } catch (error: any) {
    throw error
  }
}
