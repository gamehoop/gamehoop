import { env as clientEnv } from '@/env/client';
import { env } from '@/env/server';
import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { createServerOnlyFn } from '@tanstack/react-start';

const s3 = new S3Client({
  endpoint: env.S3_ENDPOINT_URL,
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: env.S3_SECRET_ACCESS_KEY || '',
  },
  responseChecksumValidation: 'WHEN_REQUIRED',
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

export const buildKey = createServerOnlyFn((key: string): string => {
  return `${clientEnv.VITE_ENVIRONMENT}/${key}`;
});

export const buildUserKey = createServerOnlyFn(
  (key: string, userId: string): string => {
    return buildKey(`users/${userId}/${key}`);
  },
);

export const getObjectUrl = createServerOnlyFn((key: string): string => {
  return `${env.S3_ENDPOINT_URL}/${key}`;
});

export const putObject = createServerOnlyFn(
  async ({
    key,
    body,
    contentType,
  }: {
    key: string;
    body?: string | Uint8Array | Buffer;
    contentType?: string;
  }): Promise<PutObjectCommandOutput> => {
    return s3.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  },
);

export const getObject = createServerOnlyFn(async (key: string) => {
  const result = await s3.send(
    new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    }),
  );
  return result.Body;
});

export const getUserObject = createServerOnlyFn(
  async ({ userId, key }: { userId: string; key: string }) => {
    return getObject(buildUserKey(key, userId));
  },
);

export const headObject = createServerOnlyFn(
  async (key: string): Promise<HeadObjectCommandOutput> => {
    return s3.send(
      new HeadObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
      }),
    );
  },
);

export const deleteObject = createServerOnlyFn(
  (key: string): Promise<DeleteObjectCommandOutput> => {
    return s3.send(
      new DeleteObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
      }),
    );
  },
);
