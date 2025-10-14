(
    function () {

        const request = require('../../request');
        const nodemailer = require('nodemailer');

        request.setupAPIRequest("POST", "contact", 1, submit_contact_form, false, "name", "email", "message");

        function submit_contact_form(name, email, message, res) {

            const admin_email = process.env.ADMIN_EMAIL_ADDRESS;

            if (!admin_email) {
                res.status(500).send("Something went wrong!");
                return;
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.ADMIN_EMAIL_ADDRESS,
                    pass: process.env.ADMIN_EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: admin_email,
                to: admin_email,
                subject: 'New Contact Form Submission',
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending message:', error);
                    res.status(500).send("Something went wrong!");
                } else {
                    console.log('Message sent:', info.response);
                    res.status(200).send("Message sent successfully!");
                }
            });

        }

    }()
);