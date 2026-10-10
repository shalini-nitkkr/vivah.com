const nodemailer = require('nodemailer')

// Reusable Gmail transporter.
// Requires GMAIL_USER + GMAIL_APP_PASSWORD in .env (App Password, not your login password).
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Fail fast in the server logs if Gmail creds are wrong/missing.
transporter.verify((err) => {
  if (err) console.error('Mailer config error:', err.message)
  else console.log('Mailer ready to send emails')
})

async function sendOtpEmail(toEmail, name, otp) {
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 10

  await transporter.sendMail({
    from: `"Vivah" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Vivah verification code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Verify your email</h2>
        <p>Hi ${name || ''},</p>
        <p>Use the code below to verify your Vivah account. It expires in ${expiryMinutes} minutes.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; background:#f5f5f5; padding: 16px 24px; text-align:center; border-radius: 8px; margin: 16px 0;">
          ${otp}
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  })
}

module.exports = { transporter, sendOtpEmail }
