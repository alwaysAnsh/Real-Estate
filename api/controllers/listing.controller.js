import Listing from '../models/listing.models.js'
import { errorHandler } from '../utils/error.js';


export const createListing = async (req, res, next ) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({
            success: true,
            message: "listing created successfully",
            listing,
        })
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async(req, res, next ) =>{
    console.log("inside delete")
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404, "listing can not be found with this id"))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'You can only delete your own listing'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            success: true,
            message: "listing has been deleted yay"
        })
    } catch (error) {
        next(error)
    }
}

export const updateListing = async (req, res, next ) => {
    const listing = await Listing.findById(req.params.id );
    if(!listing){
        return next(errorHandler(404,'user not found with this listing id '))
    }
    if(req.user.id !== listing.userRef ){
        return next(errorHandler(401,'You can only update your own listing '))
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json({
            success: true,
            message: 'listing updated successfully ',
            updatedListing
        })
    } catch (error) {
        next(error)
    }
}

export const getListing = async(req, res, next ) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404,'Listing not found'))
        }
        res.status(200).json({
            success: true,
            message: "details of listing fetched successfully",
            listing,
        })
    } catch (error) {
        next(error)
    }
}