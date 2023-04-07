const mongoose = require("mongoose");
const rollSchema = new mongoose.Schema(
  {
    roll: {
      type: Number,
      required: [true, "Roll is required!"],
      unique: [true, "This roll is already present!"],
    },
  },
  { timestamps: true }
);

rollSchema.index({ roll: 1 });

module.exports = mongoose.model("Roll", rollSchema);
