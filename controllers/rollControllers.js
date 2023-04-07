const Roll = require("../models/rollModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.create = catchAsync(async (req, res, next) => {
  const { rolls } = req.body;
  const newRolls = await Roll.insertMany(rolls.map((roll) => ({ roll })));
  res.status(201).json({
    status: "success",
    data: {
      newRolls,
    },
  });
});
