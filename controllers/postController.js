const Post = require("../models/postModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const { streamUpload, removeFile } = require("../services/cloudinary");



const uploadImages = async (files) => {
  const images = [];
  for (let i = 0; i < files?.length; i++) {
    const { public_id, secure_url } = await streamUpload(
      files[i],
      "post_images"
    );
    images.push({ public_id, url: secure_url });
  }
  return images;
};

exports.create = catchAsync(async (req, res, next) => {
  // set the department from the login user
  req.body.dept = req.student.department;
  // check if there is  images to upload
  let images = [];
  if (req?.files?.length) {
    console.log(req?.files?.length);
    images = await uploadImages(req.files);
    req.body.images = images;
  }

  try {
    const newPost = await Post.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.log(error);
    const publicIds = images.map((img) => img.public_id);
    await removeFile(publicIds);
    return next(error);
  }
});
exports.removeImage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { public_id } = req.body;
  // update the post
  const post = await Post.findByIdAndUpdate(
    id,
    {
      $pull: { images: { public_id } },
    },
    { new: true, runValidators: true }
  );
  // remove the file from the cloudinary
  await removeFile([public_id]);
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});
exports.getAll = factory.getAll(Post);
exports.getOne = factory.getOne(Post);
exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // find post
  let post = await Post.findById(id);
  // check if there is  images to upload
  let images = [];
  if (req?.files?.length) {
    images = await uploadImages(req.files);
    req.body.images = [...post?.images, ...images];
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    const publicIds = images.map((img) => img.public_id);
    await removeFile(publicIds);
    return next(error);
  }
});
exports.delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // find post
  let post = await Post.findById(id);
  if (!post) return next(new AppError("Post does not exist!", 400));
  const publicIds = post.images.map((img) => img.public_id);
  await removeFile(publicIds);
  await Post.findByIdAndDelete(id);
  res.status(204).json({ status: "success", data: null });
});
