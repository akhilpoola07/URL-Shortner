const AuthService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const jwtConfig = require('../config/jwt');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password, confirmPassword } = req.body;

            if (!name || !email || !password) {
                return sendError(res, 400, 'Name, email, and password are required.');
            }

            if (password.length < 8) {
                return sendError(res, 400, 'Password must be at least 8 characters long.');
            }

            if (confirmPassword && password !== confirmPassword) {
                return sendError(res, 400, 'Password and confirm password do not match.');
            }

            const { user, token } = await AuthService.register({ name, email, password });

            res.cookie(jwtConfig.cookieName, token, cookieOptions);

            return sendSuccess(res, 201, 'Registration successful.', { user, token });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return sendError(res, 400, 'Email and password are required.');
            }

            const { user, token } = await AuthService.login({ email, password });

            res.cookie(jwtConfig.cookieName, token, cookieOptions);

            return sendSuccess(res, 200, 'Login successful.', { user, token });
        } catch (error) {
            next(error);
        }
    }

    static async getCurrentUser(req, res, next) {
        try {
            const user = await AuthService.getUserById(req.user.id);
            return sendSuccess(res, 200, 'User profile retrieved.', { user });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res) {
        res.clearCookie(jwtConfig.cookieName, cookieOptions);
        return sendSuccess(res, 200, 'Logged out successfully.');
    }

    static async updateProfile(req, res, next) {
        try {
            const { name } = req.body;
            if (!name || name.trim() === '') {
                return sendError(res, 400, 'Name is required.');
            }

            const { user, token } = await AuthService.updateProfile(req.user.id, { name });
            res.cookie(jwtConfig.cookieName, token, cookieOptions);

            return sendSuccess(res, 200, 'Profile updated successfully.', { user, token });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
