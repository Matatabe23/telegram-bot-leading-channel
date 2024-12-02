// s3.config.ts
import { S3ClientConfig } from '@aws-sdk/client-s3';

export const getS3ClientConfig = (): S3ClientConfig => {
	return {
		region: 'us-east-1',
		endpoint: process.env.S3_PATH,
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
		}
	};
};
