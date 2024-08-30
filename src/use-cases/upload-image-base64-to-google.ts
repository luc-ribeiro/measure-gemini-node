import {
  GoogleAIFileManager,
  UploadFileResponse,
} from '@google/generative-ai/server'

import { env } from '../env'

interface UploadFileUseCaseRequest {
  imageFilePath: string;
}

export async function uploadImageBase64ToGoogleUseCase({
  imageFilePath,
}: UploadFileUseCaseRequest): Promise<UploadFileResponse> {
  try {
    const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY)

    const uploadImageResponse = await fileManager.uploadFile(imageFilePath, {
      mimeType: 'image/jpeg',
    })

    return uploadImageResponse
  } catch (error: any) {
    throw error
  }
}
