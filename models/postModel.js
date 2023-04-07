const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
    },
    dept: String,
    tags: [String],
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("liked", {
  ref: "Like",
  foreignField: "post",
  localField: "_id",
});
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

postSchema.pre(/^find/, function (next) {
  this.populate("student", "name email avatar")
    .populate("liked", "student -post")
    .populate("comments", null, null, { limit: 5 });
  next();
});
postSchema.post("findOneAndDelete", async function (doc) {
  const postId = doc._id.toString();
  const Like = mongoose.connection.models["Like"];
  await Like.deleteMany({ post: postId });
});
module.exports = mongoose.model("Post", postSchema);
