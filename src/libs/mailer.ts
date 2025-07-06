// libs/mailer.ts
import nodemailer from 'nodemailer';

import { ERROR_CODES } from '@/config/constants';
import { SMTP_HOST, SMTP_MAIL, SMTP_PASSWORD, SMTP_PORT, SMTP_SECURE } from '@/config/envs';

export const sendMail = async (options: {
  from: string;
  reply?: string;
  to: string;
  subject: string;
  html: string;
}) => {
  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE === 'true', // Convert string to boolean if environment variable is used
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD,
    },
  });
  (console.log(SMTP_MAIL, SMTP_PASSWORD),
    // Set up the transporter for Mailpit
    // const transporter = nodemailer.createTransport({
    //   host: '127.0.0.1', // Mailpit runs on localhost
    //   port: Number(1025), // Default SMTP port for Mailpit
    //   secure: false, // Mailpit doesn't use TLS/SSL
    //   auth: null, // No authentication required for Mailpit
    // });

    // Verify transporter connection
    transporter.verify(function (error, success) {
      if (error) {
        console.error('Error connecting to SMTP server', error);
      } else {
        console.log('Connected to SMTP server successfully!');
      }
    }));

  // Set up email options
  const mailOptions = {
    from: options.from || SMTP_MAIL,
    replyTo: options.reply,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions); // Send the email
    console.log('Email sent successfully:', info.response);
    return { success: true, message: info.response }; // Return success and email response
  } catch (error: any) {
    console.error('Error sending email:', error.stack);
    return {
      success: false,
      message: error.message,
      statusCode: 500,
      errorCode: ERROR_CODES.EXTERNAL_SERVICE_ERROR,
    };
  }
};
