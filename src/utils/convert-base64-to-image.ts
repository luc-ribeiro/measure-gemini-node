import fs from 'fs';
import path from 'path';

export function convertBase64ToImage(base64Image: string): string {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  const buffer = Buffer.from(base64Data, 'base64');

  const tempFilePath = path.join(__dirname, `temp-image-${Date.now()}.png`);

  fs.writeFileSync(tempFilePath, buffer);

  return tempFilePath;
}
