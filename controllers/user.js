const  user = require("../Router/user");
const User = require("../model/user-model");

module.exports.renderSignUpForm =  (req, res) => {
  res.render("users/signup");
};

module.exports.signUp= async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registerdUser = await User.register(newUser, password);
    
    req.login(registerdUser, function(err) {

      if (err) { return next(err); }
      req.flash("sucess", "Welocme to WanderLust!")
      return res.redirect('/listings');
    })


  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogInForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = function (req, res) {
  req.flash("success", "Welcome back to WanderLust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";

  res.redirect(redirectUrl);
};

module.exports.logout =  (req, res, next) => {
  
  console.log(req.user);
  req.logout((err) => {
    if (!err) {
      return next(err);
    }
    req.flash("success", "You are logged Out!");
  });
  res.redirect("/listings");
};