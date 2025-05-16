import mongoose from "mongoose";
import User from "./user_model.js";

const jobSchema =  mongoose.Schema({
    organization: { type: String, required: true },
    designation: { type: String, required: true },
    min_experience: {type: String, required: true}, 
    max_experience: {type: String, required: true}, 
    salary: {type: String, default: "Not Disclosed"}, 
    location: {type: String}, 
    job_desc: {type: String, required: true}, 
    work_mode: {type: String}, 
    full_time: {type: String}, 
    permanent : {type: String}, 
    contractual: {type: String}, 
    qualifications: {type: String}, 
    benefits: {type: String}, 
    skills: {type: Array},

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},
{
    timestamps: true
})


const Job = mongoose.model("Job_data", jobSchema);

export default Job;