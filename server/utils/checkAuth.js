import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default async function checkAuth(req) {
    if (req.headers.authorization === undefined) {
        return {
            success: false,
            error: 'Authorization token undefined'
        };
    }

    const token = req.headers.authorization.split('Bearer ')[1];
    if (token) {
        try {
            const auth = jwt.verify(token, process.env.JWT_SECRET)
            return {
                success: true,
                user: auth
            };
        } catch (error) {
            return {
                success: false,
                error: 'Invalid token'
            };

        }
    }
    return {
        success: false,
        error: 'No token provided'
    };
}
