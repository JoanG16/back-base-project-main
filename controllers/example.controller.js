/* const catchControllerAsync = require('../utils/catch-controller-async');
const { appResponse } = require('../utils/app-response');
const BaseController = require('./base.controller');

let _exampleService = null;

module.exports = class ExampleController extends BaseController {
  constructor({ ExampleService }) {
    super(ExampleService);
    _exampleService = ExampleService;
  }

  hello = catchControllerAsync(async (req, res) => {
    const result = await _exampleService.hello();
    return appResponse(res, result);
  });

  createWithValidator = catchControllerAsync(async (req, res) => {
    const result = await _exampleService.create(req.body);
    return appResponse(res, result);
  });
}; */
