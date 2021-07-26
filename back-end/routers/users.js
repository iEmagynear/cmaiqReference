const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');

router.post("/signup", userController.signup);

router.post("/contact-us", userController.contactus);

router.get("/ticker", userController.ticker);

module.exports = router;
