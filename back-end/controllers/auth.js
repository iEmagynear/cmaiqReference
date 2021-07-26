const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const cryptoRandomString = require('crypto-random-string');
const nodeMailer = require('nodemailer');
const uuidv1 = require('uuid/v1');
var rclient = require('../redis');
var request = require('request');
const { Mls } = require("../models/mls");
var handlebars = require('handlebars');
const fs = require('fs');
const _ = require('lodash');

exports.login = async (req, res) => {

  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required()
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    console.log(result.error);
    return res.status(400).send({ message: result.error.details[0] });
  }

  let user;

  try {
    user = await User.findOne({ "email": req.body.email },'_id firstname lastname email password roles default_mls_admin toa_Check default_mls_frontend companyname mls_specific_data eula_Check is_Agree');
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (!user) {

    //user = await User.findOne({"username": req.body.email});

    //if(!user) {
    console.log('Invalid email or password');
    return res.status(400).send({ message: "Email and password combination not found. Please try again." });
    //}

    //return res.status(400).send({message: "Invalid email or password"});
  }

  if (user.password) {
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(req.body.password, user.password);
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
    if (!isValidPassword) {
      console.log("Invalid email or password");
      return res.status(400).send({ message: "Email and password combination not found. Please try again." });
    }
  }
  else {
    console.log("Invalid email or password");
    return res.status(400).send({ message: "Email and password combination not found. Please try again." });
  }


  const uuid = uuidv1();

  //console.log(uuidv);

  const token = user.generateAuthToken(uuid);

  //rclient.flushall();

  /* const value = await rclient.get(user._id.toString());

  if(value){

  } */

  try {
    await rclient.set(user._id.toString(), uuid);
  }
  catch (e) {
    console.log(e);
    // should break here, but doesn't (only while APM is loaded)
  }
  let mlsData;
  let mlsIsupload;
  try {
    if (user.default_mls_frontend) {
      //console.log(user);
      //console.log(user.default_mls_frontend);
      mlsData = await Mls.findOne({ name: user.default_mls_frontend }).select({ enableCSVUpload: 1 });
      if (mlsData) {
        mlsIsupload = mlsData.enableCSVUpload;
      }
      else {
        mlsIsupload = 'false';
      }
    }
    else
      mlsIsupload = 'false';
  } catch (error) {
    console.log(error);
  }
  if (!user.isAgree) is_Agree = true;

  //if (!user.eulaAgree) eula_Agree = true;

  //if (!user.toaAgree) toa_Agree = true;

  //await User.findByIdAndUpdate({ _id: user._id }, { is_Agree: is_Agree, updated: Date.now() });
  //console.log(user.password);
  user['password'] = undefined;
  //delete user.password;
  //user['password']
  //console.log(user.password);

  res.send({ "message": "User found", data: user, "token": token, "f_mls_isupload": mlsIsupload });

};

exports.sociallogin= async (req, res) => {

    //return res.send(req.body.token);
    var uri;
    var headers = {};
    if(req.body.socialPlatform == 'google'){
      uri= 'https://www.googleapis.com/oauth2/v2/userinfo';
      headers = {
        'Authorization': 'Bearer '+req.body.token,
        'Content-Type': 'application/json'
      }
    }
    else if(req.body.socialPlatform == 'facebook'){
      uri= 'https://graph.facebook.com/v9.0/me?fields=id,name,email&access_token='+req.body.token;
    }

    request({
      uri: uri,
      //body: serial,
      method: 'get',
      headers: headers,
    }, async function (err, re, body) {
  
      if (err) {
        console.log(err);
        //res.send(err);
      }
      if (re) {

        var parsebody = JSON.parse(body);

        let fullname = parsebody.name.split(' ');

        //const parsedUser = '_' + Math.random().toString(36).substr(2, 9);;
        const parsedPass = fullname[0] + fullname[1] + parsebody.id;

        const ssobodylogin = {
          email: parsebody.email,
          password: parsedPass
        };

        //console.log(ssobodylogin);
        let userGet;

        try {
          userGet = await User.findOne({ "email": ssobodylogin.email },'_id firstname lastname email password roles default_mls_admin toa_Check default_mls_frontend companyname mls_specific_data eula_Check is_Agree');

        } catch (err) {
          console.log(err); // TypeError: failed to fetch
        }

        if (!userGet) {

          return res.status(400).send( { "message":"new user" } );

        }
        else {
            //console.log(userGet._id);

            const uuid = uuidv1() + '-' + Math.random();
            
            const token = userGet.generateAuthToken(uuid);

            try {
              await rclient.set(userGet._id.toString(), uuid);
            }
            catch (e) {
              console.log(e);
            }

            userGet['password'] = undefined;
            //delete userGet['password'];

            res.send({ "message": "User found", data: userGet, "token": token });

        }
        
      }
  
    });

};

// Disclaimer Agree
exports.agree = async (req, res) => {
  const schema = {
    isAgree: Joi.boolean().default(false)
  };

  const result = Joi.validate(req.body.isAgree, schema);
  let finalresult;
  let status;
  if (result.error) {
    console.log(result.error);
    return res.status(400).send({ message: result.error.details[0] });
  }
  try {
    await User.findByIdAndUpdate({ _id: req.body._id }, { is_Agree: req.body.is_Agree, updated: Date.now() });

    status = 200;
    finalresult = {
      isAgree: `success`
    };
    return res.status(200).send(finalresult);
  }
  catch (err) {
    status = 401;

    finalresult = {
      error: `Authentication error..`
    };
    return res.status(401).send(finalresult);
  }

};

