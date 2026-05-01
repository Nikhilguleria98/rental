import nodemailer from 'nodemailer';

let transporter = null;
let emailConfigured = false;

// Initialize email transporter if credentials are provided
const initializeTransporter = () => {
  if (transporter) return transporter; // Already initialized

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      console.log('🔧 Initializing email service...');
      console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
      console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
      console.log('📮 EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail');

      transporter = nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      emailConfigured = true;
      console.log('✓ Email service configured successfully');
      return transporter;
    } catch (error) {
      console.error('✗ Failed to configure email service:', error.message);
      emailConfigured = false;
      return null;
    }
  } else {
    console.warn('⚠ Email credentials not configured in .env - OTPs will be logged to console');
    console.log('Current env vars:', {
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS,
      EMAIL_SERVICE: process.env.EMAIL_SERVICE
    });
    return null;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (email, otp) => {
  // Always log OTP to console for testing/debugging
  console.log(`\n📧 OTP Requested for: ${email}`);
  console.log(`🔐 OTP Code: ${otp}\n`);

  // Initialize transporter if not already done
  const emailTransporter = initializeTransporter();

  if (!emailTransporter) {
    console.warn('⚠ Email service not configured - OTP shown above but not sent via email');
    return true; // Return true so signup can proceed in development
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: white; margin: 0;">Verify Your Email</h1>
          </div>
          <div style="padding: 30px; background-color: #f8fafc; border-radius: 10px; margin-top: 10px;">
            <p style="color: #334155; font-size: 16px;">Hello,</p>
            <p style="color: #334155; font-size: 16px;">Your OTP code is:</p>
            <div style="background-color: #06b6d4; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
            <p style="color: #334155; font-size: 16px;">Regards,<br/>Rental Stay Team</p>
          </div>
        </div>
      `,
    };

    console.log(`📤 Sending OTP email to: ${email}`);
    const result = await emailTransporter.sendMail(mailOptions);
    console.log(`✓ Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to send email to ${email}:`, error.message);
    console.error('Error details:', error);
    return false;
  }
};
