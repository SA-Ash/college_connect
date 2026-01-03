import jwt from "jsonwebtoken"

export const generateToken = (newUser: any) => {
    try {
        const secret_key: string = process.env.JWT_SECRET_KEY as string;
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            secret_key,
            { expiresIn: '1h' }
        );
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}
