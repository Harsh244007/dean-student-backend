const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");
const ErrorBody = require("../helper/ErrorMessages");
const bcrypt = require("bcrypt");
const Session = require("../models/Session");

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email && !password && !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required fields." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email, role });

    if (!user) {
      return res.sendStatus(401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.sendStatus(402);
    }

    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET
    );
    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email && !password && !name && !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required fields." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, name, role });
    await newUser.save();

    const accessToken = jwt.sign(
      { email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET
    );

    return res.json({ accessToken: accessToken });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const email = req.user.email;

    const userInfo = await User.findOne({ email: email });
    if (userInfo) {
      const response = {
        email: userInfo.email,
        name: userInfo.name,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
        role: userInfo.role,
      };
      if (userInfo.role === "student"){

        var studentSession = await User.findOne({ email: email })
        .populate({path:"bookedSessions",populate:{path:"dean",select:"name"}})
        .lean()
        .exec();
        response.studentSessions = studentSession.bookedSessions;
      }
      else if (userInfo.role === "dean") {
        response.deanId = userInfo._id;
        var deanSessions = await User.findOne({ email: email })
        .populate({path:"bookedSessions",populate:{path:"students",select:"name email _id"}})
        .lean()
        .exec();
        response.studentSessions = deanSessions.bookedSessions;
      }

      return res.json(response);
    }
    return res.sendStatus(404);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
