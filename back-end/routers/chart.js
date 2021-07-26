const express = require("express");
const router = express.Router();
const chartController = require('../controllers/chart');
const config = require("config");
const jwt = require("jsonwebtoken");
const multipart = require('connect-multiparty');

const TokenCheckMiddleware = require('../middleware/tokenCheckMiddleware.js');

const multipartMiddleware = multipart();

router.get("/test", async (req, res) => {
    res.send([req.headers]);
});

router.post("/add_client", TokenCheckMiddleware, chartController.add_client);

router.get("/get_states", TokenCheckMiddleware, chartController.get_states);

router.get("/get_clients/:mls_id", TokenCheckMiddleware, chartController.get_clients);

router.post("/get_clients_new", TokenCheckMiddleware, chartController.get_clients_new);

router.get("/get_client/:id", TokenCheckMiddleware, chartController.get_client);

router.post("/edit_client", TokenCheckMiddleware, chartController.edit_client);

router.post("/delete_client", TokenCheckMiddleware, chartController.delete_client);

router.post("/add_property", TokenCheckMiddleware, chartController.add_property);

router.post("/edit_property", TokenCheckMiddleware, chartController.edit_property);

router.get("/get_properties/:mls_id", TokenCheckMiddleware, chartController.get_properties);

router.get("/get_properties_client/:clientId", TokenCheckMiddleware, chartController.get_properties_client);

router.post("/get_properties_new", TokenCheckMiddleware, chartController.get_properties_new);

router.post("/get_chart_details", chartController.get_chart_details);

router.post("/get_chart_details_only", chartController.get_chart_details_only);

router.post("/get_chart_details_investment", chartController.get_chart_details_investment);

router.get("/get_charts/:mls_id", TokenCheckMiddleware, chartController.get_charts);

router.post("/delete_chart_item", TokenCheckMiddleware, chartController.delete_chart_item);

router.get("/get_property/:id", TokenCheckMiddleware, chartController.get_property);

router.post("/delete_property", TokenCheckMiddleware, chartController.delete_property);

router.post("/generate_token", TokenCheckMiddleware, chartController.generate_token);

router.post("/get_api_type", TokenCheckMiddleware, chartController.get_api_type);

router.post("/add_chart", TokenCheckMiddleware, chartController.add_chart);

router.post("/find_mls_image", TokenCheckMiddleware, chartController.find_mls_image);

router.post("/add_chart_response", TokenCheckMiddleware, chartController.add_chart_response);

router.post("/add_chart_response_investment", TokenCheckMiddleware, chartController.add_chart_response_investment);

router.post("/add_chart_response_investment_check", TokenCheckMiddleware, chartController.add_chart_response_investment_check);

router.post("/add_chart_response_investment_check_rental", TokenCheckMiddleware, chartController.add_chart_response_investment_check_rental);

router.post("/add_chart_spark", TokenCheckMiddleware, chartController.add_chart_spark);

router.post("/edit_chart_response", TokenCheckMiddleware, chartController.edit_chart_response);

router.post("/save_chart_db", TokenCheckMiddleware, chartController.save_chart_db);

router.post("/save_unknownstatus", TokenCheckMiddleware, chartController.save_unknownstatus);

router.post("/get_mls_details", TokenCheckMiddleware, chartController.get_mls_details);

router.post("/send_email", TokenCheckMiddleware, chartController.send_email);

router.post("/share_popup_submit", TokenCheckMiddleware, chartController.share_popup_submit);

router.post("/properties_import", TokenCheckMiddleware, multipartMiddleware, chartController.properties_import);

router.post("/properties_import_zip", TokenCheckMiddleware, multipartMiddleware, chartController.properties_import_zip);

router.get("/getTempData/:id", TokenCheckMiddleware, chartController.getTempData);

router.post("/omp_properties_import", TokenCheckMiddleware, multipartMiddleware, chartController.omp_properties_import);


module.exports = router;
