const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Sender is required"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Receiver is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
