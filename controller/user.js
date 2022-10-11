import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.js"


export const signin = async(req,res)=>{
const {email,password}=req.body;

try{
    const existinguser=await User.findOne({email});
    if(!existinguser)return res.status(404).json({message:"user doesn't existing"})

    const ispasswordCorrect =await bcrypt.compare(password, existinguser.password);
    
    if(!ispasswordCorrect) return res.status(400).json({message:"Password Invalid"})
    
    const token =jwt.sign({email:existinguser.email,id:existinguser.id},"test",{expiresIn:"1h"})
    
    res.status(200).json({result:existinguser,token});

}catch(error){
    res.status(500).json({message:"Something is wrong"});
    console.log(error);

}

}
export const signup = async(req,res)=>{
    const {email,password,confirmPassword,firstName,lastName}=req.body;

    try{
        const existinguser=await User.findOne({email});
    if(existinguser)return res.status(400).json({message:"user already existing"})
    if(password != confirmPassword)return res.status(400).json({message:"Password does not same"})
    const hashedPassword= await bcrypt.hash(password,10)
    const result =await User.create({email,password:hashedPassword, name:`${firstName}${lastName}`})
    // changes
    const token =jwt.sign({email:result.email,id:result._id},"test",{expiresIn:"1h"})
    res.status(200).json({result:result,token});


    }catch(error){
    res.status(500).json({message:"somthing wrong"});
    console.log(error);

    }
}

