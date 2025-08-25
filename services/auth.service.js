// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
   * Inicia el proceso de recuperación de contraseña.
   * 1. Busca el usuario por email.
   * 2. Genera un token y lo guarda en la BD.
   * 3. Envía un email con el enlace de recuperación.
   */
  forgotPassword = catchServiceAsync(async (email) => {
    // 1. Buscar al usuario por email
    const user = await _userModel.findOne({ where: { email } });

    // Si el usuario no existe, no hacemos nada (por seguridad), pero respondemos como si sí.
    if (!user) {
      return;
    }

    // 2. Generar el token y la fecha de expiración
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora de validez

    // 3. Guardar el token y la expiración en la base de datos
    await user.update({
      reset_password_token: resetToken,
      reset_password_expires: resetExpires,
    });

    // 4. Configurar Nodemailer para enviar el email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Puedes cambiarlo por otro proveedor (ej. SendGrid)
      auth: {
        user: EMAIL_USER, // Variable de entorno para el email
        pass: EMAIL_PASS, // Variable de entorno para la contraseña
      },
    });

    // 5. Enviar el correo electrónico con el enlace
    const mailOptions = {
      from: EMAIL_USER,
      to: user.email,
      subject: 'Recuperación de contraseña',
      html: `
        <h2>Recuperación de Contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${FRONTEND_URL}/browser/reset-password/token/${resetToken}">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste esto, ignora este correo.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  });

  /**
   * Restablece la contraseña del usuario.
   * 1. Busca el usuario por el token y verifica que no haya expirado.
   * 2. Hashea la nueva contraseña y la guarda en la BD.
   * 3. Invalida el token para que no se pueda volver a usar.
   */
  resetPassword = catchServiceAsync(async (token, newPassword) => {
    // CORRECCIÓN: Agregar validación para newPassword
    if (!newPassword || typeof newPassword !== 'string') {
      throw new Error('La contraseña no es válida o faltante.');
    }

    // 1. Buscar el usuario por token y validar expiración
    const user = await _userModel.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [require('sequelize').Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new Error('Token inválido o expirado.');
    }

    // 2. Hashear la nueva contraseña y actualizar el usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await user.update({
      password: hashedPassword,
      reset_password_token: null, // 3. Invalida el token
      reset_password_expires: null,
    });
  });
};
