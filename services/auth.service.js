// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

const catchServiceAsync = require('../utils/catch-service-async');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let _userModel = null;

module.exports = class AuthService {
  constructor({ UserModel }) {
    _userModel = UserModel;
  }

  /**
   * Registrar un nuevo usuario
   */
  register = catchServiceAsync(async ({ username, email, password, role }) => {
    const existing = await _userModel.findOne({ where: { email } });
    if (existing) {
      throw new Error('Ya existe un usuario con este correo');
    }

    const newUser = await _userModel.create({
      username,
      email,
      password, // Sequelize hook debe encriptar
      role,
    });

    return { data: newUser };
  });

  /**
   * Login de usuario (email + password)
   */
  login = catchServiceAsync(async (username, password) => {
    const user = await _userModel.findOne({ where: { username } });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const userWithoutPassword = {
      id_user: user.id_user,
      username: user.username,
      email: user.email,
      role: user.role,
      id_local: user.id_local,
    };

    return {
      token,
      user: userWithoutPassword,
    };
  });

  /**
   * Forgot password
   */
  forgotPassword = catchServiceAsync(async (email) => {
    const user = await _userModel.findOne({ where: { email } });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000);

      await user.update({
        reset_password_token: resetToken,
        reset_password_expires: resetExpires,
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: EMAIL_USER,
        to: user.email,
        subject: 'Recuperación de contraseña',
        html: `
          <h2>Recuperación de Contraseña</h2>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
          <a href="${FRONTEND_URL}/browser/reset-password/token/${resetToken}">
            Restablecer Contraseña
          </a>
          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste esto, ignora este correo.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return { message: 'Si existe el correo, se envió un link de recuperación' };
  });

  /**
   * Reset password
   */
  resetPassword = catchServiceAsync(async (token, newPassword) => {
    if (!newPassword || typeof newPassword !== 'string') {
      throw new Error('La contraseña no es válida o faltante.');
    }

    const user = await _userModel.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new Error('Token inválido o expirado.');
    }

    await user.update({
      password: newPassword, // Sequelize hook debe encriptar
      reset_password_token: null,
      reset_password_expires: null,
    });

    return { message: 'Contraseña restablecida correctamente' };
  });
};
