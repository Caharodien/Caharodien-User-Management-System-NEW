const nodemailer = require('nodemailer');
const config = require('../config.json');

module.exports = sendEmail;

async function sendEmail({to, subject, html, from = config.emailFrom}) {
    console.log(`Attempting to send email to: "${to}" with subject: "${subject}"`);
    
    if (!to) {
        console.error('No recipient email address provided');
        throw new Error('No recipients defined');
    }
    
    try {
        const transporter = nodemailer.createTransport(config.smtpOptions);
        
        console.log('SMTP Config:', {
            host: config.smtpOptions.host,
            port: config.smtpOptions.port,
            secure: config.smtpOptions.secure,
            auth: { user: config.smtpOptions.auth.user, pass: '***' }
        });
        
        await transporter.sendMail({from, to, subject, html});
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}