const dotenv = require("dotenv");
dotenv.config();
const DB = require("./config/db");
const { server } = require("./sockets");

const PORT = process.env.PORT;

// connect DB then start our app
DB(() => {
  server.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
});
