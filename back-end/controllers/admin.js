const Joi = require("joi");
const _ = require('lodash');
const { User } = require("../models/user");
const { Mls } = require("../models/mls");
const { News } = require("../models/news");
const jwt = require("jsonwebtoken");
const config = require("config");
const csv = require('csv-parser');
const fs = require('fs');
const csv2 = require('csvtojson');
const nodeMailer = require('nodemailer')
const bcrypt = require('bcrypt');
var handlebars = require('handlebars');
const AWS = require('aws-sdk');
AWS.config.update({ region: config.get("SQS_REGION") });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueName = config.get("SQS_QUEUE");
const queueUrl = `https://sqs.us-east-1.amazonaws.com/136382110862/${queueName}`;
const s3 = new AWS.S3();
const stripe = require("stripe")(config.get("stripe_sk"));
const { Payment } = require("../models/payment");

const promisedelsub = data => {

    return new Promise((resolve, reject) => {
        stripe.subscriptions.del(data, (err, confirmation) => {
            if (err) {
                throw err;
            }
            resolve(confirmation)
        });
    })
    //stripe.subscriptions.del(subscription
}

let transporter = nodeMailer.createTransport({
    host: config.get("MAILER_HOST"),
    port: config.get("MAILER_PORT"),
    secure: true,
    auth: {
        user: config.get("MAILER_USER"),
        pass: config.get("MAILER_PASS")
    }
});

fs.readFileAsync = function (filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, { encoding: 'utf-8' }, (err, data) => {
            if (err) reject(err); else resolve(data);
        });
    });
};

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

exports.get_mls_ids = async (req, res) => {

    var mls_ids = [];

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    //
    // const Id = resultJwt._id;
    const Id = req.user._id;
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
            if (item.role == 'mlsadmin') {

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
                            mls_ids.push(
                                {
                                    'mls_id': mls_id,
                                    'mls_name': mlsData.name
                                }
                            );
                        }
                    }
                }

            }

        }
    }

    res.send({ 'mls_id': mls_ids });
};

exports.get_mls_ids_member = async (req, res) => {

    var mls_ids = [];

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    //
    // const Id = resultJwt._id;
    const Id = req.user._id;
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
                            mls_ids.push(
                                {
                                    'mls_id': mls_id,
                                    'mls_name': mlsData.name,
                                    'mls_isupload': mlsData.enableCSVUpload
                                }
                            );
                        }
                    }
                }

            }

        }
    }

    res.send({ 'mls_id': mls_ids });
};

exports.get_mls_ids_mlsadmin = async (req, res) => {

    var mls_ids = [];

    //const token = req.headers.authorization.split(' ')[1];
    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
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

    for (let i = 0; i <= userData.roles.length - 1; i++) {

        if (userData.roles[i].role) {

            let item = userData.roles[i];

            //console.log(item);
            //console.log(item.role);
            if (item.role == 'mlsadmin') {

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
                            mls_ids.push(
                                {
                                    'mls_id': mls_id,
                                    'mls_name': mlsData.name
                                }
                            );
                        }
                    }
                }

            }

        }
    }

    res.send({ 'mls_id': mls_ids });
};

