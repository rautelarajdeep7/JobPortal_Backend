import mongoose from 'mongoose'
import Job from './job_model.js'

const userSchema = mongoose.Schema({                            // userSchema we have created for userRegistration
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String },
    otp: { type: String },
    emailToken: { type: String, default: null },        // This we have used to send a token to user on email when he Signup/Register on our website. 
    // And when he clicks on Verify in his email account, then that token is matched and then, value of isMailverified will then become true.
    isMailverified: { type: Boolean, default: false },
    profile_img: {type: String, default: "default_profile.jpg"},
    profile_img_id: {type: String},
    resume: {type: String},
    resume_id: {type: String},
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],   // ref is used to refer to the Job model. ref means reference of the Job model
    createdJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }], 
},
    {
        timestamps: true
    })

const User = mongoose.model("User", userSchema);

export default User;