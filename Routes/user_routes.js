import express from 'express'
import { userSignupController, userMailVerificationController, forgotPassword, forgotPasswordOTPVerification, newPasswordSetup, login, dashboardData, cookieCreate, uploadFile, createJob, allJobs, suggestedJobs, apply, seeApplications } from '../Controllers/user_controller.js'
import userAuth from '../Middlewares/userAuth.js';
import roleAuth from '../Middlewares/roleAuth.js';
import asyncHandler from '../Utils/asyncHandler.js';
import { storage } from '../Middlewares/multer.js'
import multer from 'multer';

export const Routes = express.Router();

// =======================================================    Routes for Users     =============================================================================


Routes.get('/', (req, res) => {
    res.send("Server is up and running.");
})

//  Handles new User signup/registration and sending email verification mail :

// Routes.post('/signup', userSignupController);
Routes.post('/signup', asyncHandler(userSignupController));       /* We've created a asyncHandler() which will take our controller function. */

// Verifies User's E-mail :
Routes.get('/mail-verification/:id/:emailtoken', asyncHandler(userMailVerificationController));

// Handles Forgot Password Part :
// 1. Verifies user existence through e-mail and send OTP to the email
Routes.get('/forgot-password/:email', asyncHandler(forgotPassword));

// 2. Veries OTP for the user/email.
Routes.get('/forgot-password-otp-verify/:otp/:email', asyncHandler(forgotPasswordOTPVerification))

// 3. Changes Password of the user.
Routes.post('/changePassword', asyncHandler(newPasswordSetup))

// Handles User Login Part :
Routes.post('/login', asyncHandler(login));

// Role Setup : Not required now as we are sending role from signup form and setting role in the signup controller.
// Routes.get('/roleSetup/:role/:ID', userAuth, asyncHandler(roleSetup));

// Dashboard Data :
Routes.get('/user-dashboard/:id', userAuth, roleAuth(["employee", "admin"]), asyncHandler(dashboardData))

// Resume / Profile pic upload
const upload = multer({ storage, limits: { fileSize: 3 * 1024 * 1024 } }) // This line will create an instance of multer and pass the storage object to it.
// Setting limits if optional. It is used to set the maximum size of the file which we are uploading. Here, we are setting the maximum size of the file to 3MB.
// 3 * 1024 * 1024 = 3MB . first 1024 is used to convert 3MB into bytes and 2nd 1024 is used to convert bytes into KB.

Routes.post('/upload/:id', upload.single('files'),asyncHandler(uploadFile));      // single() is used to upload a single file. It takes the name of the file as an argument. 'file' in single('file') is the name of the field in the form which we are using to upload the file.

// Suggested Jobs for the user :
Routes.get('/suggested-jobs/:id', userAuth, roleAuth(["employee", "admin"]), asyncHandler(suggestedJobs));

// Apply for the job :
Routes.post('/apply/:id/:jid', userAuth, roleAuth(["employee", "admin"]), asyncHandler(apply));


// ====================================================    Routes for Employer     ==========================================================================

Routes.post('/create-job/:id', userAuth, roleAuth(["employer", "admin"]), asyncHandler(createJob));

// Fetch all jobs created by the Employer
Routes.get('/all-jobs/:id', userAuth, roleAuth(["employer", "admin"]), asyncHandler(allJobs));

// See Applied Candidates for the job
Routes.get('/see-applications/:jid', userAuth, roleAuth(["employer", "admin"]), asyncHandler(seeApplications));






















// ======================================= Testing Purpose ============================================

// Sample cookie setup :
Routes.get('/create-cookie', asyncHandler(cookieCreate));

//Authentication before accessing the route handler.
Routes.get('/test-user', userAuth, async (req, res) => {     // We are putting userAuth middleware to check if the user is authenticated or not before accessing the route handler i.e. (req, res) => {}
    res.send("User Route is working fine and user is authenticated as well.");
})

// =====================================================================================

// Testing file upload using multer :

// const upload = multer({ storage, limits: { fileSize: 3 * 1024 * 1024 } }) // This line will create an instance of multer and pass the storage object to it.
// // Setting limits if optional. It is used to set the maximum size of the file which we are uploading. Here, we are setting the maximum size of the file to 3MB.
// // 3 * 1024 * 1024 = 3MB . first 1024 is used to convert 3MB into bytes and 2nd 1024 is used to convert bytes into KB.

// Routes.post('/upload', upload.single('file'), (req, res) => {      // single() is used to upload a single file. It takes the name of the file as an argument. 'file' in single('file') is the name of the field in the form which we are using to upload the file.
//     console.log("File details : ", req.file);
//     // req.file will contain the file details. e.g. path, filename, mimetype, size etc. path is the path where the file is stored in cloudinary.
//     res.send("File uploaded successfully");
// });
