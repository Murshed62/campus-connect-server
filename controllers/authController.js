const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Student = require("./../models/studentModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (student, statusCode, req, res) => {
  const token = signToken(student._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  student.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      student,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newStudent = await Student.create({
    roll: req.body.roll,
    name: req.body.name,
    department: req.body.department,
    batch: req.body.batch,
    email: req.body.email,
    password: req.body.password,
  });

  createSendToken(newStudent, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { roll, password } = req.body;

  // 1) Check if roll and password exist
  if (!roll || !password) {
    return next(new AppError("Please provide roll and password!", 400));
  }
  // 2) Check if student exists && password is correct
  const student = await Student.findOne({ roll }).select("+password");

  if (
    !student ||
    !(await student.correctPassword(password, student.password))
  ) {
    return next(new AppError("Incorrect roll number or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(student, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req?.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentStudent = await Student.findById(decoded.id);
  if (!currentStudent) {
    return next(
      new AppError(
        "The student belonging to this token does no longer exist.",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.student = currentStudent;
  res.locals.student = currentStudent;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentStudent = await Student.findById(decoded.id);
      if (!currentStudent) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentStudent.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.student = currentStudent;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.student.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const student = await Student.findById(req.student.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (
    !(await student.correctPassword(req.body.passwordCurrent, student.password))
  ) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  student.password = req.body.password;
  await student.save();

  // 4) Log student in, send JWT
  createSendToken(student, 200, req, res);
});
