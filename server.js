require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SibApiV3Sdk = require('@getbrevo/brevo');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure Brevo client
const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

app.post('/send', async (req, res) => {
  const { name, email, phone, date, time, doctor, reason } = req.body;

  const emailContent = `
    <h2>Appointment Confirmation</h2>
    <p>Dear ${name},</p>
    <p>Thank you for booking an appointment with KS Hospital. Here are your details:</p>
    <ul>
      <li><strong>Doctor:</strong> ${doctor}</li>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Reason:</strong> ${reason}</li>
      <li><strong>Phone:</strong> ${phone}</li>
    </ul>
    <p>We look forward to seeing you!</p>
    <br>
    <p>KS Hospital Team</p>
  `;

  const sendSmtpEmail = {
    sender: { email: process.env.FROM_EMAIL, name: 'KS Hospital' },
    to: [{ email: email, name: name }],
    subject: 'Appointment Confirmation - KS Hospital',
    htmlContent: emailContent,
  };

  try {
    await brevo.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully!');
    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
