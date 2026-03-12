import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: 'e9208ad0fda895',
    pass: process.env.MAILTRAP_API_KEY,
  },
});