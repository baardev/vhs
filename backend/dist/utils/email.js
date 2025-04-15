"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create reusable transporter object using SMTP
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    }
});
/**
 * Send an email
 * @param options Email options
 * @returns Promise resolving to the send result
 */
const sendEmail = async (options) => {
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
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map