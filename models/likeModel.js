const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
  },
  { timestamps: true }
);
likeSchema.index({ student: 1, post: 1 });

likeSchema.statics.calCount = async function (postId) {
  const result = await this.aggregate([
    {
      $match: {
        post: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $group: {
        _id: "$post",
        totalLikes: { $sum: 1 },
      },
    },
  ]);

  const PostModel = mongoose.connection.models["Post"];
  let totalLikes = 0;
  if (result.length) totalLikes = result[0].totalLikes;

  await PostModel.findByIdAndUpdate(postId, { likeCount: totalLikes });
};

module.exports = mongoose.model("Like", likeSchema);
