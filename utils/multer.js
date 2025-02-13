const multer = require("multer");
const uuid = require("uuid").v4;
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuid();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
