import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const secret_key: string = process.env.JWT_SECRET_KEY as string;
        const decoded = jwt.verify(token, secret_key) as { userId: string; email: string };

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
