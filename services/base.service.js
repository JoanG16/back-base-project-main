const AppError = require('../utils/app-error');
const catchServiceAsync = require('../utils/catch-service-async');
const { getPaginationOptions } = require('../utils/handle-pagination');
module.exports = class BaseService {
  constructor(model) {
    this.model = model;
  }

  getOne = catchServiceAsync(async (id) => {
    if (!id) {
      throw new AppError('Id must be sent', 400);
    }
    const currentEntity = await this.model.findById(id);
    if (!currentEntity) {
      throw new AppError('Entity does not found', 404);
    }
    return { data: currentEntity };
  });

  getAll = catchServiceAsync(async (limit = 10, pageNum = 1) => {
    const { parsedLimit, skip } = getPaginationOptions(pageNum, limit);
    const totalCount = await this.model.countDocuments();
    const result = await this.model.find().lean().skip(skip).limit(parsedLimit);
    return { data: { result, totalCount } };
  });

  create = catchServiceAsync(async (entity) => {
    const result = await this.model.create(entity);
    return { data: result };
  });

  update = catchServiceAsync(async (id, entity) => {
    if (!id) {
      throw new AppError('Id must be sent', 400);
    }
    const result = await this.model.findByIdAndUpdate(id, entity, {
      new: true,
    });
    return { data: result };
  });

  delete = catchServiceAsync(async (id) => {
    if (!id) {
      throw new AppError('Id must be sent', 400);
    }
    const deletedEntity = await this.model.findByIdAndDelete(id);
    if (!deletedEntity) {
      throw new AppError('Entity does not found', 404);
    }
    return { data: deletedEntity };
  });
};
