import mongoose ,{Schema} from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Company name is required"],
    },
    email:{
        tye:String,
        required:[true,"email is required"],
        unique:true,
        validate:validator.isEmail,
    },
    passowrd:{
        type:String,
        required:[true, "password is required"],
        minlength:[6,"Passowrd must be at least 6 characters long"],
        select:true
    },
    contact:{type:String},
    location:{type:String},
    profileUrl:{type:String},
    jobPosts:[{type:Schema.Types.ObjectId,ref:"Jobs"}]
});

companySchema.pre("save",async function(){
    if(!this.isModified) return;
    const salt = await bcrypt.genSalt(10);
    this.passowrd = await bcrypt.hash(this.passowrd,salt);
})

//compare pwd
companySchema.method.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.passowrd);
    return isMatch;
}

//jwt token
companySchema.method.createJWT = async function(){
    return JWT.sign(
        {userId:this._id},
        process.env.JWT_SECRET_KEY,
        {expiersIn:'id',
});
}

const Companies = mongoose.model("Companies",companySchema);
export default Companies