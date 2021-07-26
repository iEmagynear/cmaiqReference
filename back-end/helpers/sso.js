const { User } = require("../models/user");
const _ = require('lodash');
const bcrypt = require('bcrypt');
var rclient = require('../redis');
//var ssorclient = require('../ssoredis');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const { Mls } = require("../models/mls");

exports.checkUserDetails = async function (finalSamlObj) {
    //return finalSamlObj;
    //console.log(finalSamlObj);

    const parsedUser = finalSamlObj.mlsName + '-' + finalSamlObj.loginid;
    const parsedPass = finalSamlObj.FirstName + finalSamlObj.LastName + finalSamlObj.mlsName;

    const ssobodylogin = {
        email: finalSamlObj.Email,
        password: parsedPass
    };

    //console.log(ssobodylogin);
    let userGet;

    try {
        userGet = await User.findOne({ "email": ssobodylogin.email });

    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    if (!userGet) {
        //console.log(finalSamlObj.mlsName);
        const ssobodysignup = {
            'username': parsedUser,
            'email': finalSamlObj.Email,
            'password': parsedPass,
            'firstname': finalSamlObj.FirstName,
            'lastname': finalSamlObj.LastName,
            'companyname': finalSamlObj.mlsName,
            'third_party_login': true
        };

        let username = null;

        if (ssobodysignup.username) {
            username = ssobodysignup.username;
        } else {
            username = '_' + Math.random().toString(36).substr(2, 9);
        }
        let user = new User(_.pick(ssobodysignup, ['email', 'password', 'firstname', 'lastname', 'companyname', 'third_party_login']));
        let salt;
        try {
            salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
        user.username = username;
        user.roles = [{
            role: "member"
        }];

        //console.log(user);
        try {
            await user.save();
            //console.log(user._id);
            const uuid = uuidv1() + '-' + Math.random();

            await rclient.set(uuid, user._id.toString());
            //const value = await rclient.get(uuid);
            let Mlsbody;

            if (finalSamlObj.mlsName === "IMLS") {
                //IMLS Body
                Mlsbody = {
                    'mls_id': '5d846e8de3b0d50d6ac91a2d',
                    'firstname': finalSamlObj.FirstName,
                    'lastname': finalSamlObj.LastName,
                    'email': finalSamlObj.Email,
                    'expiry': null,
                    'wantsto': null,
                    'wantstonotify': null,
                    'market_center': 'Clareity ' + finalSamlObj.Email,
                    'payer_type_online': 'Offline'
                };


            } else {
                // Beaches Body
                Mlsbody = {
                    'mls_id': '5d846e8de3b0d50d6ac919ec',
                    'firstname': finalSamlObj.FirstName,
                    'lastname': finalSamlObj.LastName,
                    'email': finalSamlObj.Email,
                    'expiry': null,
                    'wantsto': null,
                    'wantstonotify': null,
                    'market_center': 'Clareity ' + finalSamlObj.Email,
                    'payer_type_online': 'Offline'
                };

            }

            let et_access_new_mls;
            let et_create_password_mls;
            let mls_create_password;
            let userMls;

            try {
                et_access_new_mls = await fs.readFileSync(__dirname + '/../email_templates/access_new_mls.html');

                et_create_password_mls = await fs.readFileSync(__dirname + '/../email_templates/create_password.html');

                mls_create_password = await fs.readFileSync(__dirname + '/../email_templates/new_mls_and_password.html');

                userMls = await User.findOne({ "email": Mlsbody.email });

            } catch (err) {
                console.log(err); // TypeError: failed to fetch
            }

            let newRoleArray = [];
            //console.log(userMls);

            let mls_id = Mlsbody.mls_id;

            if (userMls) {

                userMls.roles.forEach(function (item) {

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
                                        "expiry": (Mlsbody.expiry) ? Mlsbody.expiry : null,
                                        "mls_id": item1.mls_id,
                                        "payer_type_online": (Mlsbody.payer_type_online) ? Mlsbody.payer_type_online : null
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
                                    "expiry": (Mlsbody.expiry) ? Mlsbody.expiry : null,
                                    "mls_id": mls_id,
                                    "payer_type_online": (Mlsbody.payer_type_online) ? Mlsbody.payer_type_online : null
                                });
                            }

                        }
                        else {
                            //console.log('else2');
                            newRoleAssocArray.push({
                                "expiry": (Mlsbody.expiry) ? Mlsbody.expiry : null,
                                "mls_id": mls_id,
                                "payer_type_online": (Mlsbody.payer_type_online) ? Mlsbody.payer_type_online : null
                            });
                        }

                        //console.log(newRoleAssocArray);

                        newRoleArray.push({
                            "role": item.role,
                            "association": newRoleAssocArray
                        });

                    }
                    else {
                        console.log('else3');
                        console.log(userMls.roles)
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
                    console.log(newRoleArray[i].role);
                    if (newRoleArray[i].role == 'member') {
                        checkmember = true;
                    }

                }
                if (!checkmember) {

                    newRoleArray.unshift({
                        role: "member",
                        association: [{
                            mls_id: mls_id,
                            payer_type_online: (Mlsbody.payer_type_online) ? Mlsbody.payer_type_online : null,
                            expiry: (Mlsbody.expiry) ? Mlsbody.expiry : null,
                        }]
                    });

                }


                let update;

                if (Mlsbody.wantsto && !userMls.password) {

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

                let query = { email: Mlsbody.email };

                let options = { upsert: true, new: true, setDefaultsOnInsert: true };

                //if(Mlsbody.market_center){

                if (userMls.mls_specific_data) {
                    update['mls_specific_data'] = userMls.mls_specific_data;
                }
                else {
                    update['mls_specific_data'] = {};
                }

                //userMls.mls_specific_data = {};
                update['mls_specific_data'][mls_id] = {
                    market_center: Mlsbody.market_center
                };
                //}
                //console.log(query);
                //console.log(update);


                try {
                    await User.findOneAndUpdate(query, update, options);
                } catch (err) {
                    console.log(err); // TypeError: failed to fetch
                }
                if (Mlsbody.wantsto && Mlsbody.wantstonotify && !userMls.password) {
                    //mls_create_password
                    let filterDatamls = { _id: Mlsbody.mls_id };
                    let mlsData;
                    try {
                        mlsData = await Mls.findOne(filterDatamls);
                    } catch (err) {
                        console.log(err); // TypeError: failed to fetch
                    }
                    const template = handlebars.compile(mls_create_password.toString());
                    const replacements = {
                        email: Mlsbody.email,
                        password: randomstring,
                        mlsName: mlsData.name,
                        site_url: config.get("SITE_URL")
                    };

                    const htmlToSend = template(replacements);

                    const mailOptions = {
                        from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                        to: Mlsbody.email,
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
                else if (Mlsbody.wantsto && !userMls.password) {

                    //console.log(Mlsbody.email);
                    //let filterDatamls = { _id: Mlsbody.mls_id };
                    //let mlsData = await Mls.findOne(filterDatamls);

                    const template = handlebars.compile(et_create_password_mls.toString());
                    const replacements = {
                        email: Mlsbody.email,
                        password: randomstring,
                        //mlsName: mlsData.name,
                        site_url: config.get("SITE_URL")
                    };

                    const htmlToSend = template(replacements);

                    const mailOptions = {
                        from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                        to: Mlsbody.email,
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
                else if (Mlsbody.wantstonotify) {

                    console.log(Mlsbody.email);

                    let filterDatamls = { _id: Mlsbody.mls_id };
                    let mlsData;
                    try {
                        mlsData = await Mls.findOne(filterDatamls);
                    } catch (err) {
                        console.log(err); // TypeError: failed to fetch
                    }
                    const emailId = et_access_new_mls.toString().replace('{{email}}', Mlsbody.email);
                    const html = emailId.replace('{{site_url}}', config.get("SITE_URL"));
                    const htmlToSend = html.replace('{{mlsName}}', mlsData.name);
                    const mailOptions = {
                        //cc: 'ankit@tatrasdata.com',
                        from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                        to: Mlsbody.email,
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

                userMlsEmail = new User(_.pick(Mlsbody, ['email']));

                if (Mlsbody.firstname) {
                    userMlsEmail.firstname = Mlsbody.firstname;
                }

                if (Mlsbody.lastname) {
                    userMlsEmail.lastname = Mlsbody.lastname;
                }

                var payer_type_online = (Mlsbody.payer_type_online) ? Mlsbody.payer_type_online : false;

                userMlsEmail.is_registered = false;

                if (Mlsbody.wantsto) {
                    let saltNew;
                    try {
                        saltNew = await bcrypt.genSalt(10);
                    } catch (err) {
                        console.log(err); // TypeError: failed to fetch
                    }
                    var randomstring = Math.random().toString(36).slice(-8);
                    try {
                        userMlsEmail.password = await bcrypt.hash(randomstring, saltNew);
                    } catch (err) {
                        console.log(err); // TypeError: failed to fetch
                    }
                }

                userMlsEmail.username = '_' + Math.random().toString(36).substr(2, 9);

                userMlsEmail.roles = [{
                    role: "member",
                    association: [{
                        mls_id: mls_id,
                        payer_type_online: payer_type_online,
                        expiry: (Mlsbody.expiry) ? Mlsbody.expiry : null,
                    }]
                }];

                if (Mlsbody.market_center) {
                    userMlsEmail.mls_specific_data = {};
                    userMlsEmail.mls_specific_data[mls_id] = {
                        market_center: Mlsbody.market_center
                    };
                }

                //console.log(user);
                try {
                    await userMlsEmail.save({ validateBeforeSave: false });

                    if (Mlsbody.wantsto && Mlsbody.wantstonotify) {
                        //mls_create_password
                        let filterDatamls = { _id: Mlsbody.mls_id };
                        let mlsData = await Mls.findOne(filterDatamls);

                        const template = handlebars.compile(mls_create_password.toString());
                        const replacements = {
                            email: Mlsbody.email,
                            password: randomstring,
                            mlsName: mlsData.name,
                            site_url: config.get("SITE_URL")
                        };

                        const htmlToSend = template(replacements);

                        const mailOptions = {
                            from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                            to: Mlsbody.email,
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

                    if (Mlsbody.wantsto) {

                        //console.log(Mlsbody.email);
                        //let filterDatamls = { _id: Mlsbody.mls_id };
                        //let mlsData = await Mls.findOne(filterDatamls);

                        const template = handlebars.compile(et_create_password_mls.toString());
                        const replacements = {
                            email: Mlsbody.email,
                            password: randomstring,
                            //mlsName: mlsData.name,
                            site_url: config.get("SITE_URL")
                        };

                        const htmlToSend = template(replacements);

                        const mailOptions = {
                            from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                            to: Mlsbody.email,
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

                    if (Mlsbody.wantstonotify) {

                        console.log(Mlsbody.email);

                        let filterDatamls = { _id: Mlsbody.mls_id };
                        let mlsData;

                        try {
                            mlsData = await Mls.findOne(filterDatamls);
                        } catch (err) {
                            console.log(err); // TypeError: failed to fetch
                        }
                        const emailId = et_access_new_mls.toString().replace('{{email}}', Mlsbody.email);
                        const html = emailId.replace('{{site_url}}', config.get("SITE_URL"));
                        const htmlToSend = html.replace('{{mlsName}}', mlsData.name);
                        const mailOptions = {
                            //cc: 'ankit@tatrasdata.com',
                            from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                            to: Mlsbody.email,
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
                    //return res.status(400).send(err);
                    console.log(err);
                }

            }

            //res.send({ "message": "User updated", newRoleArray: newRoleArray, data: user.getSafe() });

            return uuid;
        } catch (err) {
            //return res.status(400).send(err);
            console.log(err);

        }

    }
    else {
        //console.log(userGet._id);

        const uuid = uuidv1() + '-' + Math.random();
        //console.log(uuid);

        try {
            await rclient.set(uuid, userGet._id.toString());
            await rclient.expireat(uuid, parseInt((+new Date) / 1000) + 86400);
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }
        return uuid;
        //const value = await rclient.get(uuid);
    }

};

exports.UserLogin = async function (request) {

    console.log(request);

    let userId;

    try {
        userId = await rclient.get(request.ssotoken);
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }

    if (userId) {

        let user;

        try {
            user = await User.findOne({
                "_id": userId
            });
        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }

        const uuid = uuidv1();

        const token = user.generateAuthToken(uuid);

        try {
            await rclient.set(user._id.toString(), uuid);

        } catch (err) {
            console.log(err); // TypeError: failed to fetch
        }

        if (!user.isAgree) is_Agree = true;

        rclient.del(request.ssotoken);

        return ({ "message": "User found", data: user, "token": token });
    }
    else {
        //console.log('qwdqwqwd');
        return ({ status: 400, message: "Invalid Token Detected" });
    }
};