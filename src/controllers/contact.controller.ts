import { Request, Response } from "express";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getAllContacts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).populate('contacts', '-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Contacts retrieved successfully",
            contacts: user.contacts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createContact = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { phoneNumber } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        // Find the contact user by phone number
        const contactUser = await User.findOne({ phoneNumber });
        if (!contactUser) {
            return res.status(404).json({ message: "User with this phone number not found" });
        }

        const contactId = contactUser._id.toString();

        if (userId === contactId) {
            return res.status(400).json({ message: "Cannot add yourself as a contact" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const contactExists = user.contacts.some(
            (contact) => contact.toString() === contactId
        );

        if (contactExists) {
            return res.status(400).json({ message: "Contact already exists" });
        }

        user.contacts.push(new mongoose.Types.ObjectId(contactId));
        await user.save();

        const updatedUser = await User.findById(userId).populate('contacts', '-password');

        return res.status(201).json({
            message: "Contact added successfully",
            contacts: updatedUser?.contacts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getContactById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        const user = await User.findById(userId as string).populate('contacts', '-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const contact = user.contacts.find(
            (contact: any) => contact._id.toString() === id
        );

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        return res.status(200).json({
            message: "Contact retrieved successfully",
            contact
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateContactById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        const user = await User.findById(userId as string);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const contactExists = user.contacts.some(
            (contact) => contact.toString() === id
        );

        if (!contactExists) {
            return res.status(404).json({ message: "Contact not found" });
        }

        return res.status(200).json({
            message: "Contact verified successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteContactById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({ message: "Invalid contact ID" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const contactIndex = user.contacts.findIndex(
            (contact) => contact.toString() === id
        );

        if (contactIndex === -1) {
            return res.status(404).json({ message: "Contact not found" });
        }

        user.contacts.splice(contactIndex, 1);
        await user.save();

        return res.status(200).json({
            message: "Contact deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
