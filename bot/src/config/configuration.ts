export default () => ({
  appPort: process.env.APP_PORT || 5000,
  isDev: process.env.NODE_ENV === 'development',
  telegramBotApiToken: process.env.TELEGRAM_BOT_API_TOKEN,
  secretKeyAccess: process.env.SECRET_KEY_ACCESS,
  s3BucketName: process.env.S3_BUCKET_NAME,
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  s3FolderName: process.env.S3_FOLDER_SAVED,
  s3Path: process.env.S3_PATH,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_ROOT_USER,
  dbPassword: process.env.DB_PASSWORD_USER,
});
