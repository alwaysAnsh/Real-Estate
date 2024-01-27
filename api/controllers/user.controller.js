import User from "../models/user.models.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const updateUser = async (req,res,next) => {
    
    if(req.user.id !== req.params.id ) {
        console.log("req.params.id: ", req.params.id)
        return next(errorHandler(401,'you can only update uour own account'))}
    try {
        if(req.body.password ){
            req.body.password = bcryptjs.hashSync(req.body.password,10)

        }
        //Now updatae the user
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new: true})
        console.log("user updated!! 1 step")
        //now separate the password from the rest

        const {password, ...rest } = updateUser._doc 
        return res.status(200).json(rest)

    } catch (error) {
        console.log("catch ke andar")
        next(error)
        
    }
}

export const deleteUser = async(req, res, next) => {
    console.log("delete user api hit")
    if(req.user.id !== req.params.id ){
        return next(errorHandler(401, 'you can only delete your own account'))
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie("access_token");        //CHECK THIS ONE OUT
        res.status(200).json({success: true, message: "user deleted successfully"})
    } catch (error) {
        console.log("error deleting: ", error)
        next(error)
    }
}