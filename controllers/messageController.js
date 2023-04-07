const Message = require("../models/messageModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.create = factory.createOne(Message);
exports.getAll = factory.getAll(Message);
exports.update = factory.updateOne(Message);
exports.delete = factory.deleteOne(Message);
