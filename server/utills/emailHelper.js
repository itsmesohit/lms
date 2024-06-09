const nodemailer = require("nodemailer");

const mailHelper = async (options) => {

    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASSWORD,
        }
    });

    //send mail with defined transport object
    const message = {
        from: 'mishraakshay352@gmail.com', //sender address
        to: options.email, // list of receivers
        subject: options.subject,//subject line
        text: options.message, //plain text body
    };

    await transporter.sendMail(message);

}

module.exports = mailHelper