import { Request, Response } from "express";
import User from "../models/user.model.js";

// Example: Get current user profile
export const getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        // req.userId is set by authenticateToken middleware
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Fetch user from database using the userId from JWT
        const user = await User.findById(userId).select('-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User profile retrieved successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Example: Update user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { name, phoneNumber } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phoneNumber },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
