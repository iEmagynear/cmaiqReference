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

module.exports = async (req, res, next) => {

    //console.log(req.headers);
    if (req.headers.authorization) {

        const authorizationHeaader = req.headers.authorization;

        if (authorizationHeaader) {

            const token = req.headers.authorization.split(' ')[1];

            try {
                decoded = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") })
                const value = await rclient.get(decoded._id);

                if(decoded.uuid != value){
                    //console.log("unmached");
                    res.status(401).send({ "msg": "Invalid token." });
                }else
                {

                    const Id = decoded._id;
                    let filterData = { _id: Id };
                    let userData;

                    try {
                        userData = await User.findOne(filterData);

                    } catch(err) {
                        console.log(err); // TypeError: failed to fetch
                    }

                    //console.log(userData.roles);
                    let superadmin = false;
                    for (let index = 0; index < userData.roles.length; index++) {
                        const element = userData.roles[index];
                        if(element.role == 'superadmin'){
                            superadmin = true;
                        }
                    }

                    if(superadmin){
                        console.log("mached");
                        req.user = decoded;
                        next();
                    }
                    else{
                        res.status(401).send({ "msg": "Invalid token." });
                    }

                }


            } catch (e) {
                //console.log(e);
                //console.log("mached11");
                res.status(401).send({ "msg": "Invalid token." });
            }
        }
    }
    else {
        //console.log("mached22");
        res.status(401).send({ "msg": "Invalid token." });
    }

}
