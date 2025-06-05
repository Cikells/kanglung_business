const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dynamic storage function based on upload type (e.g., 'user' or 'product')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Default to general upload folder
    let folder = 'public/uploads/';

    // Determine folder based on route or request value
    if (req.uploadType === 'product') {
      folder = 'public/uploads/products/';
    } else if (req.uploadType === 'user') {
      folder = 'public/uploads/users/';
    }

    // Create folder if it doesn't exist
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
  fileFilter: fileFilter
});

// Middleware factory to set upload type before using multer
function setUploadType(type) {
  return function (req, res, next) {
    req.uploadType = type;
    next();
  };
}


module.exports = {
  upload,
  setUploadType
};
