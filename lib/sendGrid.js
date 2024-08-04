import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendOtp(email, otp) {
  const msg = {
    to: email,
    from: 'your-verified-email@example.com', // Replace with your verified email address
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email:', error.response.body);
    throw new Error('Error sending OTP email');
  }
}
