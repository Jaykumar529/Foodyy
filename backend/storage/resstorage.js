const multer  = require('multer')
const { cloudinary } = require("./temp");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "res",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

// const resstorage = multer({ storage: resstoragew });
const resstorage = multer({ storage });
module.exports = {
  resstorage,
};


