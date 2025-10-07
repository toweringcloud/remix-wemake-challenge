import sharp from "sharp";

interface ProcessImageOptions {
  width: number;
  height: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  format?: 'jpeg' | 'png' | 'webp';
  quality?: number; // 0-100
}

/**
 * 주어진 이미지 파일을 리사이징하고 최적화하여 Buffer 형태로 반환하는 유틸리티.
 * 서버 환경 (Node.js)에서만 사용해야 합니다.
 * @param imageFile File 객체 또는 Buffer
 * @param options 이미지 처리 옵션 (너비, 높이, 포맷, 품질 등)
 * @returns 처리된 이미지의 Buffer와 해당 이미지의 MIME 타입
 */
export async function processImage(
  imageFile: File | Buffer,
  options: ProcessImageOptions
): Promise<{ buffer: Buffer; mimeType: string }> {
  let imageBuffer: Buffer;
  let originalMimeType: string = 'image/jpeg'; // 기본값

  if (imageFile instanceof File) {
    imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    originalMimeType = imageFile.type;
  } else {
    imageBuffer = imageFile;
    // Buffer인 경우 MIME 타입을 추론하거나 기본값 사용
    // sharp.metadata()를 통해 정확한 MIME 타입 추론도 가능
    // 여기서는 편의상 jpeg로 가정하거나, 필요하면 옵션으로 받을 수 있습니다.
  }

  const { width, height, fit = 'cover', format, quality = 80 } = options;

  let sharpInstance = sharp(imageBuffer)
    .resize({
      width,
      height,
      fit,
      withoutEnlargement: true, // 이미지가 지정된 크기보다 작을 경우 확대하지 않음
    });

  let outputMimeType: string;

  switch (format) {
    case 'jpeg':
      sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
      outputMimeType = 'image/jpeg';
      break;
    case 'png':
      sharpInstance = sharpInstance.png({ quality });
      outputMimeType = 'image/png';
      break;
    case 'webp':
      sharpInstance = sharpInstance.webp({ quality });
      outputMimeType = 'image/webp';
      break;
    default:
      // 원본 MIME 타입 유지 또는 웹에 적합한 JPEG/WEBP 선택
      if (originalMimeType.includes('png')) {
        sharpInstance = sharpInstance.png({ quality });
        outputMimeType = 'image/png';
      } else {
        sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
        outputMimeType = 'image/jpeg';
      }
      break;
  }

  const processedBuffer = await sharpInstance.toBuffer();

  return { buffer: processedBuffer, mimeType: outputMimeType };
}

/**
 * 썸네일 이미지 처리를 위한 간편 함수
 * @param imageFile File 객체
 * @returns 처리된 썸네일 이미지의 Buffer와 해당 이미지의 MIME 타입
 */
export async function createThumbnail(imageFile: File): Promise<{ buffer: Buffer; mimeType: string }> {
  const thumbnailOptions: ProcessImageOptions = {
    width: 256,
    height: 256,
    fit: 'cover',
    format: 'webp', // 웹에 최적화된 webp 포맷 권장
    quality: 80,
  };
  return processImage(imageFile, thumbnailOptions);
}

// 필요하다면 다른 이미지 처리 함수 추가 가능
// 예: createWatermark, optimizeImageForWeb 등