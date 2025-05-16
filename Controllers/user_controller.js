import User from '../Models/user_model.js'
import Job from '../Models/job_model.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import SendMail from '../Utils/mailer.js'
import { mailVerifyTemplate, forgotPasswordOTP } from '../Templates/mailTemplate.js'
import customError from '../Utils/customError.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary';

dotenv.config()


const JWT_KEY = process.env.JWT_KEY;

const userSignupController = async (req, res) => {  // Removed next from argument list because the functionality of next() will now be handled by asyncHandler()
    const { fname, lname, email, password, phone, role } = req.body;
    // try{
    if (!fname || !lname || !email || !password || !phone || !role) {          // It means if any of the field is missing then if condition will run
        // res.status(400).json({ "message": "Some fields are missing !" }) // commenting because we will be handling it from error middleware

        // next(new customError(400, "Input Fields cannot be empty")); // next is not required as we have used next() in asyncHandler which will automatically do the next() when an error occurs.
        // We just need to throw the error now.
        throw new customError(400, "Input Fields cannot be empty");

        // Inside next we cannoot send anything. We can only send error. We cannot send user details etc.
    }

    // Below code will run if all details are sent by user and no input is missing 

    // Hasing/Encrypting password ===========================================================
    const hashedPassword = await bcrypt.hash(password, 10);     // 10 is called saltRounds i.e. the no of character which we want in our hashed/encrypted password.

    // Creating Token for Email verification ======================================
    const mailToken = crypto.randomBytes(12).toString('hex');

    const newUser = await User.create({ fname, lname, email, password: hashedPassword, phone, emailToken: mailToken, role }); // this returns a promise. So, we will use await

    // Getting user information :
    const user = await User.findOne({ email });
    const id = user._id.toString();

    // Sending email to user for verification ==================================================

    /* const content = `<p> Click on <a href='http://localhost:3000/${id}/${mailToken}'>Verify</a> to activate your account</p>`;  
       Commenting it because now we will send mail from the template which we have created. */

    SendMail(email, "Job Hunters - Email verification", mailVerifyTemplate.replace(/verification_link|USERNAME/g, (match) => {
        const replacements = {
            verification_link: `http://localhost:3000/api/mail-verification/${id}/${mailToken}`,
            USERNAME: fname + " " + lname
        };
        return replacements[match];
    }));
    // mailVerifyTemplate.replace("verification_link", `http://localhost:5173/${id}/${mailToken}`) is used to replace only onee string with other, but above
    // we have used another method to replace multiple strings.
    //We will replace the string "verification_link" which is written in our mailVerifyTemplate with the localhost string.
    // To Send Email, we can only write inline CSS in the HTML content. 

    res.status(201).json({ message: "User created successfully. Please Check your email for E-mail verification link.", user: newUser });
    // }
    //     catch {
    //     // console.log("Error in Signup Controller ! - ", error.message);
    //     // console.log("Error: ",error)
    //     // res.status(500).json({ message: "Internal Server Error`" , error_msg: error.message});
    //     // 500-599 status is for server error response.
    // }
}

const userMailVerificationController = async (req, res,) => {


    const { id, emailtoken } = req.params;            // id and emailtoken from params

    // try{
    const user = await User.findOne({ _id: id });

    if (!user) {
        // return res.status(404).json({ message: "User not found !" });
        throw new customError(400, "User not found !");
        // Inside next we cannoot send anything. We can only send error. We cannot send user details etc.
    }

    const verificationToken = user.emailToken;      // Token from Database

    if (emailtoken === verificationToken) {     // Checking if email token from params and email token from DB for the user are same or not for user verification.
        user.isMailverified = true;             // Changing isMailverified to true for the verified user.
        user.emailToken = undefined             // after Email Verification, we don't need the token to be stored/showed in DB. So, we are making it undefined.

        await user.save();                    // It will save the changes which we have done for the user to DB. i.e. isVerified=true and user.emailToken = undefined will be stored in DB.
        res.redirect("http://localhost:5173/mail-verified-successfully");
        // return res.status(200).json({ message: "Email Verified successfully...", redirect: "/login" });
    }
    else {
        res.redirect("http://localhost:5173/mail-verification-failed");
        // return res.status(404).json({ message: "Email Verificaion failed !" });
    }
    // }


    // catch (error) {
    //     console.log("Error in Mail Verifcation Controller ! - ", error.message);
    //     // res.status(500).json({ message: "Internal Server Error !" });
    // }

}

