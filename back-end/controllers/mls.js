const Joi = require("joi");
const _ = require('lodash');
const { User } = require("../models/user");
const { Mls } = require("../models/mls");
const { Subdivision } = require("../models/subdivisions");
const { Zipcode } = require("../models/zipcodes");
const jwt = require("jsonwebtoken");
const config = require("config");
const nodeMailer = require('nodemailer')
const bcrypt = require('bcrypt');
var handlebars = require('handlebars');
const fs = require('fs');
//var request = require('request');
var syncrequest = require('sync-request');
var rp = require('request-promise');

let transporter = nodeMailer.createTransport({
    host: config.get("MAILER_HOST"),
    port: config.get("MAILER_PORT"),
    secure: true,
    auth: {
        user: config.get("MAILER_USER"),
        pass: config.get("MAILER_PASS")
    }
});

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

exports.get_mlses = async (req, res) => {
    var datetime = new Date();
    console.log(datetime);
    let mls;
    try {
        mls = await Mls.find();

    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    $arrApi = [];
    mls_ids = [];
    //console.log(req.user._id);

    /* const token = req.headers.authorization.split(' ')[1];
    try {
        resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });

    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    } */
    const Id = req.user._id;
    //console.log(Id);
    //return;
    let filterData = { _id: Id };
    let userData;
    try {
        userData = await User.findOne(filterData);

    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    for (let i = 0; i <= userData.roles.length - 1; i++) {

        if (userData.roles[i].role) {

            let item = userData.roles[i];

            //console.log(item);
            //console.log(item.role);
            if (item.role == 'member') {

                //console.log(item.association);

                if (item.association.length > 0) {
                    for (let ii = 0; ii <= item.association.length - 1; ii++) {

                        //console.log(item.association[ii]);
                        let item1 = item.association[ii];

                        let mls_id = item1.mls_id;

                        let filterDatamls = { _id: mls_id };
                        //console.log(filterDatamls);
                        let mlsData;
                        try {
                            mlsData = await Mls.findOne(filterDatamls);

                        } catch (err) {
                            console.log(err); // TypeError: failed to fetch
                        }
                        //console.log(mls_id);
                        //console.log(mlsData.name);
                        if (mlsData) {
                            mls_ids.push(String(mls_id));
                        }
                    }
                }
                break;
            }

        }
    }


    for (let i = 0; i <= mls.length - 1; i++) {

        if (mls_ids.indexOf(String(mls[i]._id)) == -1) {

            $arrApi.push({
                id: mls[i]._id,
                itemName: mls[i].name
            });
        }

    }

    var datetime2 = new Date();
    console.log(datetime2);

    const diffTime = Math.abs(datetime2 - datetime);
    //const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffTime + " milliseconds");

    res.send($arrApi);
};


exports.get_mlses_non_login = async (req, res) => {

    let mls;
    try {
        mls = await Mls.find();

    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    $arrApi = [];
    mls_ids = [];
    /* const token = req.headers.authorization.split(' ')[1];
    resultJwt = await jwt.verify(token,config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"),issuer: config.get("issuer")});

    const Id = resultJwt._id;

    let filterData = {_id:Id};
    let userData = await User.findOne(filterData); */

    /* for(let i = 0;i<= userData.roles.length-1;i++){

        if(userData.roles[i].role){

            let item = userData.roles[i];

            //console.log(item);
            //console.log(item.role);
            if( item.role == 'member'){

                //console.log(item.association);

                if(item.association.length > 0){
                    for(let ii = 0;ii<=item.association.length-1;ii++){

                        //console.log(item.association[ii]);
                        let item1 = item.association[ii];

                        let mls_id = item1.mls_id;

                        let filterDatamls = {_id:mls_id};
                        //console.log(filterDatamls);
                        let mlsData = await Mls.findOne(filterDatamls);
                        //console.log(mls_id);
                        //console.log(mlsData.name);
                        if(mlsData){
                            mls_ids.push(String(mls_id));
                        }
                    }
                }

            }

        }
    } */


    for (let i = 0; i <= mls.length - 1; i++) {

        //if(mls_ids.indexOf( String(mls[i]._id) ) == -1){

        $arrApi.push({
            id: mls[i]._id,
            itemName: mls[i].name
        });
        //}

    }

    res.send($arrApi);
};

exports.request_mls = async (req, res) => {

    let requested_mls = '';

    if (req.body.mls.length > 0) {

        for (let i = 0; i < req.body.mls.length; i++) {

            console.log(req.body.mls[i].itemName);
            requested_mls += req.body.mls[i].itemName + ',';

        }

    }

    //const token = req.headers.authorization.split(' ')[1];
    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    //
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    // const Id = resultJwt._id;

    const Id = req.user._id;

    let filterData = { _id: Id };
    let userData;
    try {
        userData = await User.findOne(filterData);

    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    if (userData && requested_mls != '') {
        requested_mls = requested_mls.replace(/,+$/, '');

        let message = userData.firstname + ' ' + userData.lastname + ' (' + userData.email + ') from ' + userData.companyname + " has requested to access " + requested_mls;

        /* res.send(message); */
        readHTMLFile(__dirname + '/../email_templates/request_mls.html', function (err, html) {

            var template = handlebars.compile(html);

            var replacements = {

                message: message
            };

            var htmlToSend = template(replacements);

            var mailOptions = {
                from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                to: config.get("admin_email"),
                subject: 'cmaIQ',
                html: htmlToSend,
            };

            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                    return res.send(error);
                }
            });
        });

        res.send({ "message": "Requested Successfully" });
    }

}

exports.import_subdivisions = async (req, res) => {

    var count = 0

    mlsget = await Mls.find({ "subs_url": { "$nin": [null, ""] }, "sub_downloaded": { $ne: true } });

    for (let index = 0; index < mlsget.length; index++) {

        var newarray = [];

        const element = mlsget[index];

        const mls_id = element._id;

        var options = {
            uri: element.subs_url,
            headers: {
                'Content-Type': 'application/json'
            },
            json: true // Automatically parses the JSON string in the response
        };

        try {
            const result = await rp(options);
            //console.log(result);
            console.log(element.name);
            const areasArray = result
            console.log(areasArray.length);
            for (let index1 = 0; index1 < areasArray.length; index1++) {
                const document = { "mls_id": mls_id, "name": areasArray[index1] };
                newarray.push(document);
            }
            console.log(newarray.length);
            var save = await Subdivision.insertMany(newarray);
            if (save) {
                count = count + newarray.length;
            }

        } catch (error) {
            console.log(error);
        }

        //update current mls status to zip_downloaded true
    }

    console.log({ 'success': "sub done", 'count': count });
    res.send({ 'success': "sub done", 'count': count })

};

exports.import_zipcodes = async (req, res) => {

    var count = 0;

    mlsget = await Mls.find({ "zips_url": { "$nin": [null, ""] }, "zip_downloaded": { $ne: true } });

    for (let index = 0; index < mlsget.length; index++) {

        var newarray = [];

        const element = mlsget[index];

        const mls_id = element._id;

        var options = {
            uri: element.zips_url,
            headers: {
                'Content-Type': 'application/json'
            },
            json: true // Automatically parses the JSON string in the response
        };

        try {
            const result = await rp(options);
            //console.log(result);
            console.log(element.name);
            const areasArray = result
            console.log(areasArray.length);
            for (let index1 = 0; index1 < areasArray.length; index1++) {
                const document = { "mls_id": mls_id, "name": areasArray[index1] };
                newarray.push(document);
            }
            console.log(newarray.length);
            var save = await Zipcode.insertMany(newarray);
            if (save) {
                count = count + newarray.length;
            }

        } catch (error) {
            console.log(error);
        }

    }
    console.log({ 'success': "zip done", 'count': count });
    res.send({ 'success': "zip done", 'count': count })

};

exports.get_subdivisions = async (req, res) => {

    const maxRecords = 100;
    const searchText = req.body.filter;
    if (req.body.filter) {
        var filter = { name: { $regex: searchText, $options: 'i' }, "mls_id": req.body.mls }
    }
    else {
        var filter = { "mls_id": req.body.mls }

    }
    //console.log(filter)
    let subdivision;
    try {
        subdivision = await Subdivision.find(filter).limit(maxRecords);

    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    if (subdivision.length > 0) {
        res.send(subdivision)
    }
    else {
        res.status(400).send({ "error": "Not found" });
    }

};

exports.get_zipcodes = async (req, res) => {

    const maxRecords = 100;
    const searchText = req.body.filter;
    if (req.body.filter) {
        var filter = { name: { $regex: searchText, $options: 'i' }, "mls_id": req.body.mls }
    }
    else {
        var filter = { "mls_id": req.body.mls }

    }
    //console.log(filter)
    let zipcode;
    try {
        zipcode = await Zipcode.find(filter).limit(maxRecords);

    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    if (zipcode.length > 0) {
        res.send(zipcode)
    }
    else {
        res.status(400).send({ "error": "Not found" });
    }
};
