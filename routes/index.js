var express = require("express");
const app = require("../app");
const User = require("../models/user");
const passport = require("passport");
const upload = require("../utils/multer");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

router.get("/profile", isLoggedIn, function (req, res, next) {
  console.log(req.user);
  res.render("profile", { user: req.user });
});

router.post("/register", function (req, res) {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email });

  User.register(newUser, password)
    .then((user) => {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/register");
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});

router.post(
  "/fileupload",
  isLoggedIn,
  upload.single("profilePicture"),
  function (req, res) {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).send("No file uploaded");
    }

    console.log("File uploaded:", req.file);

    User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: `/images/uploads/${req.file.filename}` },
      { new: true } 
    )
      .then((updatedUser) => {
        console.log("User updated:", updatedUser);
        res.redirect("/profile");
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        res.status(500).send("Error updating profile picture");
      });
  }
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
