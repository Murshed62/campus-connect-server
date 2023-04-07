const Like = require("./../models/likeModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.toggleLike = catchAsync(async (req, res, next) => {
  const { postId, studentId } = req.body;
  let like = await Like.findOne({ post: postId, student: studentId });
  if (!like) {
    await Like.create({ student: studentId, post: postId });
  } else {
    await Like.findByIdAndDelete(like._id);
  }
  await Like.calCount(postId);
  res.status(200).json({ status: "success" });
});

// get all the likes in a post
exports.getAll = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(
    Like.find(filter).populate(
      "student",
      "name email avatar department batch roll"
    ),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc,
    },
  });
});
