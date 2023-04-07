const path = require("path");
const express = require("express");
const cors = require("cors");
const AppError = require("./utils/appError");
//logger
const morgan = require("morgan");
// import routes
const studentRoutes = require("./routes/studentRoutes");
const rollRoutes = require("./routes/rollRoutes");
const postRoutes = require("./routes/postRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");
// Global error controller
const globalErrorHandler = require("./controllers/errorController");
const app = express();

// set engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// static files
app.set(express.static(path.join(__dirname, "public")));
// json encoder
app.use(express.json());

//implement cors
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}
//use routes
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/rolls", rollRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/messages", messageRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// controlle error globally
app.use(globalErrorHandler);

module.exports = app;