// Eula Agree
exports.eulaAgree = async (req, res) => {
  const schema = {
    eulaAgree: Joi.boolean().default(false)
  };

  const result = Joi.validate(req.body.eulaAgree, schema);
  let finalresult;
  let status;
  if (result.error) {
    console.log(result.error);
    return res.status(400).send({ message: result.error.details[0] });
  }
  try {
    await User.findByIdAndUpdate({ _id: req.body._id }, { eula_Check: req.body.eula_Agree, updated: Date.now() });

    status = 200;
    finalresult = {
      eulaAgree: `success`
    };
    return res.status(200).send(finalresult);
  }
  catch (err) {
    status = 401;

    finalresult = {
      error: `Authentication error..`
    };
    return res.status(401).send(finalresult);
  }

};

// TOA Agree
exports.toaAgree = async (req, res) => {
  const schema = {
    toaAgree: Joi.boolean().default(false)
  };

  const result = Joi.validate(req.body.toaAgree, schema);
  let finalresult;
  let status;
  if (result.error) {
    console.log(result.error);
    return res.status(400).send({ message: result.error.details[0] });
  }
  try {
    await User.findByIdAndUpdate({ _id: req.body._id }, { toa_Check: req.body.toa_Agree, updated: Date.now() });

    status = 200;
    finalresult = {
      toaAgree: `success`
    };
    return res.status(200).send(finalresult);
  }
  catch (err) {
    status = 401;

    finalresult = {
      error: `Authentication error..`
    };
    return res.status(401).send(finalresult);
  }

};

exports.verifytoken = async (req, res) => {

  const authorizationHeaader = req.headers.authorization;
  let result;
  let status;

  if (authorizationHeaader) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      //console.log('in')
      result = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
      //console.log(result)
      //req.decoded = result;
      if (result) {
        status = 200;
        result = {
          success: `Authentication success`
        };
      }
      else {
        status = 401;

        result = {
          error: `Authentication error. Token required.`
        };
      }

    } catch (err) {
      status = 401;

      result = {
        error: `Authentication error. Token required.`
      };
    }
  } else {

    result = {
      error: `Authentication error. Token required.`
    };
  }

  res.status(status).send(result);

};

exports.forgotpassword = async (req, res) => {

  //res.send(req.body);
  const schema = {
    email: Joi.string().email().required()
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    //console.log(result.error);
    return res.status(400).send({ message: result.error.details[0] });
  }
  let user;
  try {
    user = await User.findOne({ "email": req.body.email });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (!user) {
    //console.log('Invalid email.');
    //return res.status(400).send({message: "Invalid email."});
    return res.send({ message: 'An email will be sent with instructions if user exists, Kindly check your email.' });
  }

  let token;
  //console.log(user);
  try {
    token = await cryptoRandomString({ length: 20, type: 'url-safe' });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  try {
    await User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true, setDefaultsOnInsert: true });
  } catch (err) {
    return res.status(400).send(err);
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
  try {
    const et_forgot_password = await fs.readFileSync(__dirname + '/../email_templates/forgot_password.html');
    const template = handlebars.compile(et_forgot_password.toString());
    const replacements = {
      email: user.email,
      link: config.get("SITE_URL") + 'reset-password?token=' + token,
      site_url: config.get("SITE_URL")
    };
    const htmlToSend = template(replacements);

    const mailOptions = {
      from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
      to: user.email,
      //cc:'ankit@tatrasdata.com',
      subject: 'Password Reset Instructions',
      html: htmlToSend,
    };


    await transporter.sendMail(mailOptions);

  }
  catch (err) {
    return res.status(400).send(err);
  }
  return res.send({ message: 'An email will be sent with instructions, Kindly check your email.' });

};

exports.reset_password = async (req, res) => {

  //res.send(req.body);
  const schema = {
    newpassword: Joi.string().required(),
    confirmpassword: Joi.string().required(),
    token: Joi.string().required()
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    //console.log(result.error);
    return res.status(400).send({ message: result.error.details[0] });
  }

  let user;
  try {
    user = await User.findOne({
      reset_password_token: req.body.token,
      reset_password_expires: {
        $gt: Date.now()
      }
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (!user) {
    //console.log('Invalid email.');
    return res.status(400).send({ message: "Password reset token is invalid or has expired." });
  }

  if (req.body.newpassword === req.body.confirmpassword) {
    //user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
    let saltNew;
    try {
      saltNew = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newpassword, saltNew);
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }

    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    user.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: err
        });
      } else {

        return res.send({ message: 'Password reset successfully. Redirecting to login page...' });

      }
    });
  } else {
    return res.status(422).send({
      message: 'Passwords do not match.'
    });
  }

};

exports.get_exchange_price = async (req, res) => {

  let value;

  try {
    value = await rclient.get('currencies');

  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  res.send({ 'currencies': JSON.parse(value) });

}