const forgotPassword = async (req, res) => {         // using next to make this a middleware from a normal controller because we want to send the error to the error middleware.
    // we are creating error middleware for all such errors which are common to them. like "user exists or not" etc

    const { email } = req.params;            // email from params

    // try{
    const user = await User.findOne({ email: email });

    if (!user) {

        throw new customError(400, "User not found !");
        // Inside next we cannot send anything. We can only send error. We cannot send user details etc.
    }

    const OTP = "" + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);

    const sent = SendMail(email, "Job Hunters - Password Reset", forgotPasswordOTP.replace(/OTP_VALUE|USERNAME/g, (match) => {
        const replacements = {
            OTP_VALUE: OTP,
            USERNAME: user.fname + " " + user.lname
        };
        return replacements[match];
    }));


    if (sent) {
        const newData = await User.findOneAndUpdate({ email: email }, { $set: { otp: OTP } });
        res.status(201).json({ message: "OTP sent to Email successfully" });
    }
    // }   
    // catch (error) {              // Commented this because we will handle all errors now in middleware for custom error.
    //     console.log("Error in forgotPassword Controller ! - ", error.message);
    //     // res.status(500).json({ message: "Internal Server Error !" });
    // }

}

const forgotPasswordOTPVerification = async (req, res) => {

    const { otp, email } = req.params;            // id and emailtoken from params

    // try{
    const userWithOTP = await User.findOne({ email: email });

    if (!userWithOTP) {
        // return res.status(404).json({ message: "User not found !" });

        throw new customError(400, "User not found !");
        // Inside next we cannot send anything. We can only send error. We cannot send user details etc.
    }

    const verificationOTP = userWithOTP.otp;      // Token from Database

    if (otp === verificationOTP) {
        userWithOTP.otp = undefined             // after OTP Verification, we don't need the OTP to be stored/showed in DB. So, we are making it undefined.

        await userWithOTP.save();                    // It will save the changes which we have done for the user to DB. i.e. isVerified=true and user.emailToken = undefined will be stored in DB.
        return res.status(201).json({ message: "OTP Verified successfully..." });
    }
    else {
        return res.status(404).json({ message: "OTP Verificaion failed !" });
    }
    // }


    // catch (error) {
    //     console.log("Error in forgotPasswordOTPVerification Controller ! - ", error.message);
    //     // res.status(500).json({ message: "Internal Server Error !" });
    // }

}

const newPasswordSetup = async (req, res) => {
    const { email, password } = req.body;

    // try {

    if (!email) {
        // res.status(400).json({ "message": "Some fields are missing !" }) // commenting because we will be handling it from error middleware

        throw new customError(400, "Email is required !");
        // Inside next we cannoot send anything. We can only send error. We cannot send user details etc.
    }

    const user_new = await User.findOne({ email });

    if (!user_new) {
        throw new customError(404, "User not found!");
    }

    // Hasing/Encrypting password ===========================================================
    const hashedPassword = await bcrypt.hash(password, 10);     // 10 is called saltRounds i.e. the no of character which we want in our hashed/encrypted password.

    user_new.password = hashedPassword;

    await user_new.save()
    res.status(201).json({ message: "Password Changed successfully..." });
    // }
    // catch (error) {
    //     console.log("Error in newPasswordSetup Controller ! - ", error.message);
    // }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        throw new customError(400, "email and password both are required")
    }

    const login_user = await User.findOne({ email: email })

    if (!login_user) {
        throw new customError(400, "User does not exist")
    }

    const valid = await bcrypt.compare(password, login_user.password);

    if (!valid) {
        throw new customError(400, "Incorrect password entered...")   // Getting incorrect password always
    }

    const token = jwt.sign({ name: login_user.fname + " " + login_user.lname, email: `${email}`, id: login_user._id, role: login_user.role }, JWT_KEY, { expiresIn: "3h" });      // First object is payload/data, 2nd argument is secret key which is taken from env file, 3rd is expiry time of token which is optional.
    // expirty time can be in seconds, minutes, hours, days, weeks, years etc. They are denoted by "s", "m", "h", "d", "w", "y" respectively.
    // const JHUID = login_user._id.toString();

    //1. Sending JWT token in cookie -------------------------------------------
    // res.cookie("MyJWTtoken", token);    // It will create a cookie named MyJWTtoken and store the token in it.
    // res.cookie("JHUid", JHUID);    // It will create a cookie named MyJWTtoken and store the token in it.

    // We can also send jwt token in response header. It is also a way to send token. It is used because we cannot store cookie in mobile applications. But heaeder are used in both web and mobile applications.
    // But it is not recommended because it can be accessed by the user and can be misused.
    // In terms of security, cookies are more secure than headers.

    // 2. Sending JWT token in header -------------------------------------------
    res.set("authorization", `Bearer ${token}`);                  // It will set the token in the header of the response.

    // "authorization" is the key and Bearer is a value.
    // Bearer is a scheme which means that the token is a bearer token. It is a type of token. It is used to authenticate the user. It is used in the header of the request to authenticate the user.

    res.status(201).json({ message: "User logged in successfully", userID: login_user._id, role: login_user.role });
}

// Not required now bcz now we are sendind role from the signup form and setting it in signup controller.
// const roleSetup = async (req, res) => {

//     const { role, ID } = req.params;

//     const user_RoleSet = await User.findOne({ _id: ID });

//     if (!user_RoleSet) {
//         throw new customError(400, "User not found !");
//     }

//     user_RoleSet.role = role;
//     await user_RoleSet.save();

