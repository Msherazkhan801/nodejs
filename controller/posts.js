import mongoose from "mongoose";
import PostMessage from "../models/PostMasseg.js"

export const  getPost= async (req, res) =>{ 
    const {page}=req.query
    try{
        const LIMIT=4;
        const startIndex=(Number(page)-1)*LIMIT
        const total =await PostMessage.countDocuments({})
        const posts=await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);
        res.status(200).json({data:posts,currentpage:Number(page),numberofpages:Math.ceil(total/LIMIT)})
    }catch(error){

        res.status(404).json({message:error.message})

    }
}

export const getPostbySearch = async(req,res)=>{
    const {searchQuery}=req.query
    try{
  const title= new RegExp(searchQuery, "i");
  const posts =await  PostMessage.find({$or:[{title}]})
  res.json(posts)


    }catch(error){
        res.status(404).json({message:error.message})

    }

}

export const  createPost= async (req, res) =>{ 
const post =req.body;
const newPost = new PostMessage({...post ,creater:req.userId,createdAt:new Date().toLocaleDateString()});
try{
    await newPost.save();
    res.status(202).json(newPost)  

}catch(error){
    res.status(409).json({message:error.message})
}

}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res)=>{
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);
    res.json({message:"Post is deleted Succesfully"})


}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        console.log(req.userId);
        return res.json({ message: "Unauthenticated User" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

