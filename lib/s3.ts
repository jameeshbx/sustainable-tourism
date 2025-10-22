import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN!;

export async function uploadImageToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `destinations/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',
  });

  await s3Client.send(command);
  
  // Return CloudFront URL
  return `https://${CLOUDFRONT_DOMAIN}/${key}`;
}

export async function generatePresignedUrl(
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `destinations/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  
  return presignedUrl;
}

export function getCloudFrontUrl(key: string): string {
  return `https://${CLOUDFRONT_DOMAIN}/${key}`;
}
