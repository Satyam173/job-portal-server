import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, "first name is required"],
    }
})