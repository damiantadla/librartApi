const express = require("express");
const router = express.Router();
const ProjectsController = require("../controllers/libraryController");
const AuthMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upewnij się, że katalog istnieje
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split("/");
    const ext = extArray[extArray.length - 1];
    cb(null, Date.now().toString() + "." + ext);
  },
});

const fileFilter = function (req, file, cb) {
  // Accepted file extensions
  const allowedExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".webm",
    ".svg",
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware for logging fields and files
const logMiddleware = (req, res, next) => {
  console.log("Fields:", req.body);
  console.log("Files:", req.files);
  next();
};

// Test upload route
router.post(
    "/test-upload",
    upload.fields([{ name: "image", maxCount: 1 }]),
    (req, res) => {
      console.log("Fields:", req.body);
      console.log("Files:", req.files);
      res.status(200).json({ message: "Upload successful" });
    }
);

//Get projects(access admin)
router.post(
    "/new",
    AuthMiddleware.adminAuth,
    logMiddleware,
    upload.fields([{ name: "image", maxCount: 1 }]),
    ProjectsController.newBook,
);

//Update projects(access admin)
router.put(
    "/edit",
    AuthMiddleware.adminAuth,
    logMiddleware,
    upload.fields([{ name: "image", maxCount: 1 }]),
    ProjectsController.updateBook,
);

//Delete projects(access admin)
router.delete(
    "/delete/:id",
    AuthMiddleware.adminAuth,
    ProjectsController.deleteBook,
);

//Get projects(access open)
router.get("/get", ProjectsController.getBooks);

//Get project(access open)
router.get("/get/:id", ProjectsController.getBookID);

module.exports = router;
