const userModel = require("../model/userSchema.js");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const signup = async (req, res, next) => {
  const { name, phone, email, password, confirmPassword, referralLink } =
    req.body;

  if (!name || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  async function generateUniqueUserID(name) {
    let userID = "";
    let nameArray = name.split(" ");

    for (let i = 0; i < nameArray.length; i++) {
      let char = nameArray[i].charAt(0) + nameArray[i].charAt(1);
      // userID += char.toUpperCase();
    }

    let originalUserID = userID;
    let count = 1;

    while (true) {
      const existingUser = await userModel.findOne({ userID });

      if (!existingUser) {
        break;
      }

      count++;
      userID = `${originalUserID}-${count}`;
    }

    return userID;
  }

  const validEmail = emailValidator.validate(email);

  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "An account already exists with the provided email address",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and Confirm Password don't match",
    });
  }

  const userID = await generateUniqueUserID(name);

  try {
    let referralLinkValue, referredBy, earnings;
    const referrer = req.body.referralLink;
    // Create a new ObjectId

    if (referrer) {
      const referralUser = await userModel.findOne({ referralLink: referrer });

      if (referralUser) {
        referralLinkValue = uuid.v4();
        referredBy = referralUser.userID;
        earnings = 0;
      } else {
        referralLinkValue = uuid.v4();
        referredBy = 0;
        earnings = 0;
      }
    } else {
      referralLinkValue = uuid.v4();
      referredBy = 0;
      earnings = 0;
    }

    const userInfo = new userModel({
      name,
      phone,
      email,
      password,
      userID,
      earnings,
      referralLink: referralLinkValue,
      referredBy,
    });
    const result = await userInfo.save();
    if (result && referredBy) {
      console.log(referredBy);
      const ref = await userModel.findOne({ userID: referredBy });
      // console.log("Up: ", ref.earnings);
      const test = ref ? ref.earnings + 10 : ref.earnings;
      const updateEarning = await userModel.updateMany(
        { userID: referredBy },
        {
          $set: {
            earnings: test,
          },
        }
      );
      console.log("Update Earning: ", updateEarning);
      return res.status(200).send({
        success: true,
        data: result._doc,
      });
    }
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account already exists with the provided email address",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.jwtToken();
    user.password = undefined;

    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const getUser = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const logout = (req, res, next) => {
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true,
    };
    res.cookie("token", null, cookieOption);
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const generateReferralLink = async (req, res) => {
  const userId = req.user._id;
  const { friendEmail } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const referralCode = uuid.v4();

    const friendUser = await userModel.findOne({ email: friendEmail });

    if (!friendUser) {
      return res.status(400).json({
        success: false,
        message: "Friend user not found",
      });
    }

    // Update the friend's referral information
    await userModel.updateOne(
      { email: friendEmail },
      {
        $set: {
          referralLink: referralCode,
          referredBy: userId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Referral link generated and shared",
      referralCode,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  signup,
  signin,
  getUser,
  logout,
  generateReferralLink,
};
