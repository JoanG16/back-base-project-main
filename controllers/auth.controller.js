// src/controllers/auth.controller.js
const catchAsync = require('../utils/catch-controller-async');
const {
    forgotPasswordService,
    resetPasswordService
} = require('../services/auth.service');
const AppError = require('../utils/app-error');

class AuthController {
    forgotPassword = catchAsync(async (req, res, next) => {
        const { email } = req.body;
        const result = await forgotPasswordService(email);
        if (result?.error) {
            return next(new AppError(result.message, result.statusCode || 500));
        }
        res.status(result?.statusCode || 200).json({
            status: 'success',
            message: result?.message || 'Si existe el correo, se envió un link de recuperación'
        });
    });

    resetPassword = catchAsync(async (req, res, next) => {
        const { token } = req.params;
        const { newPassword } = req.body; // 👈 ojo aquí, tu frontend manda "newPassword"
        const result = await resetPasswordService(token, newPassword);
        if (result?.error) {
            return next(new AppError(result.message, result.statusCode || 500));
        }
        res.status(result?.statusCode || 200).json({
            status: 'success',
            message: result?.message || 'Contraseña restablecida correctamente'
        });
    });
}

module.exports = AuthController;
