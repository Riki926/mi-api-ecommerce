const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendPasswordReset = async (email, resetUrl) => {
  try {
    await transporter.sendMail({
      from: '"E-commerce Support" <noreply@ecommerce.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
    console.log(`Password reset email sent to: ${email}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

module.exports = {
  sendPasswordReset,
};
