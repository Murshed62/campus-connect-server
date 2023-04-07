const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

exports.uploadFile = async (path, folder, public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id,
        folder,
        overwrite: true,
      },
      function (error, result) {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};
exports.streamUpload = (file, folder, public_id) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id, folder, overwrite: true },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

exports.removeFile = async (publicIds) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources([...publicIds], function (err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