exports.add_mls_member = async (req, res) => {

    // console.log(req.body);

    const schema = {
        mls_id: Joi.string().required(),
        firstname: Joi.string().allow(null, ''),
        lastname: Joi.string().allow(null, ''),
        email: Joi.string().email().required().max(255),
        expiry: Joi.date().allow(null, ''),
        market_center: Joi.string().allow(null, ''),
        wantsto: Joi.boolean().allow(null, ''),
        wantstonotify: Joi.boolean().allow(null, ''),
        payer_type_online: Joi.string().allow(null, '')
    };

    const result = Joi.validate(req.body, schema);

    let et_access_new_mls;
    try {
        et_access_new_mls = await fs.readFileSync(__dirname + '/../email_templates/access_new_mls.html');
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    let et_create_password_mls;
    try {
        et_create_password_mls = await fs.readFileSync(__dirname + '/../email_templates/create_password.html');
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    let mls_create_password;
    try {
        mls_create_password = await fs.readFileSync(__dirname + '/../email_templates/new_mls_and_password.html');
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    //console.log(req.body.wantsto);
    // console.log(req.body.payer_type_online);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }
    let user;
    try {
        user = await User.findOne({ "email": req.body.email });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    let newRoleArray = [];
    //console.log(user);

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    //
    // const Id = resultJwt._id;
    const Id = req.user._id;
    let filterData = { _id: Id };
    //let userData = await User.findOne(filterData);
    let mls_id = req.body.mls_id;
    let imgLogo = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/public/apcri-email-logo.png";

    if (user) {

        user.roles.forEach(function (item) {

            if (item.role == 'member') {
                // console.log('if1');
                let newRoleAssocArray = [];

                //console.log(item.association.length);
                var matched = false;
                if (item.association.length > 0) {
                    //console.log('if2');

                    item.association.forEach(function (item1) {

                        //console.log(item1);

                        if (JSON.stringify(item1.mls_id) == JSON.stringify(mls_id)) {
                            //console.log('if3');
                            matched = true;
                            newRoleAssocArray.push({
                                "expiry": (req.body.expiry) ? req.body.expiry : null,
                                "mls_id": item1.mls_id,
                                "payer_type_online": (req.body.payer_type_online) ? req.body.payer_type_online : null
                            });
                        }
                        else {
                            //console.log('else1');
                            newRoleAssocArray.push({
                                "expiry": item1.expiry,
                                "mls_id": item1.mls_id,
                                "payer_type_online": item1.payer_type_online
                            });
                        }

                    });

                    if (matched == false) {
                        newRoleAssocArray.push({
                            "expiry": (req.body.expiry) ? req.body.expiry : null,
                            "mls_id": mls_id,
                            "payer_type_online": (req.body.payer_type_online) ? req.body.payer_type_online : null
                        });
                    }

                }
                else {
                    //console.log('else2');
                    newRoleAssocArray.push({
                        "expiry": (req.body.expiry) ? req.body.expiry : null,
                        "mls_id": mls_id,
                        "payer_type_online": (req.body.payer_type_online) ? req.body.payer_type_online : null
                    });
                }

                //console.log(newRoleAssocArray);

                newRoleArray.push({
                    "role": item.role,
                    "association": newRoleAssocArray
                });

            }
            else {
                //console.log('else3');
                //console.log(user.roles)
                let newRoleAssocArray = [];

                item.association.forEach(function (item1) {
                    newRoleAssocArray.push({
                        "expiry": item1.expiry,
                        "mls_id": item1.mls_id,
                        "payer_type_online": item1.payer_type_online
                    });
                });

                newRoleArray.push({
                    "role": item.role,
                    "association": newRoleAssocArray
                });
            }

        });
        var checkmember = false;
        for (let i = 0; i < newRoleArray.length; i++) {
            //console.log(newRoleArray[i].role);
            if (newRoleArray[i].role == 'member') {
                checkmember = true;
            }

        }
        if (!checkmember) {

            newRoleArray.unshift({
                role: "member",
                association: [{
                    mls_id: mls_id,
                    payer_type_online: (req.body.payer_type_online) ? req.body.payer_type_online : null,
                    expiry: (req.body.expiry) ? req.body.expiry : null,
                }]
            });

        }


        let update;

        if (req.body.wantsto && !user.password) {
            let saltNew;
            try {
                saltNew = await bcrypt.genSalt(10);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            var randomstring = Math.random().toString(36).slice(-8);
            let password;
            try {
                password = await bcrypt.hash(randomstring, saltNew);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }

            update = { roles: newRoleArray, password: password, updated: new Date() };
        }
        else {

            update = { roles: newRoleArray, updated: new Date() };
        }

        let query = { email: req.body.email };

        let options = { upsert: true, new: true, setDefaultsOnInsert: true };

        //if(req.body.market_center){

        if (user.mls_specific_data) {
            update['mls_specific_data'] = user.mls_specific_data;
        }
        else {
            update['mls_specific_data'] = {};
        }

        //user.mls_specific_data = {};
        update['mls_specific_data'][mls_id] = {
            market_center: req.body.market_center
        };
        //}
        try {
            await User.findOneAndUpdate(query, update, options);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
        if (req.body.wantsto && req.body.wantstonotify && !user.password) {
            //mls_create_password
            let filterDatamls = { _id: req.body.mls_id };
            let mlsData;
            try {
                mlsData = await Mls.findOne(filterDatamls);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }

            const template = handlebars.compile(mls_create_password.toString());
            const replacements = {
                email: req.body.email,
                password: randomstring,
                mlsName: mlsData.name,
                site_url: config.get("SITE_URL"),
                imgLogo: imgLogo
            };

            const htmlToSend = template(replacements);

            const mailOptions = {
                from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                to: req.body.email,
                //cc:'ankit@tatrasdata.com',
                subject: 'cmaIQ',
                html: htmlToSend,
            };

            try {
                await transporter.sendMail(mailOptions);
            }
            catch (err) {
                console.log(err);
            }
        }
        else if (req.body.wantsto && !user.password) {

            //console.log(req.body.email);
            let filterDatamls = { _id: req.body.mls_id };
            let mlsData;
            try {
                mlsData = await Mls.findOne(filterDatamls);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            const template = handlebars.compile(et_create_password_mls.toString());
            const replacements = {
                email: req.body.email,
                password: randomstring,
                //mlsName: mlsData.name,
                site_url: config.get("SITE_URL"),
                imgLogo: imgLogo
            };

            const htmlToSend = template(replacements);

            const mailOptions = {
                from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                to: req.body.email,
                //cc:'ankit@tatrasdata.com',
                subject: 'cmaIQ',
                html: htmlToSend,
            };

            try {
                await transporter.sendMail(mailOptions);
            }
            catch (err) {
                console.log(err);
            }
        }
        else if (req.body.wantstonotify) {

            //console.log(req.body.email);

            let filterDatamls = { _id: req.body.mls_id };
            let mlsData;
            try {
                mlsData = await Mls.findOne(filterDatamls);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            const template = handlebars.compile(et_access_new_mls.toString());
            const replacements = {
                email: req.body.email,
                //password: randomstring,
                mlsName: mlsData.name,
                site_url: config.get("SITE_URL"),
                imgLogo: imgLogo
            };

            const htmlToSend = template(replacements);

            // const emailId = et_access_new_mls.toString().replace('{{email}}', req.body.email);
            // const html = emailId.replace('{{site_url}}', config.get("SITE_URL"));
            // const htmlToSend = html.replace('{{mlsName}}', mlsData.name);
            // const imgLogoNew = htmlToSend.replace('{{imgLogo}}', "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/public/apcri-email-logo.png");
            const mailOptions = {
                //cc: 'ankit@tatrasdata.com',
                from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                to: req.body.email,
                subject: 'cmaIQ',
                html: htmlToSend,
            };

            try {
                await transporter.sendMail(mailOptions);
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log('no notification selected.')
        }

    }
    else {

        user = new User(_.pick(req.body, ['email']));

        if (req.body.firstname) {
            user.firstname = req.body.firstname;
        }

        if (req.body.lastname) {
            user.lastname = req.body.lastname;
        }

        var payer_type_online = (req.body.payer_type_online) ? req.body.payer_type_online : false;

        user.is_registered = false;

        if (req.body.wantsto) {
            let saltNew;
            try {
                saltNew = await bcrypt.genSalt(10);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            var randomstring = Math.random().toString(36).slice(-8);
            try {
                user.password = await bcrypt.hash(randomstring, saltNew);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
        }

        user.username = '_' + Math.random().toString(36).substr(2, 9);

        user.roles = [{
            role: "member",
            association: [{
                mls_id: mls_id,
                payer_type_online: payer_type_online,
                expiry: (req.body.expiry) ? req.body.expiry : null,
            }]
        }];

        if (req.body.market_center) {
            user.mls_specific_data = {};
            user.mls_specific_data[mls_id] = {
                market_center: req.body.market_center
            };
        }

        //console.log(user);
        try {
            await user.save({ validateBeforeSave: false });

            // if (req.body.wantsto && req.body.wantstonotify) {
            //     //mls_create_password
            //     let filterDatamls = { _id: req.body.mls_id };
            //     let mlsData = await Mls.findOne(filterDatamls);
            //
            //
            //     const template = handlebars.compile(mls_create_password.toString());
            //     const replacements = {
            //         email: req.body.email,
            //         password: randomstring,
            //         mlsName: mlsData.name,
            //         site_url: config.get("SITE_URL"),
            //         imgLogo: imgLogo
            //     };
            //
            //     const htmlToSend = template(replacements);
            //
            //     const mailOptions = {
            //         from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
            //         to: req.body.email,
            //         //cc:'ankit@tatrasdata.com',
            //         subject: 'cmaIQ',
            //         html: htmlToSend,
            //     };
            //
            //     try {
            //         await transporter.sendMail(mailOptions);
            //     }
            //     catch (err) {
            //         console.log(err);
            //     }
            // }

            if (req.body.wantsto) {

                //console.log(req.body.email);
                let filterDatamls = { _id: req.body.mls_id };
                let mlsData;
                try {
                    mlsData = await Mls.findOne(filterDatamls);
                } catch (err) {
                    console.log(err); // TypeError: failed to fetch
                }
                const template = handlebars.compile(et_create_password_mls.toString());
                const replacements = {
                    email: req.body.email,
                    password: randomstring,
                    //mlsName: mlsData.name,
                    site_url: config.get("SITE_URL"),
                    imgLogo: imgLogo
                };

                const htmlToSend = template(replacements);

                const mailOptions = {
                    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                    to: req.body.email,
                    //cc:'ankit@tatrasdata.com',
                    subject: 'cmaIQ',
                    html: htmlToSend,
                };

                try {
                    await transporter.sendMail(mailOptions);
                }
                catch (err) {
                    console.log(err);
                }
            }

            if (req.body.wantstonotify) {

                //console.log(req.body.email);

                let filterDatamls = { _id: req.body.mls_id };
                let mlsData;
                try {
                    mlsData = await Mls.findOne(filterDatamls);
                } catch (err) {
                    console.log(err); // TypeError: failed to fetch
                }

                const template = handlebars.compile(et_access_new_mls.toString());
                const replacements = {
                    email: req.body.email,
                    //password: randomstring,
                    mlsName: mlsData.name,
                    site_url: config.get("SITE_URL"),
                    imgLogo: imgLogo
                };

                const htmlToSend = template(replacements);

                // const emailId = et_access_new_mls.toString().replace('{{email}}', req.body.email);
                // const html = emailId.replace('{{site_url}}', config.get("SITE_URL"));
                // const htmlToSend = html.replace('{{mlsName}}', mlsData.name);
                const mailOptions = {
                    //cc: 'ankit@tatrasdata.com',
                    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                    to: req.body.email,
                    subject: 'cmaIQ',
                    html: htmlToSend,
                };

                try {
                    await transporter.sendMail(mailOptions);
                }
                catch (err) {
                    console.log(err);
                }
            }


        } catch (err) {
            return res.status(400).send(err);
        }

    }

    res.send({ "message": "User updated", newRoleArray: newRoleArray, data: user.getSafe() });
};

exports.add_mls_superAdmin_user = async (req, res) => {

    //console.log(req.body);

    const schema = {
        // mls_id: Joi.string().required(),
        firstname: Joi.string().allow(null, ''),
        lastname: Joi.string().allow(null, ''),
        email: Joi.string().email().required().max(255),
        expiry: Joi.date().allow(null, ''),
        roles: Joi.array().allow(null),
        wantsto: Joi.boolean().allow(null, '')
    };

    let imgLogo = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/public/apcri-email-logo.png";
    const result = Joi.validate(req.body, schema);
    // console.log(result);

    let et_access_new_mls;
    try {
        et_access_new_mls = await fs.readFileSync(__dirname + '/../email_templates/access_new_mls.html');
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    let et_create_password_mls;
    try {
        et_create_password_mls = await fs.readFileSync(__dirname + '/../email_templates/create_password.html');
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    let mls_create_password;
    try {
        mls_create_password = await fs.readFileSync(__dirname + '/../email_templates/new_mls_and_password.html');
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    //console.log(req.body.wantsto);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }

    let user;

    try {
        user = await User.findOne({ "email": req.body.email });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    let newRoleArray = [];


    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    //
    // const Id = resultJwt._id;
    const Id = req.user._id;
    //let filterData = { _id: Id };
    //let userData = await User.findOne(filterData);
    // let mls_id = req.body.mls_id;

    if (user) {
        let newRoleAssocArray = [];
        let mlsDataName = '';
        // item.association.forEach(function (item1) {
        //     newRoleAssocArray.push({
        //         "expiry": item1.expiry,
        //         "mls_id": item1.mls_id,
        //         // "payer_type_online": item1.payer_type_online
        //     });
        // });

        // newRoleArray.push({
        //     "role": item.role,
        //     "association": newRoleAssocArray
        // });
        req.body.roles.forEach((item) => {
            //console.log(item);

            if (item.role == "superadmin") {
                newRoleAssocArray = [];

            }

            if (item.role == "mlsadmin") {

                item.association.forEach((item1) => {
                    // let filterDatamls = { _id: item1.mls_id };
                    // let mlsData = await Mls.findOne(filterDatamls);

                    // if (mlsDataName) {
                    //     mlsDataName += ',' + mlsData.name;
                    // } else {
                    //     mlsDataName = mlsData.name;
                    // }
                    // console.log(mlsDataName);
                    newRoleAssocArray.push({
                        //"expiry": (row.subscription_expiry) ? row.subscription_expiry : null,
                        "expiry": item1.expiry,
                        "mls_id": item1.mls_id
                    });
                });


            }

            newRoleArray.push({
                "role": item.role,
                "association": newRoleAssocArray
            });

        });



        // });

        let update;

        if (req.body.wantsto && !user.password) {
            let saltNew;
            try {
                saltNew = await bcrypt.genSalt(10);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }

            var randomstring = Math.random().toString(36).slice(-8);
            let password;
            try {
                password = await bcrypt.hash(randomstring, saltNew);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            update = { roles: newRoleArray, password: password, updated: new Date() };
        }
        else {
            update = { roles: newRoleArray, updated: new Date() };
        }

        let query = { email: req.body.email };

        let options = { upsert: true, new: true, setDefaultsOnInsert: true };

        //if(req.body.market_center){

        if (user.mls_specific_data) {
            update['mls_specific_data'] = user.mls_specific_data;
        }
        else {
            update['mls_specific_data'] = {};
        }

        //user.mls_specific_data = {};
        // update['mls_specific_data'][mls_id] = {
        //     market_center: req.body.market_center
        // };
        //}

        try {
            await User.findOneAndUpdate(query, update, options);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
        // if (req.body.wantsto && req.body.wantstonotify && !user.password) {
        if (req.body.wantsto && !user.password) {
            //mls_create_password
            // let filterDatamls = { _id: req.body.mls_id };
            // let mlsData = await Mls.findOne(filterDatamls);
            var user_Data = req.body;

            for (let i = 0; i <= user_Data.roles.length - 1; i++) {

                if (user_Data.roles[i].role) {

                    let item = user_Data.roles[i];

                    if (item.role == 'mlsadmin') {
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
                                if (mlsData) {

                                    if (mlsDataName) {
                                        mlsDataName += ',' + mlsData.name;
                                    } else {
                                        mlsDataName = mlsData.name;
                                    }

                                }
                            }
                        }

                    }

                }
            }
            if (mlsDataName != '') {
                const template = handlebars.compile(mls_create_password.toString());
                const replacements = {
                    email: req.body.email,
                    password: randomstring,
                    mlsName: mlsDataName ? 'You now have access to the ' + mlsDataName : '',
                    site_url: config.get("SITE_URL"),
                    imgLogo: imgLogo
                };

                const htmlToSend = template(replacements);

                const mailOptions = {
                    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                    to: req.body.email,
                    //cc:'ankit@tatrasdata.com',
                    subject: 'cmaIQ',
                    html: htmlToSend,
                };

                try {
                    await transporter.sendMail(mailOptions);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        else if (req.body.wantsto && !user.password) {

            //console.log(req.body.email);
            // let filterDatamls = { _id: req.body.mls_id };
            // let mlsData = await Mls.findOne(filterDatamls);

            const template = handlebars.compile(et_create_password_mls.toString());
            const replacements = {
                email: req.body.email,
                password: randomstring,
                //mlsName: mlsData.name,
                site_url: config.get("SITE_URL"),
                imgLogo: imgLogo
            };

            const htmlToSend = template(replacements);

            const mailOptions = {
                from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                to: req.body.email,
                //cc:'ankit@tatrasdata.com',
                subject: 'cmaIQ',
                html: htmlToSend,
            };

            try {
                await transporter.sendMail(mailOptions);
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            console.log('no notification selected.')
        }

    }
    else {
        let newRoleAssocArray = [];
        let mlsDataName = '';
        user = new User(_.pick(req.body, ['email']));

        if (req.body.firstname) {
            user.firstname = req.body.firstname;
        }

        if (req.body.lastname) {
            user.lastname = req.body.lastname;
        }

        // var payer_type_online = (req.body.payer_type_online) ? req.body.payer_type_online : false;

        user.is_registered = false;

        if (req.body.wantsto) {
            let saltNew;
            try {
                saltNew = await bcrypt.genSalt(10);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            var randomstring = Math.random().toString(36).slice(-8);
            try {
                user.password = await bcrypt.hash(randomstring, saltNew);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
        }

        user.username = '_' + Math.random().toString(36).substr(2, 9);

        req.body.roles.forEach((item) => {

            if (item.role == "superadmin") {
                newRoleAssocArray = [];
            }

            if (item.role == "mlsadmin") {
                item.association.forEach((item1) => {
                    newRoleAssocArray.push({
                        //"expiry": (row.subscription_expiry) ? row.subscription_expiry : null,
                        "expiry": item1.expiry,
                        "mls_id": item1.mls_id
                    });
                });

            }
            newRoleArray.push({
                "role": item.role,
                "association": newRoleAssocArray
            });

        });

        user.roles = newRoleArray

        try {
            await user.save({ validateBeforeSave: false });

            if (req.body.wantsto) {
                //mls_create_password

                // console.log(JSON.stringify(newRoleArray));


                // let filterDatamls = { _id: req.body.mls_id };
                // let mlsData = await Mls.findOne(filterDatamls);
                //var mlsnames = await promisegetmlsnames(req.body);

                var userData = req.body;

                for (let i = 0; i <= userData.roles.length - 1; i++) {

                    if (userData.roles[i].role) {

                        let item = userData.roles[i];

                        if (item.role == 'mlsadmin') {
                            if (item.association.length > 0) {
                                for (let ii = 0; ii <= item.association.length - 1; ii++) {

                                    //console.log(item.association[ii]);
                                    let item1 = item.association[ii];

                                    let mls_id = item1.mls_id;

                                    let filterDatamls = { _id: mls_id };
                                    //console.log(filterDatamls);
                                    let mlsData = await Mls.findOne(filterDatamls);

                                    if (mlsData) {

                                        if (mlsDataName) {
                                            mlsDataName += ',' + mlsData.name;
                                        } else {
                                            mlsDataName = mlsData.name;
                                        }

                                    }
                                }
                            }

                        }

                    }
                }

                if (mlsDataName != '') {
                    const template = handlebars.compile(mls_create_password.toString());
                    const replacements = {
                        email: req.body.email,
                        password: randomstring,
                        mlsName: mlsDataName ? 'You now have access to the ' + mlsDataName : '',
                        site_url: config.get("SITE_URL"),
                        imgLogo: imgLogo
                    };

                    const htmlToSend = template(replacements);

                    const mailOptions = {
                        from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                        to: req.body.email,
                        //cc:'ankit@tatrasdata.com',
                        subject: 'cmaIQ',
                        html: htmlToSend,
                    };

                    try {
                        await transporter.sendMail(mailOptions);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }

            }

            if (req.body.wantsto) {

                //console.log(req.body.email);
                // let filterDatamls = { _id: req.body.mls_id };
                // let mlsData = await Mls.findOne(filterDatamls);

                const template = handlebars.compile(et_create_password_mls.toString());
                const replacements = {
                    email: req.body.email,
                    password: randomstring,
                    //mlsName: mlsData.name,
                    site_url: config.get("SITE_URL"),
                    imgLogo: imgLogo
                };

                const htmlToSend = template(replacements);

                const mailOptions = {
                    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                    to: req.body.email,
                    //cc:'ankit@tatrasdata.com',
                    subject: 'cmaIQ',
                    html: htmlToSend,
                };

                try {
                    await transporter.sendMail(mailOptions);
                }
                catch (err) {
                    console.log(err);
                }
            }

        } catch (err) {
            return res.status(400).send(err);
        }

    }
    res.send({ "message": "User updated", newRoleArray: newRoleArray, data: user.getSafe() });

};

exports.add_mls_superadmin = async (req, res) => {

    //console.log(req.body);

    const schema = {
        name: Joi.string().required(),
        chart_api: Joi.string().allow(null, '')
    };

    const result = Joi.validate(req.body, schema);

    //console.log(result.error);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }

    const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    mls = new Mls(_.pick(req.body, ['name', 'chart_api']));

    try {
        await mls.save();
    } catch (err) {
        return res.status(400).send(err);
    }

    res.send({ "message": "Mlss added" });
};

exports.mls_member = async (req, res) => {

    //check this code

    const token = req.headers.authorization.split(' ')[1];

    try {
        result = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    /* const Id = result._id;
    let filterData = {_id:Id};
    let userData = await User.findOne(filterData); */
    let mls_id = req.body.mls_id;

    //console.log(mls_id);

    let pageNumber = parseInt(req.body.pageNumber);
    //console.log(pageNumber);
    let maxRecords = parseInt(req.body.maxRecords);
    //console.log(maxRecords);
    let searchText = req.body.searchText;
    let sortBy = req.body.sortBy;
    let sortType = req.body.sortType;
    let sort = {};
    if (sortBy == 'market_center') {
        sortBy = 'mls_specific_data.' + mls_id + '.market_center';
    }
    if (sortBy == 'payer_type_online') {
        sortBy = 'roles.association.payer_type_online';
    }
    sort[sortBy] = sortType == 'desc' ? -1 : 1;

    let filters = { 'roles.role': 'member', 'roles.association.mls_id': mls_id };
    //{'roles.role':'member','roles.association.mls_id':ObjectId('5d68e0ec2ccec6baa467792c')}
    //console.log(sort);

    let users;

    let numOfUsers;

    if (searchText) {
        //console.log('if');
        marketCenterQuery = {};
        marketCenterQuery['mls_specific_data.' + mls_id + '.market_center'] = { $regex: searchText, $options: 'i' };
        //console.log(marketCenterQuery);
        let query = {
            'roles.role': 'member', 'roles.association.mls_id': mls_id,
            $or: [
                { email: { $regex: searchText, $options: 'i' } },
                { lastname: { $regex: searchText, $options: 'i' } },
                marketCenterQuery
            ]
        };

        try {
            users = await User.find(query, '_id firstname lastname email expiry roles mls_specific_data created updated').skip((maxRecords * pageNumber) - maxRecords).limit(maxRecords).sort(sort);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }

        try {
            numOfUsers = await User.countDocuments(query);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }

    }
    else {

        try {
            users = await User.find(filters, '_id firstname lastname email expiry roles mls_specific_data created updated').skip((maxRecords * pageNumber) - maxRecords).limit(maxRecords).sort(sort);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
        try {
            numOfUsers = await User.countDocuments(filters);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
    }


    let total_pages = Math.ceil(numOfUsers / maxRecords)

    return res.send({ data: users, totalpage: total_pages, total: numOfUsers });

};

exports.mls_member_superadmin = async (req, res) => {

    const token = req.headers.authorization.split(' ')[1];

    try {
        result = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    //const users_id = req.body.users_id;
    let mlss;
    try {
        mlss = await Mls.find({}, { "name": 1 });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    const mlsCount = mlss.length;
    mlss = mlss.reduce((mlsList, mls) => {
        mlsList[mls._id] = mls.name;
        return mlsList;
    }, {});

    let pageNumber = parseInt(req.body.pageNumber);
    let maxRecords = parseInt(req.body.maxRecords);
    let searchText = req.body.searchText;
    let sortBy = req.body.sortBy;
    let sortType = req.body.sortType;
    let sort = {};
    let filters = {};
    let users;
    sort[sortBy] = sortType == 'desc' ? -1 : 1;
    const projections = {
        "firstname": 1,
        "lastname": 1,
        "email": 1,
        "mls_specific_data": 1,
        "created": 1,
        "updated": 1,
        "roles.role": 1,
        "roles.association.mls_id": 1,
        "roles.association.expiry": 1
    };
    if (searchText) {
        let query = {
            $or: [
                { email: { $regex: searchText, $options: 'i' } },
                { firstname: { $regex: searchText, $options: 'i' } },
                { lastname: { $regex: searchText, $options: 'i' } }
            ]
        };

        try {
            users = await User.find(query, projections).skip((maxRecords * pageNumber) - maxRecords).limit(maxRecords).sort(sort);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }

        let userFilter = users;
        let offset = (pageNumber - 1) * maxRecords;
        let paginatedItems = userFilter.slice(offset).slice(0, maxRecords);
        let total_pages = Math.ceil(userFilter.length / maxRecords);

        return res.send({ data: paginatedItems, totalpage: total_pages, total: userFilter.length, mlsTotal: mlsCount });

    }
    else {

        try {

            try {
                users = await User.find(filters, projections).sort(sort);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            let userFilter = users;
            let offset = (pageNumber - 1) * maxRecords;
            let paginatedItems = userFilter.slice(offset).slice(0, maxRecords);
            let total_pages = Math.ceil(userFilter.length / maxRecords);

            return res.send({ data: paginatedItems, totalpage: total_pages, total: userFilter.length, mlsTotal: mlsCount });
        }
        catch (e) {
            console.error(e)
            res.send({ "err": e });
        }
    }
};

exports.user_details = async (req, res) => {

    //const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    // const Id = resultJwt._id;

    const Id = req.user._id;

    //const Id = await req.params.id;
    let filters = { _id: Id };
    let users;
    try {
        users = await User.findOne(filters,'_id firstname lastname email roles default_mls_admin toa_Check default_mls_frontend companyname mls_specific_data eula_Check is_Agree profile_image website phone logo');
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    return res.send({ data: users });
};

exports.get_mls_member = async (req, res) => {
    let Id;
    try {
        Id = await req.params.id;
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    let filters = { _id: Id };
    let users;
    try {
        users = await User.findOne(filters,'_id firstname lastname email roles default_mls_admin toa_Check default_mls_frontend companyname mls_specific_data eula_Check is_Agree profile_image website phone logo');
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    return res.send({ data: users });
};

exports.get_mlslist_superadmin = async (req, res) => {
    try {
        let aggregate = [{
            $project: {
                "id": "$_id",
                "itemName": "$name"
            }
        }];
        let mlss = await Mls.aggregate(aggregate).project({ _id: 0 });
        return res.send({ data: mlss });
    }
    catch (e) {
        console.log(e);
    }
};

exports.get_mlsgroup_superadmin = async (req, res) => {
    let pageNumber = parseInt(req.body.groupPageNumber);
    let maxRecords = parseInt(req.body.groupMaxRecords);
    let sortType = req.body.groupSortType;
    let sortBy = req.body.groupSortBy;
    let sort = {};
    //console.log(maxRecords);
    let mls_id = req.body.mls_id;
    let mlss2 = await Mls.find({});
    const mlsCountTotal = mlss2.length
    sort[sortBy] = sortType == 'desc' ? -1 : 1;
    let searchText = req.body.searchText;
    let numOfMls;
    let mlss;
    let filters = { mls_id };
    let user;
    if (searchText) {
        let query = {
            name: { $regex: searchText, $options: 'i' }
        };

        try {
            mlss = await Mls.find(query, '_id name chart_api updated alias server_id status enableCSVUpload hasRental subs_url zips_url').skip((pageNumber * maxRecords) - maxRecords).limit(maxRecords);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
    }
    else {

        try {
            mlss = await Mls.find({}).skip((pageNumber * maxRecords) - maxRecords).limit(maxRecords);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
    }

    try {
        users = await User.find({}, { "email": 1 });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    const userCount = users.length;

    let total_pages = Math.ceil(mlss.length / maxRecords);

    return res.send({ data: mlss, totalpage: total_pages, total: mlss2.length, userTotal: userCount });

};

exports.delete_mls_group = async (req, res) => {
    try {
        const schema = {
            id: Joi.string().required()
        };

        const result = Joi.validate(req.body, schema);
        //console.log(result.error);
        if (result.error) {
            return res.status(400).send({ message: result.error.details[0].message });
        }

        let query = { _id: req.body.id };
        // let update = { updated: new Date() };
        //let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        let mlss = await Mls.findOneAndDelete(query);
        //console.log(mlss);
        res.send({ "message": "Mls deleted" });
    }
    catch (e) {
        console.log(e);
    }
    //return res.send({data: update.roles,data2: users.roles});
};

exports.delete_mls_member = async (req, res) => {

    const schema = {
        id: Joi.string().required(),
        mls_id: Joi.string().required()
    };

    const result = Joi.validate(req.body, schema);

    //console.log(result.error);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }

    let mls_id = req.body.mls_id;

    let newRoleArray = [];

    const uId = req.body.id;
    let filters = { _id: uId };
    let users;
    try {
        users = await User.findOne(filters);
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    if (users) {

        users.roles.forEach(function (item) {

            if (item.role == 'member') {

                let newRoleAssocArray = [];

                item.association.forEach(function (item2) {
                    if (JSON.stringify(item2.mls_id) == JSON.stringify(mls_id)) {
                        //console.log(item2);

                    }
                    else {
                        newRoleAssocArray.push({
                            "expiry": item2.expiry,
                            "mls_id": item2.mls_id
                        });
                    }
                });

                newRoleArray.push({
                    "role": item.role,
                    "association": newRoleAssocArray
                });
            }
            else {
                let newRoleAssocArray = [];

                item.association.forEach(function (item1, index1) {
                    newRoleAssocArray.push({
                        "expiry": item1.expiry,
                        "mls_id": item1.mls_id
                    });
                });

                newRoleArray.push({
                    "role": item.role,
                    "association": newRoleAssocArray
                });
            }
        });

    }


    let query = { _id: uId };
    let update = { roles: newRoleArray, updated: new Date() };
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        await User.findOneAndUpdate(query, update, options);
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    res.send({ "message": "User updated", data: users.getSafe() });
    //return res.send({data: update.roles,data2: users.roles});
};

exports.edit_mls_member = async (req, res) => {

    const schema = {
        _id: Joi.string().required(),
        firstname: Joi.string().allow(null, ''),
        lastname: Joi.string().allow(null, ''),
        expiry: Joi.date().allow(null, ''),
        market_center: Joi.string().allow(null, ''),
        payer_type_online: Joi.string().allow(null, ''),
        mls_id: Joi.string().required(),
        email: Joi.string().email().required().max(255),
        wantsto: Joi.boolean().allow(null, ''),
    };

    const result = Joi.validate(req.body, schema);

    let et_create_password_mls;
    //console.log(result.error);
    let imgLogo = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/public/apcri-email-logo.png";

    try {
        et_create_password_mls = await fs.readFileSync(__dirname + '/../email_templates/create_password.html');
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }

    let user;
    try {
        user = await User.findOne({ "_id": req.body._id });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    let newRoleArray = [];

    const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    let mls_id = req.body.mls_id;

    if (user) {
        user.roles.forEach(function (item) {

            if (item.role == 'member') {

                let newRoleAssocArray = [];

                if (item.association.length > 0) {

                    item.association.forEach(function (item1) {

                        if (JSON.stringify(item1.mls_id) == JSON.stringify(mls_id)) {
                            //console.log('in');
                            newRoleAssocArray.push({
                                "expiry": (req.body.expiry) ? req.body.expiry : null,
                                "mls_id": mls_id,
                                "payer_type_online": (req.body.payer_type_online) ? req.body.payer_type_online : null
                            });
                        }
                        else {
                            newRoleAssocArray.push({
                                "expiry": item1.expiry,
                                "mls_id": item1.mls_id,
                                "payer_type_online": item1.payer_type_online
                            });
                        }

                    });
                }
                else {
                    newRoleAssocArray.push({
                        "expiry": (req.body.expiry) ? req.body.expiry : null,
                        "mls_id": mls_id,
                        "payer_type_online": (req.body.payer_type_online) ? req.body.payer_type_online : null

                    });
                }

                newRoleArray.push({
                    "role": item.role,
                    "association": newRoleAssocArray
                });
            }
            else {
                let newRoleAssocArray = [];

                item.association.forEach(function (item1) {
                    newRoleAssocArray.push({
                        "expiry": item1.expiry,
                        "mls_id": item1.mls_id,
                        "payer_type_online": item1.payer_type_online
                    });
                });

                newRoleArray.push({
                    "role": item.role,
                    "association": newRoleAssocArray
                });
            }

        });

        let query = { _id: req.body._id };
        //console.log(query);
        let update;
        if (req.body.wantsto) {
            let saltNew;
            try {
                saltNew = await bcrypt.genSalt(10);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            var randomstring = Math.random().toString(36).slice(-8);
            let password;
            try {
                password = await bcrypt.hash(randomstring, saltNew);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            update = { firstname: req.body.firstname, lastname: req.body.lastname, roles: newRoleArray, updated: new Date(), password: password };
        }
        else {
            update = { firstname: req.body.firstname, lastname: req.body.lastname, roles: newRoleArray, updated: new Date() };
        }


        if (user.mls_specific_data) {
            update['mls_specific_data'] = user.mls_specific_data;
        }
        else {
            update['mls_specific_data'] = {};
        }

        //user.mls_specific_data = {};
        update['mls_specific_data'][mls_id] = {
            market_center: req.body.market_center
        };
        //}

        try {
            await User.findOneAndUpdate(query, update);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
        //await promisedelsub(mls_id)

        if (!req.body.payer_type_online) {

            try {
                await Payment.find({
                    "user_id": req.body._id,
                    "mls_id": mls_id,
                    status: { $nin: ["cancelled", "expired"] }
                }, null, {
                    sort: {
                        subscription_end_date: -1
                    }
                }, function (err, payments) {

                    payments.forEach(async (item, index) => {
                        //console.log(item);

                        let confirmation = null;
                        //try {
                        confirmation = await promisedelsub(item.subscription_id);
                        //} catch (error) {
                        //console.log(error)
                        //res.status(400).send(error);
                        //}

                        if (confirmation) {
                            let query = { user_id: req.body._id, subscription_id: item.subscription_id };
                            let update = { status: "cancelled", updated: new Date() };
                            await Payment.findOneAndUpdate(query, update);
                            //res.status(200).send(confirmation);
                            //console.log(confirmation);
                        }

                    });

                });
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }

        }

        if (req.body.wantsto) {

            //let filterDatamls = { _id: req.body.mls_id };
            //let mlsData = await Mls.findOne(filterDatamls);

            const template = handlebars.compile(et_create_password_mls.toString());
            const replacements = {
                email: req.body.email,
                password: randomstring,
                //mlsName: mlsData.name,
                site_url: config.get("SITE_URL"),
                imgLogo: imgLogo
            };

            const htmlToSend = template(replacements);

            const mailOptions = {
                from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                to: req.body.email,
                //cc:'ankit@tatrasdata.com',
                subject: 'cmaIQ',
                html: htmlToSend,
            };

            try {
                await transporter.sendMail(mailOptions);
            }
            catch (err) {
                console.log(err);
            }
        }


    }

    res.send({ "message": "User updated", data: user.getSafe() });

};

exports.edit_mls_superadmin = async (req, res) => {

    const schema = {
        name: Joi.string().required(),
        chart_api: Joi.string().allow(null, ''),
        mls_id: Joi.string().required(),
        enableCSVUpload: Joi.boolean().default(false),
        status: Joi.boolean().default(false),
        alias: Joi.string().allow(null, ''),
        server_id: Joi.string().allow(null, ''),
        hasRental: Joi.string().allow(null, '')
    };

    const result = Joi.validate(req.body, schema);

    //console.log(result.error);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }

    const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    let mls_id = req.body.mls_id;
    let query = { _id: mls_id };

    let update = { name: req.body.name, chart_api: req.body.chart_api, updated: new Date(), enableCSVUpload: req.body.enableCSVUpload, status: req.body.status, alias: req.body.alias, server_id: req.body.server_id, hasRental: req.body.hasRental };
    console.log(update);
    try {
        await Mls.findOneAndUpdate(query, update);
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    try {
        res.send({ "message": "Mls updated" });
    }
    catch (e) {
        console.log(e);
    }

};

exports.edit_mls_member_superadmin = async (req, res) => {
    const schema = {
        _id: Joi.string().required(),
        firstname: Joi.string().allow(null, ''),
        lastname: Joi.string().allow(null, ''),
        roles: Joi.array().allow(null)
    };

    const result = Joi.validate(req.body, schema);

    //console.log(result.error);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }

    let user;
    try {
        user = await User.findOne({ "_id": req.body._id });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    let newRoleArray = [];

    const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    let newRoleAssocArray = [];
    let newRoleAssocArray1 = [];
    if (user) {
        user.roles.forEach((item) => {
            if (item.role == "member") {

                item.association.forEach(function (item1) {
                    newRoleAssocArray1.push({
                        "expiry": (item1.subscription_expiry) ? item1.subscription_expiry : null,
                        "mls_id": item1.mls_id
                    });
                });

                newRoleArray.push({
                    "role": item.role,
                    "association": newRoleAssocArray1
                });
            }
        });

        //console.log(req.body.roles);
        req.body.roles.forEach((item) => {
            //console.log(item);

            if (item.role == "superadmin") {
                newRoleAssocArray = [];

            }

            if (item.role == "mlsadmin") {

                item.association.forEach(function (item1) {
                    newRoleAssocArray.push({
                        //"expiry": (row.subscription_expiry) ? row.subscription_expiry : null,
                        "mls_id": item1.mls_id
                    });
                });


            }

            newRoleArray.push({
                "role": item.role,
                "association": newRoleAssocArray
            });

        });

        //console.log(newRoleArray);
    }

    if (newRoleArray) {
        update = { firstname: req.body.firstname, lastname: req.body.lastname, roles: newRoleArray, updated: new Date() };

        let query = { _id: req.body._id };

        try {
            await User.findOneAndUpdate(query, update);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
        res.send({ "message": "User updated" });
    }

};

exports.edit_mls_user_details = async (req, res) => {

    const schema = {
        _id: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        default_mls_admin: Joi.string().allow(null, ''),
        default_mls_frontend: Joi.string().allow(null, ''),
        password: Joi.string().allow(null, ''),
        companyname: Joi.string().required(),
        website: Joi.string().allow(null, ''),
        phone: Joi.string().allow(null, ''),
        profile_image: Joi.string().allow(null).allow('').optional(),
        logo: Joi.string().allow(null).allow('').optional()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }

    var base64 = req.body.profile_image;

    let user;
    try {
        user = await User.findOne({ "_id": req.body._id });
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
    //let newRoleArray = [];

    const token = req.headers.authorization.split(' ')[1];

    // try {
    //     resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    // } catch (err) {
    //     console.log(err); // TypeError: failed to fetch
    // }
    let query;
    //let mls_id  = req.body.mls_id;
    let update;
    let password;

    if (user) {
        query = { _id: req.body._id };
        if (req.body.profile_image && req.body.password && req.body.logo) {
            //console.log('1');
            //let paramsProfileImage;
            //let paramsLogo;
            var base64_profileimage = req.body.profile_image;
            var base64_logo = req.body.logo;

            let salt;
            try {
                salt = await bcrypt.genSalt(10);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            try {
                password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            if (base64_profileimage.search("amazonaws") > 0 && base64_logo.search("amazonaws") > 0) {
                update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), profile_image: req.body.profile_image, website: req.body.website, phone: req.body.phone, password: password, logo: req.body.logo };
            }

            else {

                let paramsProfileImage;
                let paramsLogo;
                let locationProfileImage;
                let locationLogo;
                //console.log(base64_profileimage.search("amazonaws"));
                //console.log(base64_logo.search("amazonaws"));
                if (base64_profileimage.search("amazonaws") == -1) {
                    //console.log('In Profile Image');
                    const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    const type = base64.split(';')[0].split('/')[1];
                    const name = Date.now();
                    paramsProfileImage = {
                        Bucket: config.get("S3_BUCKET") + '/profile_image',
                        Key: `${name}.${type}`,
                        Body: base64Data,
                        ACL: 'public-read',
                        ContentEncoding: 'base64',
                        ContentType: `image/${type}`
                    }

                }
                else {
                    locationProfileImage = base64_profileimage;
                }

                if (base64_logo.search("amazonaws") == -1) {
                    //console.log('In Logo Image');
                    const base64Data2 = new Buffer(base64_logo.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    const type2 = base64_logo.split(';')[0].split('/')[1];
                    paramsLogo = {
                        Bucket: config.get("S3_BUCKET") + '/logo',
                        Key: `${Date.now()}.${type2}`,
                        Body: base64Data2,
                        ACL: 'public-read',
                        ContentEncoding: 'base64',
                        ContentType: `image/${type2}`
                    }

                }
                else {
                    locationLogo = base64_logo;
                }

                /* if (req.body.profile_image) {
                    const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    const type = base64.split(';')[0].split('/')[1];
                    paramsProfileImage = {
                        Bucket: config.get("S3_BUCKET") + '/profile_image',
                        Key: `${Date.now()}.${type}`,
                        Body: base64Data,
                        ACL: 'public-read',
                        ContentEncoding: 'base64',
                        ContentType: `image/${type}`
                    }

                }

                if (req.body.logo) {
                    const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    const type = base64.split(';')[0].split('/')[1];
                    paramsLogo = {
                        Bucket: config.get("S3_BUCKET") + '/logo',
                        Key: `${Date.now()}.${type}`,
                        Body: base64Data,
                        ACL: 'public-read',
                        ContentEncoding: 'base64',
                        ContentType: `image/${type}`
                    }

                } */

                try {
                    //const salt = await bcrypt.genSalt(10);
                    //let locationProfileImage;
                    //let locationLogo;
                    if (paramsProfileImage) {
                        const { Location, Key } = await s3.upload(paramsProfileImage).promise();
                        locationProfileImage = Location;

                        console.log('Profile Image');
                        console.log(Key.split('/')[1]);
                        console.log(Location);
                        // Setup the sendMessage parameter object
                        const params = {
                            MessageBody: JSON.stringify({
                                originalImage: locationProfileImage,
                                imageName: Key.split('/')[1],
                                imageBucket: Key.split('/')[0],
                                userId: req.body._id
                            }),
                            QueueUrl: queueUrl
                        };

                        sqs.sendMessage(params, function (err, data) {
                            if (err) {
                                console.log("Error", err);
                            } else {
                                console.log("Successfully added message", data.MessageId);
                            }
                        });

                    }
                    if (paramsLogo) {
                        const { Location, Key } = await s3.upload(paramsLogo).promise();
                        locationLogo = Location;

                        console.log('Logo');
                        console.log(Key);
                        console.log(Location);
                        // Setup the sendMessage parameter object
                        const params = {
                            MessageBody: JSON.stringify({
                                originalImage: locationLogo,
                                imageName: Key.split('/')[1],
                                imageBucket: Key.split('/')[0],
                                userId: req.body._id
                            }),
                            QueueUrl: queueUrl
                        };

                        sqs.sendMessage(params, function (err, data) {
                            if (err) {
                                console.log("Error", err);
                            } else {
                                console.log("Successfully added message", data.MessageId);
                            }
                        });
                    }
                    //password = await bcrypt.hash(req.body.password, salt);

                    if (locationProfileImage && password && locationLogo) {
                        update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), profile_image: locationProfileImage, website: req.body.website, phone: req.body.phone, password: password, logo: locationLogo };
                    }

                    //console.log(update);
                }
                catch (err) {
                    console.log(err);
                    return res.status(400).send(err);
                }
            }

        }
        else if (req.body.profile_image && req.body.password) {
            //console.log('2');
            var base64 = req.body.profile_image;
            //let password;
            let salt;
            try {
                salt = await bcrypt.genSalt(10);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            try {
                password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }
            if (base64.search("amazonaws") > 0) {
                update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), profile_image: req.body.profile_image, website: req.body.website, phone: req.body.phone, password: password };
            }
            else {
                let paramsProfileImage;
                if (req.body.profile_image) {
                    const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    const type = base64.split(';')[0].split('/')[1];
                    paramsProfileImage = {
                        Bucket: config.get("S3_BUCKET") + '/profile_image',
                        Key: `${Date.now()}.${type}`,
                        Body: base64Data,
                        ACL: 'public-read',
                        ContentEncoding: 'base64',
                        ContentType: `image/${type}`
                    }

                }
                try {
                    //const salt = await bcrypt.genSalt(10);
                    const { Location, Key } = await s3.upload(paramsProfileImage).promise();
                    //password = await bcrypt.hash(req.body.password, salt);
                    if (Location && password) {
                        update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), profile_image: Location, website: req.body.website, phone: req.body.phone, password: password };
                    }
                }
                catch (err) {
                    console.log(err);
                    return res.status(400).send(err);
                }
            }

        }
        else if (req.body.profile_image && req.body.logo) {
            //console.log('3');
            var base64_profileimage = req.body.profile_image;
            var base64_logo = req.body.logo;
            if (base64_profileimage.search("amazonaws") > 0 && base64_logo.search("amazonaws") > 0) {
                update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), profile_image: req.body.profile_image, website: req.body.website, phone: req.body.phone, logo: req.body.logo };
            }
            else {
                let paramsProfileImage;
                let paramsLogo;
                let locationProfileImage;
                let locationLogo;
                //console.log(base64_profileimage.search("amazonaws"));
                //console.log(base64_logo.search("amazonaws"));
                if (base64_profileimage.search("amazonaws") == -1) {
                    //console.log('In Profile Image');
                    const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    const type = base64.split(';')[0].split('/')[1];
                    paramsProfileImage = {
                        Bucket: config.get("S3_BUCKET") + '/profile_image',
                        Key: `${Date.now()}.${type}`,
                        Body: base64Data,
                        ACL: 'public-read',
                        ContentEncoding: 'base64',
                        ContentType: `image/${type}`
                    }

                }
                else {
                    locationProfileImage = base64_profileimage;
                }

                if (base64_logo.search("amazonaws") == -1) {
                    //console.log('In Logo Image');
                    const base64Data2 = new Buffer(base64_logo.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                    const type2 = base64_logo.split(';')[0].split('/')[1];
                    paramsLogo = {
                        Bucket: config.get("S3_BUCKET") + '/logo',
                        Key: `${Date.now()}.${type2}`,
                        Body: base64Data2,
                        ACL: 'public-read',
                        ContentEncoding: 'base64',
                        ContentType: `image/${type2}`
                    }

                }
                else {
                    locationLogo = base64_logo;
                }

                try {
                    const salt = await bcrypt.genSalt(10);

                    if (paramsProfileImage) {
                        const { Location, Key } = await s3.upload(paramsProfileImage).promise();
                        locationProfileImage = Location;
                        //console.log(locationProfileImage);

                        console.log(Key.split('/')[1]);
                        console.log(Key.split('/')[0]);
                        console.log(Location);
                        // Setup the sendMessage parameter object
                        const params = {
                            MessageBody: JSON.stringify({
                                originalImage: locationProfileImage,
                                imageName: Key.split('/')[1],
                                imageBucket: Key.split('/')[0],
                                userId: req.body._id
                            }),
                            QueueUrl: queueUrl
                        };

                        sqs.sendMessage(params, function (err, data) {
                            if (err) {
                                console.log("Error", err);
                            } else {
                                console.log("Successfully added message", data.MessageId);
                            }
                        });
                    }
                    if (paramsLogo) {
                        const { Location, Key } = await s3.upload(paramsLogo).promise();
                        locationLogo = Location;
                        //console.log(locationLogo);
                        console.log(Key.split('/')[1]);
                        console.log(Key.split('/')[0]);
                        console.log(Location);
                        // Setup the sendMessage parameter object
                        const params = {
                            MessageBody: JSON.stringify({
                                originalImage: locationLogo,
                                imageName: Key.split('/')[1],
                                imageBucket: Key.split('/')[0],
                                userId: req.body._id
                            }),
                            QueueUrl: queueUrl
                        };

                        sqs.sendMessage(params, function (err, data) {
                            if (err) {
                                console.log("Error", err);
                            } else {
                                console.log("Successfully added message", data.MessageId);
                            }
                        });
                    }
                    //password = await bcrypt.hash(req.body.password, salt);
                    //console.log(locationProfileImage);
                    //console.log(locationLogo);
                    if (locationProfileImage && locationLogo) {
                        update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), profile_image: locationProfileImage, website: req.body.website, phone: req.body.phone, logo: locationLogo };
                        //console.log(update);
                    }

                }
                catch (err) {
                    console.log(err);
                    return res.status(400).send(err);
                }
            }
        }
        else if (req.body.password && req.body.logo) {
            //console.log('4');
            var base64 = req.body.logo;
            //let password;
            let salt;

            try {
                salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }

            if (base64.search("amazonaws") > 0) {
                update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), logo: req.body.logo, website: req.body.website, phone: req.body.phone, password: password };
            }
            else {
                //let password;
                const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                const type = base64.split(';')[0].split('/')[1];
                const params = {
                    Bucket: config.get("S3_BUCKET") + '/logo',
                    Key: `${Date.now()}.${type}`,
                    Body: base64Data,
                    ACL: 'public-read',
                    ContentEncoding: 'base64',
                    ContentType: `image/${type}`
                }
                try {
                    //const salt = await bcrypt.genSalt(10);
                    const { Location, Key } = await s3.upload(params).promise();
                    //password = await bcrypt.hash(req.body.password, salt);
                    console.log(Key.split('/')[0]);
                    console.log(Key.split('/')[1]);
                    console.log(Location);
                    // Setup the sendMessage parameter object
                    const params = {
                        MessageBody: JSON.stringify({
                            originalImage: locationLogo,
                            imageName: Key.split('/')[1],
                            imageBucket: Key.split('/')[0],
                            userId: req.body._id
                        }),
                        QueueUrl: queueUrl
                    };

                    sqs.sendMessage(params, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                        } else {
                            console.log("Successfully added message", data.MessageId);
                        }
                    });
                    if (Location && password) {
                        update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), logo: Location, website: req.body.website, phone: req.body.phone, password: password };
                    }
                }
                catch (err) {
                    return res.status(400).send(err);
                }
            }
        }
        else if (req.body.profile_image) {
            //console.log('5');
            var base64 = req.body.profile_image;

            if (base64.search("amazonaws") > 0) {
                update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), profile_image: req.body.profile_image, website: req.body.website, phone: req.body.phone };
            }
            else {
                const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                const type = base64.split(';')[0].split('/')[1];
                const params = {
                    Bucket: config.get("S3_BUCKET") + '/profile_image',
                    Key: `${Date.now()}.${type}`,
                    Body: base64Data,
                    ACL: 'public-read',
                    ContentEncoding: 'base64',
                    ContentType: `image/${type}`
                }
                try {
                    const { Location, Key } = await s3.upload(params).promise();

                    console.log(Key.split('/')[0]);
                    console.log(Key.split('/')[1]);
                    console.log(Location);
                    // Setup the sendMessage parameter object
                    console.log('userId: ' + req.body._id);
                    const params = {
                        MessageBody: JSON.stringify({
                            originalImage: locationLogo,
                            imageName: Key.split('/')[1],
                            imageBucket: Key.split('/')[0],
                            userId: req.body._id
                        }),
                        QueueUrl: queueUrl
                    };

                    sqs.sendMessage(params, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                        } else {
                            console.log("Successfully added message", data.MessageId);
                        }
                    });
                    if (Location) {
                        update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), profile_image: Location, website: req.body.website, phone: req.body.phone };
                    }
                }
                catch (err) {
                    return res.status(400).send(err);
                }
            }
        }
        else if (req.body.logo) {
            //console.log('6');
            var base64 = req.body.logo;

            if (base64.search("amazonaws") > 0) {
                update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), logo: req.body.logo, website: req.body.website, phone: req.body.phone };
            }
            else {
                const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                const type = base64.split(';')[0].split('/')[1];
                const params = {
                    Bucket: config.get("S3_BUCKET") + '/logo',
                    Key: `${Date.now()}.${type}`,
                    Body: base64Data,
                    ACL: 'public-read',
                    ContentEncoding: 'base64',
                    ContentType: `image/${type}`
                }
                try {
                    const { Location, Key } = await s3.upload(params).promise();
                    console.log(Key.split('/')[0]);
                    console.log(Key.split('/')[1]);
                    console.log(Location);
                    // Setup the sendMessage parameter object
                    const params = {
                        MessageBody: JSON.stringify({
                            originalImage: locationLogo,
                            imageName: Key.split('/')[1],
                            imageBucket: Key.split('/')[0],
                            userId: req.body._id
                        }),
                        QueueUrl: queueUrl
                    };

                    sqs.sendMessage(params, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                        } else {
                            console.log("Successfully added message", data.MessageId);
                        }
                    });
                    if (Location) {
                        update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), logo: Location, website: req.body.website, phone: req.body.phone };
                    }
                }
                catch (err) {
                    return res.status(400).send(err);
                }
            }
        }
        else if (req.body.password) {
            //console.log('7');

            try {
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(req.body.password, salt);
                update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, password: password, updated: new Date(), website: req.body.website, phone: req.body.phone };

            }
            catch (err) {
                return res.status(400).send(err);
            }
        }
        else {
            //console.log('8');
            update = { firstname: req.body.firstname, lastname: req.body.lastname, default_mls_admin: req.body.default_mls_admin, default_mls_frontend: req.body.default_mls_frontend, companyname: req.body.companyname, updated: new Date(), website: req.body.website, phone: req.body.phone };
        }
    }
    //console.log(update);
    try {
        await User.findOneAndUpdate(query, update);
        res.send({ "message": "User updated", data: user.getSafe() });
    }
    catch (err) {
        return res.status(400).send(err);
    }
};

exports.bulk_upload_members = async (req, res) => {

    var error = '';

    try {
        let imgLogo = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/public/apcri-email-logo.png";

        //const et_access_new_mls = await fs.readFileSync(__dirname + '/../email_templates/access_new_mls.html');
        //const et_create_password_mls = await fs.readFileSync(__dirname + '/../email_templates/create_password.html');
        const et_access_new_mls = await fs.readFileSync(__dirname + '/../email_templates/access_new_mls.html');

        const et_create_password_mls = await fs.readFileSync(__dirname + '/../email_templates/create_password.html');

        const mls_create_password = await fs.readFileSync(__dirname + '/../email_templates/new_mls_and_password.html');

        const array = await csv2().fromFile(req.files.file.path);
        var affectcount = array.length;
        for (let i = 0; i <= array.length; i++) {
            row = array[i];
            //console.log(row)

            if (row) {
                //console.log(row.payer_type);
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (re.test(row.email)) {

                    if (row.subscription_expiry == 'null') {
                        row.subscription_expiry = '';
                    }

                    if (row.subscription_expiry) {
                        var javaScriptRelease = Date.parse(row.subscription_expiry);
                        if (!javaScriptRelease) {
                            row.subscription_expiry = '';
                        }
                    }

                    let user;
                    try {
                        user = await User.findOne({ "email": row.email });

                    } catch (err) {
                        console.log(err); // TypeError: failed to fetch
                    }
                    let newRoleArray = [];

                    let mls_id = req.body.mls_id;
                    let wantsto = req.body.wantsto;
                    let wantstonotify = req.body.wantstonotify;
                    //console.log(mls_id);
                    //console.log(wantsto, wantstonotify);
                    if (user) {

                        user.roles.forEach(function (item) {

                            if (item.role == 'member') {

                                let newRoleAssocArray = [];
                                let matched = false;
                                if (item.association.length > 0) {

                                    item.association.forEach(function (item1) {

                                        if (JSON.stringify(item1.mls_id) == JSON.stringify(mls_id)) {
                                            matched = true;
                                            newRoleAssocArray.push({
                                                "expiry": (row.subscription_expiry) ? row.subscription_expiry : null,
                                                "mls_id": item1.mls_id,
                                                "payer_type_online": row.payer_type
                                            });
                                        }
                                        else {
                                            newRoleAssocArray.push({
                                                "expiry": item1.expiry,
                                                "mls_id": item1.mls_id,
                                                "payer_type_online": item1.payer_type
                                            });
                                        }

                                    });

                                    if (matched == false) {
                                        newRoleAssocArray.push({
                                            "expiry": (row.subscription_expiry) ? row.subscription_expiry : null,
                                            "mls_id": mls_id,
                                            "payer_type_online": row.payer_type
                                        });
                                    }
                                }
                                else {
                                    newRoleAssocArray.push({
                                        "expiry": (row.subscription_expiry) ? row.subscription_expiry : null,
                                        "mls_id": mls_id,
                                        "payer_type_online": row.payer_type
                                    });
                                }

                                newRoleArray.push({
                                    "role": item.role,
                                    "association": newRoleAssocArray
                                });
                            }
                            else {
                                let newRoleAssocArray = [];

                                item.association.forEach(function (item1) {
                                    newRoleAssocArray.push({
                                        "expiry": item1.expiry,
                                        "mls_id": item1.mls_id,
                                        "payer_type_online": item1.payer_type
                                    });
                                });

                                newRoleArray.push({
                                    "role": item.role,
                                    "association": newRoleAssocArray
                                });
                            }

                            //console.log(newRoleArray);

                        });

                        let query = { email: row.email };
                        let update;

                        if (req.body.wantsto && !user.password) {
                            let saltNew;
                            let password;
                            try {
                                saltNew = await bcrypt.genSalt(10);
                                var randomstring = Math.random().toString(36).slice(-8);
                                password = await bcrypt.hash(randomstring, saltNew);
                            } catch (err) {
                                console.log(err); // TypeError: failed to fetch
                            }

                            update = { roles: newRoleArray, password: password, updated: new Date() };
                        }
                        else {
                            update = { roles: newRoleArray, updated: new Date() };
                        }

                        //let update = { roles: newRoleArray, updated: new Date() };

                        let options = { upsert: true, new: true, setDefaultsOnInsert: true };

                        //if(row.market_center){

                        if (user.mls_specific_data) {
                            update['mls_specific_data'] = user.mls_specific_data;
                        }
                        else {
                            update['mls_specific_data'] = {};
                        }

                        //user.mls_specific_data = {};
                        update['mls_specific_data'][mls_id] = {
                            market_center: row.market_center
                        };
                        //}

                        //update['mls_specific_data'][mls_id]['market_centre'] = row.market_centre;
                        try {
                            await User.findOneAndUpdate(query, update, options);

                            if (wantsto == 'true' && wantstonotify == 'true' && !user.password == 'true') {
                                //mls_create_password
                                let filterDatamls = { _id: req.body.mls_id };
                                let mlsData = await Mls.findOne(filterDatamls);

                                const template = handlebars.compile(mls_create_password.toString());
                                const replacements = {
                                    email: user.email,
                                    password: randomstring,
                                    mlsName: mlsData.name,
                                    site_url: config.get("SITE_URL"),
                                    imgLogo: imgLogo
                                };

                                const htmlToSend = template(replacements);

                                const mailOptions = {
                                    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                                    to: user.email,
                                    //cc:'ankit@tatrasdata.com',
                                    subject: 'cmaIQ',
                                    html: htmlToSend,
                                };

                                try {
                                    await transporter.sendMail(mailOptions);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                            else if (wantsto == 'true' && !user.password) {

                                //console.log(req.body.email);
                                //let filterDatamls = { _id: req.body.mls_id };
                                //let mlsData = await Mls.findOne(filterDatamls);

                                const template = handlebars.compile(et_create_password_mls.toString());
                                const replacements = {
                                    email: user.email,
                                    password: randomstring,
                                    //mlsName: mlsData.name,
                                    site_url: config.get("SITE_URL"),
                                    imgLogo: imgLogo
                                };

                                const htmlToSend = template(replacements);

                                const mailOptions = {
                                    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                                    to: user.email,
                                    //cc:'ankit@tatrasdata.com',
                                    subject: 'cmaIQ',
                                    html: htmlToSend,
                                };

                                try {
                                    await transporter.sendMail(mailOptions);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                            else if (wantstonotify == 'true') {

                                //console.log(req.body.email);

                                let filterDatamls = { _id: req.body.mls_id };
                                let mlsData;
                                try {
                                    mlsData = await Mls.findOne(filterDatamls);

                                } catch (err) {
                                    console.log(err); // TypeError: failed to fetch
                                }

                                const template = handlebars.compile(et_access_new_mls.toString());
                                const replacements = {
                                    email: user.email,
                                    //password: randomstring,
                                    mlsName: mlsData.name,
                                    site_url: config.get("SITE_URL"),
                                    imgLogo: imgLogo
                                };

                                const htmlToSend = template(replacements);
                                // const emailId = et_access_new_mls.toString().replace('{{email}}', user.email);
                                // const html = emailId.replace('{{site_url}}', config.get("SITE_URL"));
                                // const htmlToSend = html.replace('{{mlsName}}', mlsData.name);
                                const mailOptions = {
                                    //cc: 'ankit@tatrasdata.com',
                                    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                                    to: user.email,
                                    subject: 'cmaIQ',
                                    html: htmlToSend,
                                };

                                try {
                                    await transporter.sendMail(mailOptions);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                            else {
                                console.log('no notification selected.')
                            }

                            //affectcount++;
                        }
                        catch (e) {
                            error = error + ', ' + row.email;
                            affectcount--;
                            console.log(e);
                        }
                    }
                    else {

                        user = new User(_.pick(row.email, ['email']));

                        user.email = row.email;
                        user.firstname = row.firstname;
                        user.lastname = row.lastname;

                        //console.log(row.market_centre);
                        if (row.market_center) {
                            user.mls_specific_data = {};
                            user.mls_specific_data[mls_id] = {
                                market_center: row.market_center
                            };
                        }

                        user.is_registered = false;

                        if (wantsto == 'true') {
                            let saltNew;
                            try {
                                saltNew = await bcrypt.genSalt(10);
                                var randomstring = Math.random().toString(36).slice(-8);
                                user.password = await bcrypt.hash(randomstring, saltNew);

                            } catch (err) {
                                console.log(err); // TypeError: failed to fetch
                            }

                        }

                        user.username = '_' + Math.random().toString(36).substr(2, 9);
                        user.roles = [{
                            role: "member",
                            association: [{
                                mls_id: mls_id,
                                expiry: (row.subscription_expiry) ? row.subscription_expiry : null,
                                payer_type_online: row.payer_type
                            }]
                        }];

                        //console.log(user.roles);

                        try {
                            await user.save({ validateBeforeSave: false });

                            // if (wantsto == 'true' && wantstonotify == 'true') {
                            //     //console.log('both');
                            //     //mls_create_password
                            //     let filterDatamls = { _id: req.body.mls_id };
                            //     let mlsData = await Mls.findOne(filterDatamls);
                            //
                            //     const template = handlebars.compile(mls_create_password.toString());
                            //     const replacements = {
                            //         email: user.email,
                            //         password: randomstring,
                            //         mlsName: mlsData.name,
                            //         site_url: config.get("SITE_URL"),
                            //         imgLogo: imgLogo
                            //     };
                            //
                            //     const htmlToSend = template(replacements);
                            //
                            //     const mailOptions = {
                            //         from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                            //         to: user.email,
                            //         //cc:'ankit@tatrasdata.com',
                            //         subject: 'cmaIQ',
                            //         html: htmlToSend,
                            //     };
                            //
                            //     try {
                            //         await transporter.sendMail(mailOptions);
                            //     }
                            //     catch (err) {
                            //         console.log(err);
                            //     }
                            // }
                             if (wantsto == 'true') {

                                //console.log('both1');
                                //console.log(req.body.email);
                                ///let filterDatamls = { _id: req.body.mls_id };
                                //let mlsData = await Mls.findOne(filterDatamls);

                                const template = handlebars.compile(et_create_password_mls.toString());
                                const replacements = {
                                    email: user.email,
                                    password: randomstring,
                                    //mlsName: mlsData.name,
                                    site_url: config.get("SITE_URL"),
                                    imgLogo: imgLogo
                                };

                                const htmlToSend = template(replacements);

                                const mailOptions = {
                                    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                                    to: user.email,
                                    //cc:'ankit@tatrasdata.com',
                                    subject: 'cmaIQ',
                                    html: htmlToSend,
                                };

                                try {
                                    await transporter.sendMail(mailOptions);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                             if (wantstonotify == 'true') {
                                //console.log('both2');
                                //console.log(user.email);

                                let filterDatamls = { _id: req.body.mls_id };
                                let mlsData;
                                try {
                                    mlsData = await Mls.findOne(filterDatamls);
                                } catch (err) {
                                    console.log(err); // TypeError: failed to fetch
                                }
                                const template = handlebars.compile(et_access_new_mls.toString());
                                const replacements = {
                                    email: user.email,
                                    //password: randomstring,
                                    mlsName: mlsData.name,
                                    site_url: config.get("SITE_URL"),
                                    imgLogo: imgLogo
                                };

                                const htmlToSend = template(replacements);
                                // const emailId = et_access_new_mls.toString().replace('{{email}}', user.email);
                                // const html = emailId.replace('{{site_url}}', config.get("SITE_URL"));
                                // const htmlToSend = html.replace('{{mlsName}}', mlsData.name);
                                const mailOptions = {
                                    //cc: 'ankit@tatrasdata.com',
                                    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                                    to: user.email,
                                    subject: 'cmaIQ',
                                    html: htmlToSend,
                                };

                                try {
                                    await transporter.sendMail(mailOptions);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                            else {
                                console.log('no notification selected.')
                            }
                            //affectcount++;
                        }
                        catch (e) {
                            error = error + ', ' + row.email;
                            affectcount--;
                            console.log(e);
                        }

                    }

                }
                else {

                    error = error + ', ' + row.email;
                    affectcount--;
                }

            }
        }

        try {
            fs.unlinkSync(req.files.file.path)
        } catch (err) {
            console.error(err)
        }

        res.send({ "message": "User updated", "count": array.length, "error": error, "affectcount": affectcount });

    }
    catch (e) {
        console.error(e)
        res.send({ "err": e });
    }

};

exports.bulk_remove_members = async (req, res) => {
    var error = '';
    try {
        const array = await csv2().fromFile(req.files.file.path);
        //console.log(array);
        var affectcount = 0;
        for (let i = 0; i <= array.length; i++) {
            row = array[i];
            //console.log(row)
            if (row) {

                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (re.test(row.email)) {

                    let users = await User.findOne({ "email": row.email });

                    let newRoleArray = [];

                    let mls_id = req.body.mls_id;

                    if (users) {

                        //console.log(JSON.stringify(users.roles));

                        users.roles.forEach(function (item) {

                            if (item.role == 'member') {

                                let newRoleAssocArray = [];
                                //console.log(JSON.stringify(item.association));
                                item.association.forEach(function (item2) {
                                    if (JSON.stringify(item2.mls_id) == JSON.stringify(mls_id)) {
                                        //console.log(item2);
                                        affectcount++;
                                    }
                                    else {
                                        newRoleAssocArray.push({
                                            "expiry": item2.expiry,
                                            "mls_id": item2.mls_id
                                        });
                                    }
                                });

                                newRoleArray.push({
                                    "role": item.role,
                                    "association": newRoleAssocArray
                                });
                            }
                            else {
                                let newRoleAssocArray = [];

                                item.association.forEach(function (item1, index1) {
                                    newRoleAssocArray.push({
                                        "expiry": item1.expiry,
                                        "mls_id": item1.mls_id
                                    });
                                });

                                newRoleArray.push({
                                    "role": item.role,
                                    "association": newRoleAssocArray
                                });
                            }
                        });

                        //console.log(JSON.stringify(newRoleArray));

                        //console.log( _.isEqual(users.roles, newRoleArray) );

                        let query = { email: row.email };
                        let update = { roles: newRoleArray, updated: new Date() };
                        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
                        try {
                            await User.findOneAndUpdate(query, update, options);

                        }
                        catch (e) {
                            error = error + ', ' + row.email;
                            //affectcount--;
                        }

                    }
                    else {

                        //affectcount--;
                    }


                }
                else {
                    error = error + ', ' + row.email;
                    //affectcount--;
                }

            }
        }

        try {
            fs.unlinkSync(req.files.file.path)
        } catch (err) {
            console.error(err)
        }

        res.send({ "message": "User updated", "count": array.length, "affectcount": affectcount, "error": error });
    }
    catch (err) {
        console.log('error');
        res.send({ "error": err });
    }

};

exports.add_news = async (req, res) => {

    //console.log(req.body);

    const schema = {
        title: Joi.string().required(),
        content: Joi.string().required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }

    news = new News(_.pick(req.body, ['title', 'content']));

    try {
        await news.save();
    } catch (err) {
        return res.status(400).send(err);
    }

    res.send({ "message": "News added" });

};

exports.get_news = async (req, res) => {
    News.find({}, function (err, users) {
        var userMap = [];

        users.forEach(function (user) {
            userMap.push(user);
        });

        res.send(userMap);
    });
};

exports.get_news_by_id = async (req, res) => {
    let Id;
    let filters;
    let news;
    try {
        Id = await req.params.id;
        filters = { _id: Id };
        news = await News.findOne(filters);
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    return res.send({ data: news });
};


exports.edit_news = async (req, res) => {

    //console.log(req.body);

    const schema = {
        _id: Joi.string().required(),
        title: Joi.string().required(),
        content: Joi.string().required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }

    try {
        let query = {
            "_id": req.body._id
        };
        let update = {
            "title": req.body.title,
            "content": req.body.content,
            updated: new Date()
        };
        let options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
        await News.findOneAndUpdate(query, update, options);
        res.send({ "message": "News Updated" });
    } catch (err) {
        return res.status(400).send(err);
    }

};

exports.delete_news = async (req, res) => {
    try {
        const schema = {
            id: Joi.string().required()
        };

        const result = Joi.validate(req.body, schema);
        //console.log(result.error);
        if (result.error) {
            return res.status(400).send({ message: result.error.details[0].message });
        }

        let query = { _id: req.body.id };
        // let update = { updated: new Date() };
        //let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        let news = await News.findOneAndDelete(query);
        //console.log(mlss);
        res.send({ "message": "News deleted" });
    }
    catch (e) {
        console.log(e);
    }
    //return res.send({data: update.roles,data2: users.roles});
};
