const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Note: For production, use a real SMTP service (SendGrid, AWS SES, Gmail, etc.)
    // We expect process.env.SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to be set.
    
    let transporter;

    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
      // Use Ethereal for testing if no SMTP is provided
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Test Account created:', testAccount.user);
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465' || Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    const senderEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'support@nexus2026.com';
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'NEXUS 2026'}" <${senderEmail}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
