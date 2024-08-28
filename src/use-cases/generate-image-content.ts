import { GoogleGenerativeAI } from '@google/generative-ai';
import { UploadFileResponse } from '@google/generative-ai/dist/server/server';
import { env } from '../env';

interface GenerateImageContentUseCaseRequest {
  uploadedImage: UploadFileResponse;
}

export async function generateImageContentUseCase({
  uploadedImage,
}: GenerateImageContentUseCaseRequest) {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadedImage.file.mimeType,
        fileUri: uploadedImage.file.uri,
      },
    },
    {
      text: 'Me informe o valor da medição a partir da foto do medidor.',
    },
  ]);

  console.log(result.response.text());
}