//     res.status(201).json({ message: "Role added successfully...", userID: user_RoleSet._id });
// }

const dashboardData = async (req, res) => {

    const { id } = req.params;

    const user_Dashboard = await User.findOne({ _id: id });

    if (!user_Dashboard) {
        throw new customError(401, "User not found !");
    }

    res.status(201).json({ message: "User found successfullly ! ", user_data: user_Dashboard });

}

const uploadFile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        throw new customError(400, "User not found !");
    }

    if (req.file.mimetype !== 'application/pdf') {
        // const updateImage = await User.findByIdAndUpdate(id, { profile_img: req.file.path });
        if (user.profile_img_id) {
            await cloudinary.uploader.destroy(user.profile_img_id);
        }
        user.profile_img_id = req.file.filename;
        user.profile_img = req.file.path;
        await user.save();
    }
    else {
        // const updateResume = await User.findByIdAndUpdate(id, { resume: req.file.path });
        if (user.resume_id) {
            await cloudinary.uploader.destroy(user.resume_id);
        }
        user.resume_id = req.file.filename;
        user.resume = req.file.path;
        await user.save();
    }
    // console.log("File details : ", req.file);
    // req.file will contain the file details. e.g. path, filename, mimetype, size etc. path is the path where the file is stored in cloudinary.
    res.status(201).json({ message: "File uploaded successfully", path: req.file.path, originalname: req.file.originalname });
}

const createJob = async (req, res) => {

    const { id } = req.params;

    const { organization, designation, min_experience, max_experience, min_salary, max_salary, location, job_desc, work_mode, full_time, permanent, contractual, qualifications, benefits, skills } = req.body;
    var  salary;
    if((min_salary === undefined || min_salary === null || min_salary === "") && (max_salary === undefined || max_salary === null || max_salary === "")){ 
        salary = "Not disclosed";
    }
    else if(min_salary === undefined || min_salary === null || min_salary === ""){
        salary = "upto " + max_salary + " LPA";
    }
    else if(max_salary === undefined || max_salary === null || max_salary === ""){
        salary = min_salary + "+ LPA";
    }
    else{
        salary = min_salary + "-" + max_salary + " LPA";
    }
    // const skills_array = JSON.parse(skills);

    // skills_array.forEach((skill, i, array) => {
    //     array[i] = skill.trim().toLowerCase();
    // })

    if (!organization || !designation || !job_desc) {          // It means if any of the field is missing then if condition will run
        throw new customError(400, "Required Fields cannot be empty");
    }

    const job = await Job.create({ organization, designation, min_experience, max_experience, salary, location, job_desc, work_mode, full_time, permanent, contractual, qualifications, benefits, skills, createdBy: id });
    const user = await User.findByIdAndUpdate(id, { $push: { createdJobs: job._id } });

    // const allJobs = await Job.find({ createdBy: new mongoose.Types.ObjectId(`${id}`) });
    res.status(201).json({ message: "Job created successfully.", job: job });

}

const allJobs = async (req, res) => {

    const { id } = req.params;

    const allJobs = await Job.find({ createdBy: new mongoose.Types.ObjectId(`${id}`) });

    res.status(201).json({ message: "Jobs fetched successfully.", allJobs: allJobs });

}

const suggestedJobs = async (req, res) => {

    const { id } = req.params;

    const allJobs = await Job.find();
    res.status(201).json({ message: "Jobs fetched successfully.", jobs: allJobs });

}

const apply = async (req, res) => {
    const { id, jid } = req.params;

    const user = await User.findByIdAndUpdate(id, { $push: { appliedJobs: jid } });
    const jobs = await Job.findByIdAndUpdate(jid, { $push: { appliedBy: id } });

    res.status(201).json({ message: "Job created successfully." });

}

const seeApplications = async (req, res) => {

    const { jid } = req.params;
    const applications = await Job.findById(jid).populate('appliedBy'); // without populate, it will only return the objectIds of the products purchased by the user
    res.status(201).json({ applications: applications.appliedBy });
}

// Sample Cookie Creation
const cookieCreate = async (req, res) => {

    const token = jwt.sign({ name: "rajdeep" }, "12345", { expiresIn: "1m" });      // First object is payload/data, 1nd argument is secret key., 3rd is expiry time which is optional.
    // expirty time can be in seconds, minutes, hours, days, weeks, years etc. They are denoted by "s", "m", "h", "d", "w", "y" respectively.

    // 1. Sending JWT token in cookie
    // res.cookie("MyJWTtoken", token);    // It will create a cookie named MyJWTtoken and store the token in it.

    // 2. Sending JWT token in header  
    res.set("authorization", `Bearer ${token}`); // It will set the token in the header of the response.

    res.status(201).json({ message: "Cookie created successfully !" });

}


export { userSignupController, userMailVerificationController, forgotPassword, forgotPasswordOTPVerification, newPasswordSetup, login, dashboardData, cookieCreate, uploadFile, createJob, allJobs, suggestedJobs, apply, seeApplications };