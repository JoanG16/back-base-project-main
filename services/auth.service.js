const BaseService = require('./base.service');
const catchServiceAsync = require('../utils/catch-service-async');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/app-error');

let _user = null;
let _authUtils = null;
let _authFunction = null;

module.exports = class AuthService extends BaseService {
  constructor({ User, AuthUtils }) {
    super(User);
    _user = User;
    _authUtils = AuthUtils;
  }

  login = catchServiceAsync(async (username, password) => {
    const user = await _user.findOne({ username });
    if (!user) {
      throw new AppError('Usuario o contraseña incorrectos', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Usuario o contraseña incorrectos', 401);
    }

    const token = _authUtils.generateToken(user._id);

    return {
      data: {
        _id: user._id,
        username: user.username,
        token,
      },
    };
  });

  register = catchServiceAsync(async (userData) => {
    const existingUser = await _user.findOne({
      username: userData.username,
    });

    if (existingUser) {
      throw new AppError('Usuario ya existe', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = await _user.create({
      ...userData,
      password: hashedPassword,
    });

    return {
      id: user._id,
      username: user.username,
    };
  });

  logout = catchServiceAsync(async () => {
    return { message: 'Sesión cerrada exitosamente' };
  });
};
