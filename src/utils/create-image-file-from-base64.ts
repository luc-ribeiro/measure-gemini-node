import fs from 'node:fs'
import path from 'node:path'

interface CreateImageFileFromBase64Props {
  base64Image: string;
}

export function createImageFileFromBase64({
  base64Image,
}: CreateImageFileFromBase64Props): string {
  try {
    const buffer = Buffer.from(base64Image, 'base64')

    const uploadsDir = path.join(__dirname, '..', 'uploads')

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const imageFilePath = path.join(uploadsDir, `temp-image-${Date.now()}.png`)

    fs.writeFileSync(imageFilePath, buffer)

    return imageFilePath
  } catch (error) {
    throw error
  }
}
