const mongoose = require("mongoose");

module.exports = (cb) => {
  const DB = process.env.MONGO_URI.replace(
    "<password>",
    process.env.MONGO_URI_PASS
  );
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("DB is connected!");
      cb();
    })
    .catch((err) => {
      console.log(err);
    });
};
