const nodemailer = require('nodemailer');

const isSmtpConfigured = () =>
    Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter;
const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
};

const sendEmail = async ({ to, subject, text }) => {
    if (!isSmtpConfigured()) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('SMTP is not configured');
        }
        console.log(`[DEV] Email to ${to}: ${subject} — ${text}`);
        return;
    }

    await getTransporter().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
    });
};

module.exports = sendEmail;
