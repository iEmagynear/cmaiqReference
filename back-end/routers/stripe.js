const express = require("express");
const router = express.Router();
const stripeController = require('../controllers/stripe');
const config = require("config");
const jwt = require("jsonwebtoken");

const TokenCheckMiddleware = require('../middleware/tokenCheckMiddleware.js');

router.post("/charge",TokenCheckMiddleware, stripeController.charge);

router.get("/retrieve_plan/:plan",TokenCheckMiddleware, stripeController.retrieve_plan);

router.post("/create_customer",TokenCheckMiddleware, stripeController.create_customer);

router.post("/get_subscriptions",TokenCheckMiddleware, stripeController.get_subscriptions);

router.post("/get_subscriptions_admin",TokenCheckMiddleware, stripeController.get_subscriptions_admin);

router.get("/un_subscribe/:sub_id",TokenCheckMiddleware, stripeController.un_subscribe);

router.get("/un_subscribe_offline/:mls_id",TokenCheckMiddleware, stripeController.un_subscribe_offline);

router.get("/get_user_all_subscriptions",TokenCheckMiddleware, stripeController.get_user_all_subscriptions);

router.post("/update_payment_details",TokenCheckMiddleware, stripeController.update_payment_details);

router.get("/get_sub_payment/:sub_id",TokenCheckMiddleware, stripeController.get_sub_payment);

module.exports = router;
