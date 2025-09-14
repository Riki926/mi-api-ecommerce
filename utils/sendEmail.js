const nodemailer = require('nodemailer');
const { NODE_ENV, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = require('../config/keys');

// Create reusable transporter object using the default SMTP transport
let transporter;

if (NODE_ENV === 'production') {
  // Use production SMTP settings
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
} else {
  // Use ethereal.email for development
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'test@example.com', // Will be overridden by ethereal
      pass: 'test' // Will be overridden by ethereal
    }
  });
}

// Verify connection configuration
transporter.verify(function (error) {
  if (error) {
    console.error('Error with email configuration:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Send email
const sendEmail = async (options) => {
  // In development, log the email instead of sending it
  if (NODE_ENV !== 'production') {
    console.log('Email would be sent to:', options.email);
    console.log('Subject:', options.subject);
    console.log('Message:', options.message);
    
    // Get test ethereal account
    const testAccount = await nodemailer.createTestAccount();
    
    // Create a test transporter
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    // Send mail with test account
    const info = await testTransporter.sendMail({
      from: `"E-commerce App" <${testAccount.user}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `<p>${options.message.replace(/\n/g, '<br>')}</p>`
    });
    
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return;
  }
  
  // In production, send the actual email
  const mailOptions = {
    from: `"E-commerce App" <${process.env.SMTP_FROM_EMAIL || 'noreply@example.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<p>${options.message.replace(/\n/g, '<br>')}</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
