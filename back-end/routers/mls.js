const express = require("express");
const router = express.Router();
const MlsController = require('../controllers/mls');
const config = require("config");
const jwt = require("jsonwebtoken");

const TokenCheckMiddleware = require('../middleware/tokenCheckMiddleware.js');



router.get("/get_mlses", TokenCheckMiddleware, MlsController.get_mlses);

router.get("/get_mlses_non_login", MlsController.get_mlses_non_login);

router.post("/request_mls", TokenCheckMiddleware, MlsController.request_mls);

router.get("/import_subdivisions", TokenCheckMiddleware, MlsController.import_subdivisions);

router.get("/import_zipcodes", TokenCheckMiddleware, MlsController.import_zipcodes);

router.post("/get_subdivisions", TokenCheckMiddleware, MlsController.get_subdivisions);

router.post("/get_zipcodes", TokenCheckMiddleware, MlsController.get_zipcodes);

module.exports = router;
