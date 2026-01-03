import {Request, Response} from "express";
import User from "../models/user.model.js";
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import { generateToken } from "../config/generateToken.js";
interface UserRegistration{
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
}
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    const {name, email, password, phoneNumber}:UserRegistration = req.body;
    try {
        const user = await User.findOne({email})
        if (user){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword: string = await argon2.hash(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber
        });
        await newUser.save();

        const token = generateToken(newUser as UserRegistration);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"});
    }
}

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password }: UserRegistration = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      const secret_key: string = process.env.JWT_SECRET_KEY as string;
      const token = jwt.sign(
          { userId: user._id, email: user.email },
          secret_key,
          { expiresIn: '1h' }
      );

      res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "strict",
          maxAge: 60 * 60 * 1000 // 1 hour
      });

      return res.status(200).json({
          message: "Login successful",
          user: { id: user._id, name: user.name, email: user.email }
      });
  }catch(error){
    console.error(error)
    return res.status(500).json({message:"Internal server error"});
    }
}

export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict"
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
