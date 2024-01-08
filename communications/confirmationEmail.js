const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

async function sendThanksEmail(email) {
    try {
      // Set up the email transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., Gmail, Outlook, etc.
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'Thanks for Subscribing!',
        html: `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Thanks for Subscribing!</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                }
                .header {
                    text-align: center;
                    background-color: #f5f5f5;
                    padding: 10px;
                }
                .content {
                    padding: 20px;
                    background-color: #fff;
                }
                .footer {
                    text-align: center;
                    background-color: #f5f5f5;
                    padding: 10px;
                }
                .button {
                    display: inline-block;
                    margin: 10px;
                    padding: 10px 20px;
                    text-decoration: none;
                    color: #fff;
                    background-color: #007bff;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thanks for Subscribing!</h1>
                </div>
                <div class="content">
                    <p>
                        Dear Subscriber,
                    </p>
                    <p>
                        Thank you for subscribing to our newsletter. We are excited to have you on board!
                    </p>
                    <p>
                        Stay tuned for the latest updates, news, and special offers delivered right to your inbox.
                    </p>
                    <p>
                        If you have any questions or need assistance, feel free to reach out to us.
                    </p>
                </div>
                <div class="footer">
                    <p>
                        Regards,<br>
                        Blog Diaries Team
                    </p>
                </div>
            </div>
        </body>
        </html>`
        
      };
      console.log("trying to send mail");
      // Send the "thanks" email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`Error sending "thanks" email to ${email}: ${error.message}`);
        } else {
          console.log(`"Thanks" email sent successfully to ${email}: ${info.response}`);
        }
      });
    } catch (error) {
      console.log('Error sending "thanks" email:', error);
    }
  }
  
  
  module.exports = sendThanksEmail;
  
  