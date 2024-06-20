const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const AuthMiddleware = require("../middleware/authMiddleware");

//Register
router.post("/register", AuthController.register);

//Login
router.post("/login", AuthController.login);

//Logout
router.post("/logout", AuthController.logout);

//GetUse (access token access closed)
router.get("/:id", AuthMiddleware.adminAuth, AuthController.getUser);

//Update role
router.post("/update", AuthController.update);

module.exports = router;
