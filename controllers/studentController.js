const Student = require("./../models/studentModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
const { streamUpload } = require("../services/cloudinary");

// Upload student avatar
exports.uploadAvatar = catchAsync(async (req, res, next) => {
  // if file not proficed go to next middleware
  if (!req?.file) return next();
  // get the  current avatar data
  const { avatar } = req.student;
  const folder = avatar?.public_id ? "" : "avatar";
  const { public_id, secure_url } = await streamUpload(
    req.file,
    folder,
    avatar?.public_id
  );
  /// update the body object with avatar data
  req.body.avatar = {
    public_id,
    url: secure_url,
  };
  next();
});
// Update student profile
exports.update = factory.updateOne(Student);
