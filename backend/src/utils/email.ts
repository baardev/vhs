/**
 * @fileoverview Email utility module for sending emails.
 *
 * @description This module provides a centralized way to send emails using `nodemailer`.
 * It configures a transporter based on SMTP settings defined in environment variables
 * (e.g., `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL`).
 * It exports a single function, `sendEmail`, to dispatch emails.
 *
 * @module utils/email
 *
 * @requires nodemailer - External library for sending emails.
 * @requires dotenv - External library for loading environment variables.
 * @requires process.env - Node.js global for accessing environment variables for SMTP configuration.
 *
 * @see {@link backend/src/routes/auth.ts} - This is the primary consumer of the `sendEmail` function,
 * specifically for sending password reset emails when a user requests a password reset.
 * The `forgot-password` route in `auth.ts` calls `sendEmail` to dispatch the reset link to the user's email address.
 */
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