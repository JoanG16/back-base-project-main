const catchServiceAsync = require('../utils/catch-service-async');
const BaseService = require('./base.service');

let _example = null;
let _exampleFunction = null;

module.exports = class ExampleService extends BaseService {
  constructor({ Example, ExampleFunction }) {
    super(Example);
    _exampleFunction = ExampleFunction;
  }

  hello = catchServiceAsync(async () => {
    const result = await _exampleFunction.handleExampleFunction();
    return { data: result };
  });

  createWithValidator = catchServiceAsync(async (data) => {
    const result = await _example.create(data);
    return { data: result };
  });
};
