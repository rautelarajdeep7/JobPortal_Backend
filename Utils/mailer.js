// Utility to send email
import nodemailer from 'nodemailer'
import dotenv from "dotenv"

dotenv.config()

// Nodemailer configuration ====================================================================

const transporter = nodemailer.createTransport({        
    // host: 'smtp.ethereal.email',            // host which will send emails. Currently we are using ethreal, but later we will use google
    host: process.env.MAIL_HOST,               // host for using gmail
    port: Number(process.env.MAIL_PORT),              // mail request port . It is smptp port 
    secure: false,      // true for port 465, false for other ports.
    auth: {
        // Below user and password for email we will get from .env. It should not be written directly.
        // user: 'amelie.bergstrom@ethereal.email',   // Ethreal email
        // pass: '4WQvhEqhq4CxuAQqxr'                 // Ethreal password

        user: process.env.MAIL_USER,                   // my gamil id
        pass: process.env.MAIL_PASS                    // app password key "JobPortalProject" password
    }
});

console.log(process.env.DB_URL)

const SendMail = async (email, subject, content) => {

    try {
        await transporter.sendMail({
            from: process.env.MAIL_USER,             // Sender address. Currently we have used ethreal bnut we can also use google email by doing setup.
            to: email,                                  //"bar@example.com, baz@example.com", // list of receivers
            subject: subject,                           //"Hello ✔", // Subject line
            // text:          ,                         //"Hello world?", // plain text body
            html: content                               //"<b>Hello world?</b>", // html body
        });

        console.log("Email verification mail sent to : ", email);
    }

    catch (error) {
        console.log("Error occured while sending email: ", error.message);
    }

}

export default SendMail;
