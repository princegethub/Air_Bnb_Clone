if (process.env.NODE_ENV !=  'production') {
  require('dotenv').config()
  
}

const express = require("express");
const ejs = require("ejs");
const path = require("path");
const connectDB = require("./config/mongooseConnection");
const data = require("./init/data");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const session = require("express-session");
const flash = require("connect-flash");
 
const User = require("./model/user-model");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { userInfo } = require("os");

const listingRouter = require("./Router/listing");
const reviewRouter = require("./Router/review");
const userRouter = require("./Router/user");


const app = express();
const port = 3000;


// Middleware setup
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);



const sessionOption = {
  resave: false,
  saveUninitialized: true,
  secret: "myscreat", 
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};





app.use(session(sessionOption));
app.use(flash());

///Paasport and passport-local passport-local-mongoose
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//Flash Message
app.use( (req, res, next)=> {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


// app.get("/demouser", async (req, res)=> {
//   let fakeUser = new User({
//     email: "prince@gmail.com",
//     username: "prince"
//   })

//  let registerdUser= await User.register(fakeUser, "paasword");
//   res.send(registerdUser);
// })





///routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not found"));
});

app.use((err, req, res, next) => {
  let { message = "Something went wrong!", statusCode = 500 } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error", { message });
});


app.listen(port, (err) => {
    if (err) {
        console.error("Server start error: ", err);
    } else {
        console.log(`Server running on port ${port}`);
    }
});
