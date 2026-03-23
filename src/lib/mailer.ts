import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "cd713f87472e3c",
    pass: process.env.MAILTRAP_API_KEY,
  },
});
