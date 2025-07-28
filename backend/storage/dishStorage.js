const multer  = require('multer')
const { cloudinary } = require("./temp");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Dish",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

// const resstorage = multer({ storage: resstoragew });
const dishStorage = multer({ storage });
module.exports = {
  dishStorage,
};


