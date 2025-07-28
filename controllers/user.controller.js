// src/controllers/user.controller.js
const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');
const BaseController = require('./base.controller');

let _userService = null;

module.exports = class UserController extends BaseController {
  constructor({ UserService }) {
    super(UserService);
    _userService = UserService;
  }

  getAllUsers = catchControllerAsync(async (req, res) => {
    const result = await _userService.getAllUsers();
    return appResponse(res, result);
  });

  getOneUser = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _userService.getOneUser(id);
    return appResponse(res, result);
  });

  createUser = catchControllerAsync(async (req, res) => {
    const body = req.body;
    console.log('BODY RECIBIDO:', body);
    const result = await _userService.createUser(body);
    return appResponse(res, result);
  });

  updateUser = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const result = await _userService.updateUser(id, body);
    return appResponse(res, result);
  });

  deleteUser = catchControllerAsync(async (req, res) => {
    const { id } = req.params;
    const result = await _userService.deleteUser(id);
    return appResponse(res, result);
  });
};
