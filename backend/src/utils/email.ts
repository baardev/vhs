import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Send an email
 * @param options Email options
 * @returns Promise resolving to the send result
 */
export const sendEmail = async (options: EmailOptions) => {
  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'VHS Golf'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || ''}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  });

  return info;
};