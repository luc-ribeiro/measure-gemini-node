import fs from 'node:fs';
import {
  GoogleAIFileManager,
  UploadFileResponse,
} from '@google/generative-ai/server';
import { env } from '../env';
import { convertBase64ToImage } from '../utils/convert-base64-to-image';
import { getBase64MimeType } from '../utils/get-base64-mime-type';

interface UploadFileUseCaseRequest {
  imageBase64: string;
}

export async function uploadImageFileUseCase({
  imageBase64,
}: UploadFileUseCaseRequest): Promise<UploadFileResponse> {
  const fileManager = new GoogleAIFileManager(env.GEMINI_API_KEY);

  const base64MimeType = getBase64MimeType(imageBase64);

  if (!base64MimeType) {
    throw new Error('Não foi possível determinar o tipo MIME da imagem.');
  }

  const tempConvertedImage = convertBase64ToImage(imageBase64);

  const uploadImageResponse = await fileManager.uploadFile(tempConvertedImage, {
    mimeType: base64MimeType,
  });

  fs.unlinkSync(tempConvertedImage);

  return uploadImageResponse;
}
