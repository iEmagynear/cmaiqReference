const express = require("express");
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './uploads' });
const adminController = require('../controllers/admin');
const defaultvaluesController = require('../controllers/defaultvalues')
var rclient = require('../redis');
const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user");

const TokenCheckMiddleware = require('../middleware/tokenCheckMiddleware.js');
const TokenCheckMiddlewareSuperAdmin = require('../middleware/tokenCheckMiddlewareSuperAdmin.js');



router.get("/user_details",TokenCheckMiddleware, adminController.user_details);

router.get("/get_mls_ids",TokenCheckMiddleware, adminController.get_mls_ids);

router.get("/get_mlslist_superadmin",TokenCheckMiddlewareSuperAdmin, adminController.get_mlslist_superadmin);

router.get("/get_mls_ids_member",TokenCheckMiddleware, adminController.get_mls_ids_member);

router.get("/get_mls_ids_mlsadmin",TokenCheckMiddleware, adminController.get_mls_ids_mlsadmin);

router.post("/get_mlsgroup_superadmin",TokenCheckMiddlewareSuperAdmin, adminController.get_mlsgroup_superadmin);

router.post("/add_mls_member",TokenCheckMiddleware, adminController.add_mls_member);

router.post("/add_mls_superAdmin_user",TokenCheckMiddlewareSuperAdmin, adminController.add_mls_superAdmin_user);

router.post("/add_mls_superadmin",TokenCheckMiddlewareSuperAdmin, adminController.add_mls_superadmin);

router.post('/mls_member',TokenCheckMiddleware, adminController.mls_member);

router.post('/mls_member_superadmin',TokenCheckMiddlewareSuperAdmin, adminController.mls_member_superadmin);

router.get('/get_mls_member/:id',TokenCheckMiddleware, adminController.get_mls_member);

router.post('/delete_mls_member',TokenCheckMiddleware, adminController.delete_mls_member);

router.post('/delete_mls_group',TokenCheckMiddleware, adminController.delete_mls_group);

router.post("/edit_mls_member",TokenCheckMiddleware, adminController.edit_mls_member);

router.post("/edit_mls_superadmin",TokenCheckMiddlewareSuperAdmin, adminController.edit_mls_superadmin);

router.post("/edit_mls_user_details",TokenCheckMiddleware, adminController.edit_mls_user_details);

router.post("/edit_mls_member_superadmin",TokenCheckMiddlewareSuperAdmin, adminController.edit_mls_member_superadmin);

router.post("/bulk_upload_members",TokenCheckMiddleware, multipartMiddleware,TokenCheckMiddleware, adminController.bulk_upload_members);

router.post("/bulk_remove_members",TokenCheckMiddleware, multipartMiddleware, adminController.bulk_remove_members);

router.post("/update_default_values",TokenCheckMiddlewareSuperAdmin, defaultvaluesController.update_default_values);

router.get("/get_default_values",TokenCheckMiddleware, defaultvaluesController.get_default_values);

router.post("/add_news",TokenCheckMiddlewareSuperAdmin, adminController.add_news);

router.get("/get_news", adminController.get_news);

router.get("/get_news_by_id/:id",TokenCheckMiddlewareSuperAdmin, adminController.get_news_by_id);

router.post("/edit_news",TokenCheckMiddlewareSuperAdmin, adminController.edit_news);

router.post('/delete_news',TokenCheckMiddlewareSuperAdmin, adminController.delete_news);


module.exports = router;
