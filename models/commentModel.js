const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
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
    comment: {
      type: String,
      required: [true, "comment is required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
commentSchema.pre(/^find/, function (next) {
  this.populate("student", "name email avatar batch department");
  next();
});
module.exports = mongoose.model("Comment", commentSchema);
