const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');

router.post("/login", authController.login);

router.post("/sociallogin", authController.sociallogin);

router.post("/agree", authController.agree);

router.post("/toaAgree", authController.toaAgree);

router.post("/eulaAgree", authController.eulaAgree);

router.post("/verifytoken", authController.verifytoken);

router.post("/forgot-password", authController.forgotpassword);

router.post("/reset-password", authController.reset_password);

router.get("/get-exchange-price", authController.get_exchange_price);

module.exports = router;
