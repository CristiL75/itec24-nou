const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/users")
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((e) => {
    console.log("failed");
  });

const logInSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const LogInCollection = mongoose.model("users", logInSchema);
module.exports = {
    LogInCollection,
  };
  