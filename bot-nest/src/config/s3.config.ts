// s3.config.ts
import { ConfigService } from '@nestjs/config';
import { S3ClientConfig } from '@aws-sdk/client-s3';

export const getS3ClientConfig = (
  configService: ConfigService,
): S3ClientConfig => {
  return {
    region: 'us-east-1',
    endpoint: configService.get('s3Path'),
    credentials: {
      accessKeyId: configService.get('s3AccessKeyId') || '',
      secretAccessKey: configService.get('s3SecretAccessKey') || '',
    },
  };
};
