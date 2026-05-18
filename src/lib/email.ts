import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'Yae Publishing House <noreply@yaepublishing.house>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yaepublishing.house';

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${SITE_URL}/verify?token=${token}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="display: inline-block; border: 2px solid #c41e3a; padding: 8px 12px; font-size: 24px; color: #c41e3a; font-family: serif;">八</div>
  </div>
  
  <h1 style="font-size: 20px; color: #5a3d5a; margin-bottom: 20px;">Verify your email</h1>
  
  <p>Thank you for registering with Yae Publishing House.</p>
  
  <p>Please click the button below to verify your email address:</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${verifyUrl}" style="display: inline-block; background: #8b5a8c; color: #fff; padding: 12px 28px; text-decoration: none; font-weight: 500;">Verify Email</a>
  </div>
  
  <p style="font-size: 14px; color: #666;">Or copy this link:</p>
  <p style="font-size: 14px; color: #8b5a8c; word-break: break-all;">${verifyUrl}</p>
  
  <p style="font-size: 14px; color: #666; margin-top: 30px;">This link expires in 24 hours.</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p style="font-size: 12px; color: #999; text-align: center;">
    If you didn't create an account, you can ignore this email.
  </p>
</body>
</html>
  `.trim();

  const text = `
Verify your email

Thank you for registering with Yae Publishing House.

Please click the link below to verify your email address:
${verifyUrl}

This link expires in 24 hours.

If you didn't create an account, you can ignore this email.
  `.trim();

  // If no API key, log to console instead (dev mode)
  if (!resend) {
    console.log('=== EMAIL (dev mode) ===');
    console.log('To:', email);
    console.log('Subject: Verify your email - Yae Publishing House');
    console.log('Verify URL:', verifyUrl);
    console.log('========================');
    return { success: true, dev: true };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your email - Yae Publishing House',
      html,
      text,
    });
    
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
