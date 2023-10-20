const express = require("express");
const {
  signup,
  signin,
  getUser,
  logout,
  generateReferralLink,
} = require("../controller/authController");
const jwtAuth = require("../middleware/jwtAuth.js");
const authRouter = express.Router();
authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/user", jwtAuth, getUser);
authRouter.post("/refer", jwtAuth, generateReferralLink);
// authRouter.get("/earn", jwtAuth, updateReferralEarnings);
authRouter.get("/logout", jwtAuth, logout);
module.exports = authRouter;
