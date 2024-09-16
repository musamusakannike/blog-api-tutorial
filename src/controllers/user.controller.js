const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const User = require("../models/user.model");

// Register new user route
const registerNewUser = async function (req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(404)
      .json({ status: false, message: "Please provide all required fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword });
    user.save();
    res
      .status(201)
      .json({ status: true, message: "New user created successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
    console.error(error);
  }
};

const loginUser = async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ status: false, message: "Please provide all required fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ status: false, message: "Invalid Credentials!" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Invalid Credentials!" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie("token", token, { expiresIn: '1h', httpOnly: true });
    res
     .status(200)
     .json({ status: true, message: "Login successful" });

  } catch (err) {
    res.status(500).json({ status: false, message: "Internal Server Error" });
    console.error(err);
  }
};

module.exports = { registerNewUser, loginUser };
