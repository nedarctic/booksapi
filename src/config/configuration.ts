export default () => ({
    dbUrl: process.env.DATABASE_URL!,
    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret',
        expires_in: process.env.JWT_EXPIRES_IN! || '1 h'
    },
    r2: {
        account_id: process.env.R2_ACCOUNT_ID!,
        s3_api: process.env.R2_S3_API!,
        access_key_id: process.env.R2_ACCESS_KEY_ID!,
        secret_access_key: process.env.R2_SECRET_ACCESS_KEY!,
        bucket_name: process.env.R2_BUCKET_NAME!,
        public_url: process.env.R2_PUBLIC_URL!,
    }
})