const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
const Roll = require("./rollModel");
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    roll: {
      type: Number,
      required: [true, "Roll is required"],
      unique: [true, "This is roll is already taken!"],
    },
    department: {
      type: String,
      required: [true, "Department is required!"],
    },
    batch: {
      type: Number,
      required: [true, "Batch is required!"],
    },
    avatar: {
      url: String,
      public_id: String,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "This email is already taken, please try another"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: 8,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash the password
studentSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// check that the roll is present inside our database
studentSchema.pre("save", async function (next) {
  // Get the roll model here
  const findRoll = await Roll.findOne({ roll: this.roll });
  if (!findRoll) return next(new AppError("This roll does not exist!", 400));
  next();
});
// compare the candidate (23425hfs) password and the hash store password(dsk32csfjs......)
studentSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
module.exports = mongoose.model("Student", studentSchema);
