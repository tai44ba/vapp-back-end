import Post from "../models/post.model.js"


export const getAllPosts = async (req,res,next) => {
    try {
        const posts = await Post.find()
        res.json({msg:'got all posts',posts})
    } catch (error) {
        next(error)
    }
}
