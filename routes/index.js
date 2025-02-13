var express = require("express");
const app = require("../app");
const User = require("../models/user");
const passport = require("passport");
const upload = require("../utils/multer");
const Post = require("../models/post");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", {
    isAuthenticated: req.isAuthenticated(),
  });
});

router.get("/login", function (req, res, next) {
  res.render("login", {
    isAuthenticated: req.isAuthenticated(),
  });
});

router.get("/register", function (req, res, next) {
  res.render("register", {
    isAuthenticated: req.isAuthenticated(),
  });
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  try {
    // Populate posts without using execPopulate()
    await req.user.populate("posts");

    res.render("profile", {
      user: req.user,
      isAuthenticated: req.isAuthenticated(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching user data");
  }
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

router.get("/add", function (req, res, next) {
  res.render("add", {
    isAuthenticated: req.isAuthenticated(),
  });
});

router.post(
  "/add",
  isLoggedIn,
  upload.single("image"),
  async function (req, res) {
    const { title, image, description } = req.body;
    const user = req.user;
    const post = await Post.create({
      title,
      image: `/images/uploads/${req.file.filename}`,
      description,
      user,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  }
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
