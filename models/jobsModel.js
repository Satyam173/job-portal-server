import { compare } from "bcryptjs";
import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Companies" },
    jobTitle: { type: String, required: [true, "Job Title is required"] },
    jobType: { type: String, required: [true, "Job type is required"] },
    location: { type: String, required: [true, "Location is required"] },
    salary: { type: Number, required: [true, "Salary is required"] },
    vanacies: { type: Number },
    experiences: { type: Number, default: 0 },
    detail: [{ desc: { type: String }, requirements: { type: String } }],
    application: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

const Jobs = mongoose.model("Jobs",jobSchema);
export default Jobs