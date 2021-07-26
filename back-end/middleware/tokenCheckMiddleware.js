const express = require("express");
const router = express.Router();
const chartController = require('../controllers/chart');
const config = require("config");
const jwt = require("jsonwebtoken");
const multipart = require('connect-multiparty');

module.exports = async (req, res, next) => {

    if (req.headers.authorization) {

        const authorizationHeaader = req.headers.authorization;

        if (authorizationHeaader) {

            const token = req.headers.authorization.split(' ')[1];
            //console.log(token);
            try {
                decoded = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") })
                req.user = decoded;
                next();
            } catch (e) {
                res.status(401).send({ "msg": "Invalid token." });
            }
        }
    }
    else {
        res.status(401).send({ "msg": "Invalid token." });
    }

}
