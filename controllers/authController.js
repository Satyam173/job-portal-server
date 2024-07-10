import Users from '../models/userModel'

export const register = async (req,res,next) =>{
    const {firstName,lastName, email,password} = req.body;

    // validate fields
    if(!firstName){
        next("First name is required");
    }
    if(!email){
        next("Email is required");
    }
    if(!lastName){
        next("Last name is required");
    }
    if(!password){
        next("Password is required");
    }
    try {
        const userExist  = await Users.findOne({email});
        if(userExist){
            next("Email address already exists");
            return
        }
        const user = Users.create({
            firstName,
            lastName,
            email,
            password,
        })

        // user token
        const token = user.createJWT();
        res.send(201).send({
            use:{
                _id: user._id,
                firstName:user.firstName,
                lastName:user.lastName,
                email: user.email,
                accountType:user.accountType,
            },
            token,
        })
    } catch (error) {
        console.log(error);
        res.send(404).json({message:error.message});
    }
}

export const signIn = async(req,res,next) => {
    const {email,password} = req.body;
    try {
        //validation
        if(!email || !password){
            next("Please provide a user credentials");
            return;
        }

        //find user
        const user  = await Users.findOne({email}.select("+password"));

        if(!user){
            next("Invalid email or password");
            return;
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            next("Invalid email and password");
            return;
        }

        user.password = undefined;
        const token = user.createJWT();

        res.status(201).json({
            success:true,
            message:"Login successful",
            user,
            token,
        })
        
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message})
    }
};