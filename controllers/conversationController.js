const Conversation = require("./../models/conversationModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getOne = catchAsync(async (req, res, next) => {
  const { sender, receiver } = req.query;
  if (!sender || !receiver)
    return next(new AppError("Sender and Receiver is required"));
  // check those students are chat before
  let conversation = await Conversation.findOne({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  });
  // if not chat before, so there is no conversation id has been created, let create new one
  if (!conversation) {
    conversation = await Conversation.create({ sender, receiver });
  }
  res.status(200).json({ status: "success", data: { conversation } });
});
