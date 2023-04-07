const Comment = require("../models/commentModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.create = factory.createOne(Comment);
exports.getAll = factory.getAll(Comment);
exports.update = factory.updateOne(Comment);
exports.delete = factory.deleteOne(Comment);
