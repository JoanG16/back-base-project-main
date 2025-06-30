/* const { appResponse } = require('../utils/app-response');
const catchControllerAsync = require('../utils/catch-controller-async');
const BaseController = require('./base.controller');

let _authService = null;
module.exports = class AuthController extends BaseController {
  constructor({ AuthService }) {
    super(AuthService);
    _authService = AuthService;
  }

  register = catchControllerAsync(async (req, res) => {
    const { body } = req;
    const result = await _authService.register(body);
    return appResponse(res, result);
  });

  login = catchControllerAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await _authService.login(username, password);
    return appResponse(res, result);
  });

  logout = catchControllerAsync(async (req, res) => {
    const result = await _authService.logout();
    return appResponse(res, result);
  });
};
 */