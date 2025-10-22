# Email Configuration for Password Reset

## Setup Instructions

### 1. Gmail Configuration (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:

   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update your `.env` file**:
   ```env
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-16-character-app-password"
   ```

### 2. Alternative Email Providers

#### SendGrid

```env
EMAIL_USER="apikey"
EMAIL_PASSWORD="your-sendgrid-api-key"
```

#### Mailgun

```env
EMAIL_USER="your-mailgun-smtp-username"
EMAIL_PASSWORD="your-mailgun-smtp-password"
```

#### Custom SMTP

Update the transporter configuration in `/app/api/auth/forgot-password/route.ts`:

```javascript
const transporter = nodemailer.createTransporter({
  host: "your-smtp-host",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Testing

1. Start your development server: `yarn dev`
2. Navigate to `/auth/forgot-password`
3. Enter a valid email address
4. Check your email for the reset link
5. Click the link to test the reset password flow

## Security Notes

- Reset tokens expire after 1 hour
- Used tokens are automatically deleted
- Only one active reset token per email at a time
- Passwords are hashed with bcrypt (12 rounds)
