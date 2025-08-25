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

// Función auxiliar unificada para hashear contraseñas.
// Asegura que todas las contraseñas se hashean de la misma manera.
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    // Si hay un error, lo lanzamos para que se capture
    throw new Error('Error al hashear la contraseña.');
  }
};

module.exports = class AuthService {
  constructor({ UserModel }) {
    _userModel = UserModel;
  }

  /**
   * Endpoint para registrar un nuevo usuario.
   * Utiliza la función auxiliar para hashear la contraseña.
   */
  registerUser = catchServiceAsync(async ({ username, password, role }) => {
    const hashedPassword = await hashPassword(password);
    const result = await _userModel.create({
      username,
      password: hashedPassword,
      role,
    });
    return { data: result };
  });

  /**
   * Intenta iniciar sesión y devuelve los datos del usuario si las credenciales son correctas.
   */
  loginUser = catchServiceAsync(async (username, password) => {
    const user = await _userModel.findOne({ where: { username } });

    // La comparación ahora es más robusta ya que sabemos que la contraseña se hasheó correctamente
    // en ambos casos (registro y restablecimiento).
    const passwordMatch = user && await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Error de autenticación');
    }

    const token = jwt.sign({ id: user.id_user, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const userWithoutPassword = {
      id_user: user.id_user,
      username: user.username,
      role: user.role,
      id_local: user.id_local,
    };

    return {
      data: {
        token,
        user: userWithoutPassword,
      },
    };
  });

  /**
   * Inicia el proceso de recuperación de contraseña.
   */
  forgotPassword = catchServiceAsync(async (email) => {
    const user = await _userModel.findOne({ where: { email } });
    if (!user) return;

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
        <a href="${FRONTEND_URL}/browser/reset-password/token/${resetToken}">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste esto, ignora este correo.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  });

  /**
   * Restablece la contraseña del usuario.
   * Utiliza la misma función auxiliar para hashear la nueva contraseña.
   */
  resetPassword = catchServiceAsync(async (token, newPassword) => {
    if (!newPassword || typeof newPassword !== 'string') {
      throw new Error('La contraseña no es válida o faltante.');
    }

    const user = await _userModel.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [require('sequelize').Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new Error('Token inválido o expirado.');
    }

    // Hasheamos la nueva contraseña antes de guardarla.
    const hashedPassword = await hashPassword(newPassword);

    await user.update({
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expires: null,
    });
  });
};
