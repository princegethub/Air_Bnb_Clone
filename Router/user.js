const express = require("express");
const router = express.Router();
const User = require("../model/user-model");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoogedIn , saveRedirectUrl , isOwner } = require("../middleware");
const userController = require("../controllers/user");
const { route } = require("./listing");


router.route("/signup")
.get(userController.renderSignUpForm)
.post(
  
  wrapAsync(userController.signUp)
)

router.route("/login")
.get( userController.renderLogInForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout",userController.logout);

module.exports = router;
