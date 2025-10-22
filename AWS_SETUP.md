# AWS S3 and CloudFront Setup for Image Uploads

This document explains how to set up AWS S3 and CloudFront for image uploads in the sustainable tourism platform.

## Required Environment Variables

Add these environment variables to your `.env.local` file:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-s3-bucket-name"
AWS_CLOUDFRONT_DOMAIN="your-cloudfront-domain.cloudfront.net"
```

## AWS Setup Steps

### 1. Create S3 Bucket

1. Go to AWS S3 Console
2. Create a new bucket with a unique name
3. Configure bucket settings:
   - **Public Access**: Allow public read access for images
   - **CORS Configuration**: Add the following CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 2. Configure Bucket Policy

Add this bucket policy to allow public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 3. Create CloudFront Distribution

1. Go to AWS CloudFront Console
2. Create a new distribution
3. Configure settings:
   - **Origin Domain**: Select your S3 bucket
   - **Origin Path**: Leave empty
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
   - **Cache Policy**: CachingDisabled (for dynamic content)
4. Note the CloudFront domain name (e.g., `d1234567890.cloudfront.net`)

### 4. Configure IAM User

Create an IAM user with the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::your-bucket-name"
    }
  ]
}
```

## File Structure

Images will be stored in S3 with the following structure:

```
your-bucket/
└── destinations/
    ├── 1702123456789-image1.jpg
    ├── 1702123456790-image2.png
    └── ...
```

## CloudFront URLs

Images will be accessible via CloudFront URLs like:

```
https://your-cloudfront-domain.cloudfront.net/destinations/1702123456789-image1.jpg
```

## Security Considerations

1. **File Type Validation**: Only image files are allowed
2. **File Size Limit**: Maximum 5MB per image
3. **Filename Sanitization**: Special characters are replaced with underscores
4. **Access Control**: Only authenticated admins and service providers can upload images

## Testing

After setup, test the image upload functionality:

1. Sign in as an admin or service provider
2. Create a new destination
3. Upload an image
4. Verify the image appears in the destination details
5. Check that the image URL uses CloudFront domain
