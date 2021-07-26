const Joi = require("joi");
const _ = require('lodash');
const {
  User
} = require("../models/user");
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const config = require("config");
const fs = require('fs');
const {
  Mls
} = require("../models/mls");
const uuidv1 = require('uuid/v1');
var rclient = require('../redis');
var handlebars = require('handlebars');

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

exports.signup = async (req, res) => {

  //console.log(req.body);

  const schema = {
    mls: Joi.array().items(),
    username: Joi.string().max(80),
    email: Joi.string().email().required().max(255),
    password: Joi.string().required().min(6).max(30),
    firstname: Joi.string().required().max(80),
    lastname: Joi.string().required().max(80),
    companyname: Joi.string().required().max(200),
    //avatar: Joi.object()
  };

  const result = Joi.validate(req.body, schema);

  //console.log(result.error);

  if (result.error) {
    return res.status(400).send({
      message: result.error.details[0].message
    });
  }

  /* let username = await User.findOne({"username": req.body.username});
  if(username) {
    return res.status(400).send({message: "Username already registered."});
  } */
  let useremail;
  try {
    useremail = await User.findOne({
      "email": req.body.email
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  //console.log(useremail.is_registered);
  const uuid = uuidv1();

  if (useremail) {
    if (useremail.is_registered) {
      return res.status(400).send({
        message: "Email already registered."
      });
    } else {

      let query = {
        email: req.body.email
      };

      let saltNew;
      try {
        saltNew = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, saltNew);

      } catch (err) {
        console.log(err); // TypeError: failed to fetch
      }

      let username = null;
      if (req.body.username) {
        username = req.body.username;
      } else {
        username = '_' + Math.random().toString(36).substr(2, 9);
      }

      let update = {
        username: username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        companyname: req.body.companyname,
        is_registered: true,
        updated: new Date()
      };

      //let options = { upsert: true, new: true, setDefaultsOnInsert: true };

      try {
        await User.updateOne(query, update);
      } catch (err) {
        return res.status(400).send(err);
      }

      const token = useremail.generateAuthToken(uuid);
      //res.send({"token": token});
      let getSafe = useremail.getSafe();
      //console.log(getSafe);
      try {
        await rclient.set(getSafe._id.toString(), uuid);

      } catch (err) {
        console.log(err); // TypeError: failed to fetch
      }
      return res.send({
        "message": "User created",
        data: getSafe,
        "token": token
      });
    }

  }

  console.log(req.body.mls);

  if (typeof req.body.mls != 'undefined') {

    let requested_mls = '';

    if (req.body.mls.length > 0) {

      for (let i = 0; i < req.body.mls.length; i++) {

        //console.log(req.body.mls[i].itemName);
        requested_mls += req.body.mls[i].itemName + ',';

      }

    }

    if (requested_mls != '') {

      requested_mls = requested_mls.replace(/,+$/, '');

      let message = req.body.firstname + ' ' + req.body.lastname + ' (' + req.body.email + ') from ' + req.body.companyname + " has requested to access " + requested_mls;

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
    }

  }

  let username = null;

  if (req.body.username) {
    username = req.body.username;
  } else {
    username = '_' + Math.random().toString(36).substr(2, 9);
  }
  user = new User(_.pick(req.body, ['email', 'password', 'firstname', 'lastname', 'companyname']));
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
  } catch (err) {
    return res.status(400).send(err);
  }

  const token = user.generateAuthToken(uuid);
  //res.send({"token": token});
  let getSafe = user.getSafe();
  //console.log(getSafe);

  try {
    await rclient.set(getSafe._id.toString(), uuid);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  res.send({
    "message": "User created",
    data: getSafe,
    "token": token
  });
};

exports.contactus = async (req, res) => {
  console.log(req.body);
  let contact_us_user;
  let contact_us_admin;

  try {
    contact_us_user = await fs.readFileSync(__dirname + '/../email_templates/contact_us.html');
    contact_us_admin = await fs.readFileSync(__dirname + '/../email_templates/contact_us_admin.html');
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  const schema = {
    name: Joi.string().allow(null, ''),
    email: Joi.string().required(),
    mymls: Joi.allow(null).allow('').optional(),
    message: Joi.string().allow(null, ''),
    companyname: Joi.allow(null).allow('').optional(),
    mlsName: Joi.allow(null).allow('').optional(),
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    return res.status(400).send({
      message: result.error.details[0].message
    });
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
  //Reply to User
  const htmlToSend = contact_us_user.toString().replace('{{contactName}}', req.body.name ? req.body.name : 'User');
  const mailOptions = {
    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
    //cc: 'ankit@tatrasdata.com',
    to: req.body.email,
    subject: 'cmaIQ Contact Form',
    html: htmlToSend,
  };
  //Reply to Admin

  const emailIdAdmin = contact_us_admin.toString().replace('{{email}}', req.body.email);
  const htmladmin = emailIdAdmin.replace('{{message}}', req.body.message);
  var htmlToSendadmin = htmladmin.replace('{{contactName}}', req.body.name ? req.body.name : 'User');
  if(req.body.mymls){
    htmlToSendadmin = htmlToSendadmin.replace('{{mymls}}', "My MLS : "+req.body.mymls[0].itemName+"<br/>");
  }
  else{
    if(req.body.mlsName){
      htmlToSendadmin = htmlToSendadmin.replace('{{mymls}}', "MLS : "+req.body.mlsName+"<br/>");
    }else{
      htmlToSendadmin = htmlToSendadmin.replace('{{mymls}}', "");
    }
  }
  const mailOptionsadmin = {
    from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
    //cc: 'ankit@tatrasdata.com',
    to: config.get("contact_email"),
    subject: 'cmaIQ Contact Form',
    html: htmlToSendadmin,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptionsadmin);
    return res.send({
      "message": "Message sent"
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.ticker = async (req, res) => {

  try {
    //console.log('ticker');
    const mlssTotal = '298,625'; //await Mls.find({}).count();
    const userMember = '20,805'; //await User.find({ "roles.role": { "$eq": "member", "$exists": true } }).count();
    const sales_rent = '4,378,906';
    return res.send({
      MLS: mlssTotal,
      SATISFIED_CUSTOMER: userMember,
      SALES_RENTS: sales_rent
    });
  } catch (e) {
    return res.status(400).send(e);
  }
};
