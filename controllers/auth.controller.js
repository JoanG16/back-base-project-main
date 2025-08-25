// src/controllers/auth.controller.js
const catchAsync = require('../utils/catch-controller-async');
const {
    forgotPasswordService,
    resetPasswordService
} = require('../services/auth.service');
const AppError = require('../utils/app-error');

class AuthController {
    // Solución para el error 'Invalid status code: undefined'
    forgotPassword = catchAsync(async (req, res, next) => {
        const {
            email
        } = req.body;
        const result = await forgotPasswordService(email);
        if (result.error) {
            // Aseguramos que el código de estado sea un número válido.
            return next(new AppError(result.message, result.statusCode || 500));
        }
        // Aseguramos que el código de estado sea un número válido.
        res.status(result.statusCode || 200).json({
            status: 'success',
            message: result.message
        });
    });

    // Solución para el error 'Invalid status code: undefined'
    resetPassword = catchAsync(async (req, res, next) => {
        const {
            token
        } = req.params;
        const {
            password,
            passwordConfirm
        } = req.body;
        const result = await resetPasswordService(token, password, passwordConfirm);
        if (result.error) {
            // Aseguramos que el código de estado sea un número válido.
            return next(new AppError(result.message, result.statusCode || 500));
        }
        // Aseguramos que el código de estado sea un número válido.
        res.status(result.statusCode || 200).json({
            status: 'success',
            message: result.message
        });
    });
}

// --- Corrección para 'catch-controller-async.js' ---

// Solución para el error 'next is not a function'
// La función debe devolver una función que reciba (req, res, next).
// De esta manera, el 'next' de Express se propaga correctamente.
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
};

module.exports = catchAsync;
