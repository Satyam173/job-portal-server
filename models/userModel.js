import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, "first name is required"],
    },
    lastName:{
        type:String,
        required:[true, "last name is required"],
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true, "password is required"],
        minlength:[6,"Passowrd must be at least 6 characters long"],
        select:true
    },
    accountType:{type:String, default:"seeker"},
    contact:{type:String},
    location:{type:String},
    profileUrl:{type:String},
    jobTitle:{type:String},
    about:{type:String},
},

{timestamps:true}

);

userSchema.pre("save",async function(){
    if(!this.isModified) return;
    const salt = await bcrypt.getSalt(10);
    this.passowrd = await bcrypt.hash(this.passowrd,salt);
})

//compare pwd
userSchema.method.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.passowrd);
    return isMatch;
}

//jwt token
userSchema.method.createToken = async function(){
    return JWT.sign(
        {userId:this._id},
        process.env.JWT_SECRET_KEY,
        {expiersIn:'id',
});
}

const Users = mongoose.model("Users",userSchema);
export default Users;