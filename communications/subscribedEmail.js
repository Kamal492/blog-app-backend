const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const Post = require("../models/Posts")
const cron = require('node-cron');
const Subscriber = require("../models/Subscriber")
const ejs = require('ejs');
const fs = require('fs');


// Function to send daily emails to subscribers
async function sendDailyEmails() {
    const subscribers = await Subscriber.find();
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const posts = await Post.find({ createdAt: { $gte: last24Hours } });

    if (!subscribers || subscribers.length === 0) {
      console.log('No subscribers found.');
      return;
    }
    const emailTemplate = `<!DOCTYPE html>
    <html>
    <head>
      <title>Blog Posts</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .post {
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ddd;
          background-color: #fff;
        }
        h1{
            text-align: center;
        }
        a{
            text-decoration:none;
        }
      </style>
    </head>
    <body>
      <div class="container">
      <h1>Your daily digest</h1>
        <% posts.forEach((post) => { %>
          <div class="post">
        <div style="display: flex; align-items: center;">
    
        <!-- Right side (Title and Description) -->
        <div style="flex: 1;">
        <a href=<%= "http://localhost:3000/posts/" + post._id  %> ><h2 style="font-size: 24px; margin-bottom: 10px;"><%= post.title %></h2></a>
            <p style="color: #666;"><%= shortenDescription(post.description) %></p>
        </div>
        </div>
          </div>
        <% }); %>
      </div>
    </body>
    </html>
    `
    function shortenDescription(description) {
        const words = description.split(' ');
        if (words.length > 30) {
          return words.slice(0, 30).join(' ') + '...';
        }
        return description;
      }
    
      // Add the helper function to the template scope
      const compiledTemplate = ejs.compile(emailTemplate);
      const htmlContent = compiledTemplate({ posts, shortenDescription });
    //const htmlContent = ejs.render(emailTemplate, { posts });
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
      subject: 'Your Daily Newsletter',
      html: htmlContent,
    };
  
    // Send emails to all subscribers
    subscribers.forEach((subscriber) => {
      mailOptions.to = subscriber.email;
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`Error sending email to ${subscriber.email}: ${error.message}`);
        } else {
          console.log(`Email sent successfully to ${subscriber.email}: ${info.response}`);
        }
      });
    });
  }
  cron.schedule('0 9 * * *', () => {
  try {
    console.log('Cron job triggered at 9:00 AM');
    sendDailyEmails();
    
  } catch (error) {
    console.error('Error executing cron job:', error);
    
  }
});

