const express = require("express");
const router = express.Router();
const cronController = require('../controllers/cron');

router.get("/refresh-exchange-price", cronController.refresh_exchange_price);

//router.get("/get-exchange-price", authController.get_exchange_price);

module.exports = router;
