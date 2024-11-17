// src/utils/sendEmail.js
import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import db from '../db/db.js'; // Adjust the path if necessary

// Initialize MailerSend with API key
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

// Set sender details
const sentFrom = new Sender("MS_VunI6X@trial-k68zxl2npymlj905.mlsender.net", "Price Tracker");

// Function to send the email notification with product details
export const sendEmailNotification = async (productId, currentPrice) => {
    try {
        // Fetch the recipient email and target price from the database using productId
        const targetRecord = db.prepare('SELECT email, target_price FROM price_checks WHERE product_id = ?').get(productId);

        if (!targetRecord) {
            console.error(`No record found for product ID: ${productId}`);
            return; // Exit if no record is found
        }

        const { email: recipientEmail, target_price: targetPrice } = targetRecord;

        const recipients = [new Recipient(recipientEmail, 'Price Tracker User')];

        // Create the message content
        const message = `
            Price target reached for product ID: ${productId}.
            Target Price: $${targetPrice}.
            Current Price: $${currentPrice}.
        `;

        // Define personalization data
        const personalization = [{
            email: recipientEmail,
            data: {
                email: recipientEmail, 
                product_id: productId,                
                targetPrice: targetPrice,
                currentPrice: currentPrice,
                message: message,
            },
        }];

        // Set up email parameters
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject('Target Price Notification')
            .setTemplateId('0r83ql3kq2z4zw1j') 
            .setPersonalization(personalization); 
        await mailerSend.email.send(emailParams);
        console.log(`Email sent successfully to ${recipientEmail} for product ID: ${productId}.`);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};
