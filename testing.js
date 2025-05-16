
// bcrypt encryption =============================================================

/* 
import bcrypt from 'bcrypt'

const plainPassword = "rajdeep12345"

const hashedPassword = await bcrypt.hash(plainPassword,10);       // this returns a promise. So, we will use await
// 10 is called saltRounds i.e. the no of character which we want in our hashed/encrypted password.

console.log(hashedPassword);

const plainPassword2 = "rajdeep12345"

const hashedPassword2 = await bcrypt.hash(plainPassword,10);       // this returns a promise. So, we will use await
// 10 is called saltRounds i.e. the no of character which we want in our hashed/encrypted password.

console.log(hashedPassword2);
*/

// Sending email using nodemailer =============================================================

/* 
import SendMail from "./Utils/mailer.js";

const email = "rautelarajdeep7@gmail.com";
const subject = "Offer Letter - Google";
const content = `<div>Hi Rajdeep,</div> <br> <p>You have been selected for the role of Software developer</p> <div>Regards <br> Marie Beckham <br> <a href="https://www.google.com">Google</a></div>`;

SendMail(email, subject, content);

*/

// creating token for email verification ======================================================
import crypto from 'crypto'

const mailToken = await crypto.randomBytes(12).toString('hex');
 console.log(mailToken);