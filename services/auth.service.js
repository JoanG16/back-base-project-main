// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const catchServiceAsync = require('../utils/catch-controller-async');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let _userModel = null;

// Función auxiliar unificada para hashear contraseñas.
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error al hashear la contraseña.');
  }
};

// Función auxiliar para verificar si una cadena es un hash de bcrypt
const isBcryptHash = (str) => {
  return /^\$2[aby]\$\d{2}\$[./0-9A-Za-z]{53}$/.test(str);
};

module.exports = class AuthService {
  constructor({ UserModel }) {
    _userModel = UserModel;
  }

  /**
   * Endpoint para registrar un nuevo usuario.
   */
  registerUser = catchServiceAsync(async ({ username, password, role }) => {
    // La encriptación se maneja en los hooks del modelo, pero este paso es una buena práctica
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
   * CORREGIDO: Se unifica la validación para evitar ataques de enumeración de usuarios.
   */
  loginUser = catchServiceAsync(async (username, password) => {
    // Buscar al usuario por nombre de usuario
    const user = await _userModel.findOne({ where: { username } });

    // Si el usuario no existe o la contraseña no coincide, lanzamos un único error genérico.
    // Esto es una buena práctica de seguridad.
    let passwordMatch = false;
    if (user) {
      // Limpia la contraseña de entrada de espacios en blanco
      const cleanPassword = password.trim();
     
      // 2. Verificar si el usuario existe y si la contraseña es correcta
      if (user.password && isBcryptHash(user.password)) {
        passwordMatch = await bcrypt.compare(cleanPassword, user.password);
      } else if (user.password) {
        // Caso de retrocompatibilidad: si la contraseña no está hasheada
        // Se compara en texto plano y se actualiza a un hash para el futuro
        passwordMatch = cleanPassword === user.password;
        if (passwordMatch) {
          const hashedPassword = await hashPassword(cleanPassword);
          await user.update({ password: hashedPassword });
        }
      }
    }

    if (!passwordMatch) {
      throw new Error('Error de autenticación');
    }

    // Generar y firmar un token JWT
    const token = jwt.sign({ id: user.id_user, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Devolver la información del usuario y el token
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
   * CORREGIDO: Se elimina el 'return' silencioso. El flujo continúa si el usuario no existe.
   */
  forgotPassword = catchServiceAsync(async (email) => {
    const user = await _userModel.findOne({ where: { email } });
    // La lógica del envío del correo solo se ejecuta si el usuario existe.
    // Si no existe, la función no hace nada y termina, lo cual es seguro.
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
          <a href="${FRONTEND_URL}/browser/reset-password/token/${resetToken}">Restablecer Contraseña</a>
          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste esto, ignora este correo.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    // Retorna un valor explícito (null o un objeto vacío) para evitar que la función
    // retorne undefined, lo que provoca el error en el controlador.
    return null;
  });

  /**
   * Restablece la contraseña del usuario.
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

  const hashedPassword = await hashPassword(newPassword);

  await user.update({
    password: hashedPassword,
    reset_password_token: null,
    reset_password_expires: null,
  });

  return { message: 'Contraseña restablecida correctamente' };
});
};
