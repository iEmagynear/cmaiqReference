const Joi = require("joi");
const _ = require('lodash');
const {
  Client
} = require("../models/client");
const {
  State
} = require("../models/state");
const {
  Unknownstatus
} = require("../models/unknownstatus");
const {
  Property
} = require("../models/property");
const {
  Mls
} = require("../models/mls");
const {
  User
} = require("../models/user");
const {
  Chart
} = require("../models/chart");
const {
  ApiToken
} = require("../models/apitoken");
const {
  Share
} = require("../models/share");
const { Temppropertydata } = require("../models/temppropertydata");
const { ImageUpload } = require("../models/imageupload");
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const config = require("config");
const jwt = require("jsonwebtoken");
const AWS = require('aws-sdk');
var https = require('https');
var querystring = require('querystring');
var request = require('request');
var syncrequest = require('sync-request');
var handlebars = require('handlebars');
const fs = require('fs');
const RetsHelpers = require("../helpers/retsrabbit");
const BridgeHelpers = require("../helpers/bridge");
const CorelogicHelpers = require("../helpers/corelogic");
const statusHelpers = require("../helpers/status");
const mongoose = require('mongoose');
var rclient = require('../redis');
const csv2 = require('csvtojson');
const e = require("express");
const { isUndefined } = require("lodash");
var rp = require('request-promise');
var shortid = require('shortid');

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
  fs.readFile(path, {
    encoding: 'utf-8'
  }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

//AWS.config.update({ accessKeyId: config.get("ACCESS_KEY_ID"), secretAccessKey: config.get("SECRET_ACCESS_KEY"), region: config.get("AWS_REGION") });

const s3 = new AWS.S3();

exports.add_client = async (req, res) => {

  const schema = {
    email: Joi.string().email().optional().allow('').max(255),
    phone: Joi.string().optional().allow(''),
    firstname: Joi.string().required().max(80),
    lastname: Joi.string().required().max(80),
    mls_id: Joi.string().required(),
  };

  const result = Joi.validate(req.body, schema);

  //const token = req.headers.authorization.split(' ')[1];

  /* try {
      resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
      expiresIn: config.get("refreshTokenLife"),
      issuer: config.get("issuer")
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  } */

  const Id = req.user._id;

  if (result.error) {
    return res.status(400).send({
      message: result.error.details[0].message
    });
  }

  //console.log(req.body.f_mls);
  /* let useremail;
  try {
    useremail = await Client.findOne({
      "email": req.body.email,
      "mls_user_id": Id,
      "mls_id": req.body.mls_id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (useremail) {

    return res.status(400).send({
      message: "Client already exists."
    });
  } */

  client = new Client(_.pick(req.body, ['email', 'phone', 'firstname', 'lastname', 'mls_id']));

  client.mls_user_id = Id;

  var saved_id;

  try {
    //await client.save();

    await client.save(function(err, saved) {
      if (err) console.log(err);
      else{
        saved_id = saved._id;
        //console.log(saved_id);

        res.send({
          "message": "Client successfully added.",
          /* "saved_id":saved_id, */
          "saved_client":client,
          /* "firstname":req.body.firstname,
          "lastname":req.body.lastname, */
        });

      }
    });

  } catch (err) {
    return res.status(400).send(err);
  }


};

exports.edit_client = async (req, res) => {

  const schema = {
    email: Joi.string().email().optional().allow('').max(255),
    phone: Joi.string().optional().allow(''),
    id: Joi.string().required(),
    firstname: Joi.string().required().max(80),
    lastname: Joi.string().required().max(80),
  };

  const result = Joi.validate(req.body, schema);

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;
  const Id = req.user._id;

  if (result.error) {
    return res.status(400).send({
      message: result.error.details[0].message
    });
  }

  let useremail;

  try {
    useremail = await Client.findOne({
      "mls_user_id": Id,
      "_id": req.body.id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (useremail) {

    let query = {
      "mls_user_id": Id,
      "_id": req.body.id
    };
    let update = {
      "email": req.body.email,
      "firstname": req.body.firstname,
      "lastname": req.body.lastname,
      "phone": req.body.phone,
      updated: new Date()
    };
    let options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    };
    try {
      await Client.findOneAndUpdate(query, update, options);

    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
    //return res.status(400).send({message: "Email already exists."});
  } else {
    return res.status(400).send({
      message: "Client not found."
    });
  }

  res.send({
    "message": "Client successfully updated."
  });
};

exports.delete_client = async (req, res) => {

  const schema = {
    id: Joi.string().required(),
  };

  const result = Joi.validate(req.body, schema);

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;
  const Id = req.user._id;

  if (result.error) {
    return res.status(400).send({
      message: result.error.details[0].message
    });
  }

  let useremail;

  try {
    useremail = await Client.findOne({
      "mls_user_id": Id,
      "_id": req.body.id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (useremail) {
    Client.find({
      _id: req.body.id
    }).remove().exec();
  } else {
    return res.status(400).send({
      message: "Client not found."
    });
  }

  res.send({
    "message": "Client successfully deleted."
  });
};

exports.edit_property = async (req, res) => {

  const schema = {
    address: Joi.string().required(),
    id: Joi.string().required(),
    city: Joi.string().required(),
    client: Joi.string().allow(null).allow('').optional(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    square_footage: Joi.string().required(),
    property_image: Joi.string().allow(null).allow('').optional(),
    mls_number: Joi.string().allow(null).allow('').optional(),
    property_type: Joi.string().required(),
    bedroom: Joi.required(),
    bathroom: Joi.required()
  };

  const result = Joi.validate(req.body, schema);

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  if (result.error) {
    return res.status(400).send({
      message: result.error.details[0].message
    });
  }
  let useremail;
  try {
    useremail = await Property.findOne({
      "mls_user_id": Id,
      "_id": req.body.id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (useremail) {

    if (req.body.property_image) {

      var base64 = req.body.property_image;

      //if (base64.search("amazonaws") > 0) {

      if (base64.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {

        //res.send({"message": "amazonaws"});
        let update = {
          "address": req.body.address,
          "city": req.body.city,
          "client": req.body.client,
          "property_image": req.body.property_image,
          "zip": req.body.zip,
          "square_footage": req.body.square_footage,
          "state": req.body.state,
          "mls_number": req.body.mls_number,
          "property_type": req.body.property_type,
          "bedroom": req.body.bedroom,
          "bathroom": req.body.bathroom,
          "updated": new Date()
        };
        let query = {
          "mls_user_id": Id,
          "_id": req.body.id
        };
        let options = {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        };

        try {
          await Property.findOneAndUpdate(query, update, options);

        } catch (err) {
          console.log(err); // TypeError: failed to fetch
        }

      } else {

        //res.send({"message": "not amazonaws"});
        const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        const type = base64.split(';')[0].split('/')[1];

        const params = {
          Bucket: config.get("S3_BUCKET") + '/property_image',
          Key: `${Date.now()}.${type}`,
          Body: base64Data,
          ACL: 'public-read',
          //ContentEncoding: 'base64',
          ContentType: `image/${type}`
        }
        let LocationPath;
        try {
          const {
            Location,
            Key
          } = await s3.upload(params).promise();
          LocationPath = Location

        } catch (err) {
          console.log(err); // TypeError: failed to fetch
        }

        if (LocationPath) {
          let update = {
            "address": req.body.address,
            "city": req.body.city,
            "client": req.body.client,
            "property_image": LocationPath,
            "zip": req.body.zip,
            "square_footage": req.body.square_footage,
            "state": req.body.state,
            "mls_number": req.body.mls_number,
            "property_type": req.body.property_type,
            "bedroom": req.body.bedroom,
            "bathroom": req.body.bathroom,
            updated: new Date()
          };
          let query = {
            "mls_user_id": Id,
            "_id": req.body.id
          };
          let options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          };

          try {
            await Property.findOneAndUpdate(query, update, options);

          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }

        }
      }

    } else {

      /* res.send({
        "message": "nothing"
      }); */
      let update = {
        "address": req.body.address,
        "city": req.body.city,
        "client": req.body.client,
        "property_image": req.body.property_image,
        "zip": req.body.zip,
        "square_footage": req.body.square_footage,
        "state": req.body.state,
        "mls_number": req.body.mls_number,
        "property_type": req.body.property_type,
        "bedroom": req.body.bedroom,
        "bathroom": req.body.bathroom,
        updated: new Date()
      };
      let query = {
        "mls_user_id": Id,
        "_id": req.body.id
      };
      let options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      };
      try {
        await Property.findOneAndUpdate(query, update, options);

      } catch (err) {
        console.log(err); // TypeError: failed to fetch
      }
    }

  } else {
    return res.status(400).send({
      message: "Property not found."
    });
  }

  res.send({
    "message": "Property successfully updated."
  });
};

exports.get_states = async (req, res) => {

  State.find({}, function (err, users) {
    var userMap = [];

    users.forEach(function (user) {
      userMap.push(user);
    });

    res.send(userMap);
  });
};

exports.get_clients = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  const mls_id = req.params.mls_id;
  /* console.log({
    "mls_user_id": Id,
    "mls_id": mls_id
  }); */

  try {
    await Client.find({
      "mls_user_id": Id,
      "mls_id": mls_id
    }, function (err, users) {
      var userMap = [];

      users.forEach(function (user) {
        userMap.push(user);
      });

      res.send(userMap);
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

};

exports.get_clients_new = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  let pageNumber = parseInt(req.body.pageNumber);
  let maxRecords = parseInt(req.body.maxRecords);

  let mls_id = req.body.f_mls;

  try {
    let users = await Client.find({
      'mls_user_id': mongoose.Types.ObjectId(Id),
      'mls_id': mls_id
    }).skip(maxRecords * (pageNumber - 1)).collation().sort({
      lastname: 1
    }).limit(maxRecords);
    let total = await Client.find({
      'mls_user_id': mongoose.Types.ObjectId(Id),
      'mls_id': mls_id
    }).countDocuments();
    let total_pages = Math.ceil(total / maxRecords);
    return res.send({
      data: users,
      total: total,
      total_pages: total_pages
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

};

exports.get_client = async (req, res) => {
  const Id = req.params.id;
  let filters = {
    _id: Id
  };

  try {
    let users = await Client.findOne(filters);
    return res.send({
      data: users
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
};

exports.delete_property = async (req, res) => {

  const schema = {
    id: Joi.string().required(),
  };

  const result = Joi.validate(req.body, schema);

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  if (result.error) {
    return res.status(400).send({
      message: result.error.details[0].message
    });
  }
  let useremail;
  try {
    useremail = await Property.findOne({
      "mls_user_id": Id,
      "_id": req.body.id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (useremail) {
    Property.find({
      _id: req.body.id
    }).remove().exec();
  } else {
    return res.status(400).send({
      message: "Property not found."
    });
  }

  res.send({
    "message": "Property successfully deleted."
  });
};

exports.add_property = async (req, res) => {

  const schema = {
    address: Joi.string().required(),
    city: Joi.string().required(),
    client: Joi.string().allow(null).allow('').optional(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    square_footage: Joi.string().required(),
    property_image: Joi.string().allow(null).allow('').optional(),
    mls_id: Joi.string().required(),
    mls_number: Joi.string().allow(null).allow('').optional(),
    property_type: Joi.string().required(),
    bedroom: Joi.required(),
    bathroom: Joi.required()
  };
  //.valid('').optional()
  //console.log(req.body);
  const result = Joi.validate(req.body, schema);

  if (result.error) {
    return res.status(400).send({
      message: result.error.details[0].message
    });
  }

  //const token = req.headers.authorization.split(' ')[1];

  /* try {
    resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
      expiresIn: config.get("refreshTokenLife"),
      issuer: config.get("issuer")
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  } */

  const Id = req.user._id;

  var save;

  if (req.body.property_image) {

    var base64 = req.body.property_image;

    let LocationPath;

    if (base64.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
        LocationPath = base64;
    }else{
        const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        const type = base64.split(';')[0].split('/')[1];

        const params = {
          Bucket: config.get("S3_BUCKET") + '/property_image',
          Key: `${Date.now()}.${type}`,
          Body: base64Data,
          ACL: 'public-read',
          //ContentEncoding: 'image/webp',
          ContentType: `image/${type}`
        }

        try {
          const {
            Location,
            Key
          } = await s3.upload(params).promise();
          LocationPath = Location;
        } catch (err) {
          console.log(err); // TypeError: failed to fetch
        }

    }
    //console.log(Location);

    if (LocationPath) {

      property = new Property(_.pick(req.body, ['address', 'city', 'client', 'square_footage', 'state', 'zip', 'mls_id','mls_number','property_type','bedroom','bathroom']));

      //console.log(Location);

      property.property_image = LocationPath;

      property.mls_user_id = Id;

      //console.log(property);

      try {
        save = await property.save();
      } catch (err) {
        return res.status(400).send(err);
      }

    }

  } else {

    property = new Property(_.pick(req.body, ['address', 'city', 'client', 'square_footage', 'state', 'zip', 'mls_id','mls_number','property_type','bedroom','bathroom']));

    property.mls_user_id = Id;

    try {
      save = await property.save();
    } catch (err) {
      return res.status(400).send(err);
    }

  }

  res.send({
    "saved_property":property,
    "message": "Property successfully added."
  });

}

exports.get_properties = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  const mls_id = req.params.mls_id;
  try {
    await Property.find({
      "mls_user_id": Id,
      mls_id: mls_id
    }
      , function (err, users) {
        var userMap = [];

        users.forEach(function (user) {
          userMap.push(user);
        });

        res.send(userMap);
      });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

};

exports.get_properties_client = async (req, res) => {
  //console.log('in client');
  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  //console.log(req.params);
  const clientId = req.params.clientId;
  try {
    await Property.find({
      "mls_user_id": Id,
      client: clientId
    }
      , function (err, users) {
        var userMap = [];

        users.forEach(function (user) {
          userMap.push(user);
        });

        res.send(userMap);
      });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

};

exports.get_properties_new = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  let pageNumber = parseInt(req.body.pageNumber);

  let maxRecords = parseInt(req.body.maxRecords);

  let mls_id = req.body.f_mls;

  try {
    let users = await Property.find({
      'mls_user_id': mongoose.Types.ObjectId(Id),
      'mls_id': mls_id
    }).skip(maxRecords * (pageNumber - 1)).collation().sort({
      address: 1
    }).limit(maxRecords);
    let total = await Property.find({
      'mls_user_id': mongoose.Types.ObjectId(Id),
      'mls_id': mls_id
    }).countDocuments();
    let total_pages = Math.ceil(total / maxRecords);
    return res.send({
      data: users,
      total: total,
      total_pages: total_pages
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

};

exports.get_property = async (req, res) => {
  const Id = req.params.id;
  let filters = {
    _id: Id
  };

  try {
    let properties = await Property.findOne(filters);
    return res.send({
      data: properties
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

};

exports.get_mls_details = async (req, res) => {
  const Id = req.body.id;
  let filters = {
    _id: Id
  };
  let mls;
  try {
    mls = await Mls.findOne(filters);

  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  return res.send({
    data: mls
  });
};

exports.send_email = async (req, res) => {

  readHTMLFile(__dirname + '/../email_templates/share_property.html', function (err, html) {
    let imgLogo = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/public/apcri-email-logo.png";
    var template = handlebars.compile(html);

    var replacements = {
      message: req.body.message.replace(/\n/g, "<br>"),
      text: "Please click the button or link below for your " + req.body.subject,
      href: config.get("SITE_URL") + req.body.url,
      link_label: req.body.link_label,
      imgLogo: imgLogo
    };

    var htmlToSend = template(replacements);

    var emailArr = req.body.email.split(',');

    //var count = emailArr.length;
    //var c = 0;
    emailArr.forEach(function (to, i, array) {
      //console.log(to);
      //console.log(i);
      //console.log(array.length);

      /* var separateWord = req.body.agent_name.toLowerCase().split(' ');
      for (var i = 0; i < separateWord.length; i++) {
          separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
          separateWord[i].substring(1);
      }

      var agent_name = separateWord.join(' ');

      console.log(agent_name); */

      var agent_name =  req.body.agent_name.toLowerCase()
      .split(' ')
      .map(function(word) {
          //console.log("First capital letter: "+word[0]);
          //console.log("remain letters: "+ word.substr(1));
          return word[0].toUpperCase() + word.substr(1);
      })
      .join(' ');

      //console.log(agent_name);

      var mailOptions = {
        from: agent_name+' via cmaIQ'+ '<' + config.get("FROM_EMAIL") + '>',
        to: to,
        cc: req.body.cc,
        subject: req.body.subject,
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, function (error, response) {

        if (error) {
          console.log(error);
          //return res.send(error);
        }

        if (i == array.length - 1) {
          //console.log(to);
          return res.send({
            "message": "Message send"
          });
        }

      });

    });

  });
};

exports.share_popup_submit = async (req, res) => {
  const Id = req.user._id;
  //var shortid = shortid.generate();
  let data = {
    _id: shortid.generate(),
    user_id: Id,
    address: req.body.address,
    agency: req.body.agency,
    agent_email: req.body.agent_email,
    agent_name: req.body.agent_name,
    agent_phone: req.body.agent_phone,
    available: req.body.available,
    baths: req.body.baths,
    beds: req.body.beds,
    chart_id: req.body.chart_id,
    note: req.body.note,
    price: req.body.price,
    property_image: req.body.property_image,
    sqft: req.body.sqft,
    webiste: req.body.webiste,
  };
  
  sharedata = new Share(data);
  sharedata.save(async function (err, new_data) {
    new_id = new_data._id;
    //console.log(new_data);
    if (err) res.status(400).send(err);
    //zip.close();
    res.send({ 'success': 'data insert successful.',id:new_id });
  });
  //res.send(req.body);
}

exports.get_chart_details = async (req, res) => {

  const Id = req.body.id;
  //const userId = await req.body.userid;
  let filters = {
    _id: Id
  };
  //console.log(filters);
  let chart;
  try {
    chart = await Chart.findOne(filters);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  var serial = JSON.stringify(chart);

  //console.log(chart);
  //console.log(config.get("analytic_url")+'/price_analysis');
  //console.log("\n--------\n",serial,"\n========\n");

  request({
    uri: config.get("analytic_url") + '/price_analysis',
    body: serial,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }, function (err, re, body) {

    if (err) {
      console.log(err);
      //res.send(err);
    }
    if (re) {
      if (re.statusCode == 200) {
        return res.send({
          data: chart,
          response: re.body
        });
      } else {
        return res.status(re.statusCode).send({
          error: "something went wrong",
          data: chart,
          response: re.body
        });
      }
    }

    //console.log("res: ", re);
    //return res.send({ data: chart, response: re.body });
  });

};

exports.get_chart_details_only = async (req, res) => {

  const Id = req.body.id;
  //const userId = await req.body.userid;
  let filters = {
    _id: Id
  };
  //console.log(filters);
  let chart;
  try {
    chart = await Chart.findOne(filters);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  //var serial = JSON.stringify(chart);

  //console.log(chart);
  //console.log(config.get("analytic_url")+'/price_analysis');
  //console.log("\n--------\n",serial,"\n========\n");

  return res.send({
    data: chart
    //response: re.body
  });

};


exports.get_chart_details_investment = async (req, res) => {

  const Id = req.body.id;
  let filters;
  let userId;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
        expiresIn: config.get("refreshTokenLife"),
        issuer: config.get("issuer")
      });
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }

    userId = resultJwt._id;

    //userId = req.user._id;

    filters = { _id: Id, userId: mongoose.Types.ObjectId(userId) };
  }
  else {
    filters = { _id: Id };
  }

  //console.log(filters);
  let chart;
  try {
    chart = await Chart.findOne(filters);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (chart) {
    return res.send({ data: chart });
  } else {
    return res.status(400).send({
      message: "Chart not found for this user."
    });
  }

};

exports.get_charts = async (req, res) => {

  const mls_id = req.params.mls_id;

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  try {
    const pipeline = [{
      $match: {
        userId: mongoose.Types.ObjectId(Id),
        'relatedProperty.mls_id': mls_id
      }
    },
    {
      $project: {
        targetProperty: 1,
        relatedProperty: 1,
        client: 1,
        created: 1,
        chart_title: 1,
        userId: 1,
        investment: 1
      }
    },
    {
      $sort: {
        created: -1
      }
    }
    ];
    let chart;
    try {
      chart = await Chart.aggregate(pipeline).allowDiskUse(true);
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
    return res.send({
      data: chart
    });
  } catch (err) {
    console.log(err);
  }

};

exports.generate_token = async (req, res) => {

  //console.log(req.body.selected_mls);

  let filters = {
    _id: req.body.selected_mls
  };
  let mls;
  try {
    mls = await Mls.findOne(filters);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  if (mls.chart_api == 'Bridge') {
    res.send({
      "access_token": config.get("bridge_access_token")
    })
  } else if (mls.chart_api == 'CoreLogic') {

    var apiCreds = {
      'grant_type': config.get("coreLogic_grant_type"),
      'client_id': config.get("coreLogic_client_id"),
      'client_secret': config.get("coreLogic_client_secret"),
      'scope': 'api'
    }

    var serial = querystring.stringify(apiCreds);

    console.log('generate_token corelogic 1');

    request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      uri: 'https://api-prod.corelogic.com/trestle/oidc/connect/token',
      body: serial,
      method: 'POST'
    }, function (err, re, body) {

      if (err) {
        res.send(err);
      }

      res.send(re.body);
    });

  } else if (mls.chart_api == 'Spark') {

    var apiCreds = {
      'client_id': 'arp0nfi0r0ngx5a2ranfhlmyv',
      'client_secret': '8tth4wd17au6uf3ufut2qlec4',
      'grant_type': 'refresh_token',
      'refresh_token': '87delkfdqmqfour1xwy0dmisc',
      'redirect_uri': 'https://sparkplatform.com/oauth2/callback'
    }

    var serial = querystring.stringify(apiCreds);

    request({
      headers: {
        'Accept': 'application/json',
        'X-SparkApi-User-Agent': 'APC',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      uri: 'https://sparkplatform.com/openid/token',
      body: serial,
      method: 'POST'
    }, function (err, re, body) {

      if (err) {
        res.send(err);
      }

      res.send(re.body);
    });
  } else {

    var apiCreds = {
      'grant_type': config.get("retsrabbit_grant_type"),
      'client_id': config.get("retsrabbit_client_id"),
      'client_secret': config.get("retsrabbit_client_secret"),
    }

    var serial = JSON.stringify(apiCreds);

    var options = {
      host: 'werx.retsrabbit.com',
      path: '/api/oauth/access_token',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
    };

    reqq = https.request(options, function (response) {

      var result = ''

      response.on('data', function (chunk) {
        result += chunk;
      });

      response.on('end', function () {
        console.log(result);
        res.send(result);
      });
    })

    reqq.on('error', (error) => {
      res.send(error);
    })

    reqq.write(serial)
    reqq.end();

  }

};

exports.get_api_type = async (req, res) => {
  let filters = {
    _id: req.body.selected_mls
  };
  let mls;
  try {
    mls = await Mls.findOne(filters);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  res.send({
    "api": mls.chart_api
  });
};

exports.delete_chart_item = async (req, res) => {

  const schema = {
    id: Joi.string().required(),
  };

  const result = Joi.validate(req.body, schema);

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  if (result.error) {
    return res.status(400).send({
      message: result.error.details[0].message
    });
  }

  let chart;

  try {
    chart = await Chart.findOne({
      "_id": req.body.id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  if (chart) {
    //Chart.findByIdAndRemove({ _id: req.body.id });
    Chart.find({
      _id: req.body.id
    }).remove().exec();
  } else {
    return res.status(400).send({
      message: "Chart not found."
    });
  }

  res.send({
    "message": "Chart successfully deleted."
  });
};


exports.add_chart = async (req, res) => {

  let mlss;

  try {
    mlss = await Mls.findOne({
      "_id": req.body.mls_id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  let api;

  if (mlss) {
    api = mlss.chart_api;
  }

  var base;

  //ApiToken
  var token;
  //const Id = req.params.id;
  let filters = {
    slug: api
  };

  let tokenArr;

  try {
    tokenArr = await ApiToken.findOne(filters);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  //console.log(api);
  var now = new Date();

  if (api == 'retsrabbit') {

    console.log("retsrabbit START");

    if (tokenArr) {

      //console.log("tokenArr");

      expiry = tokenArr.expiry;

      //console.log(expiry);

      if (now > expiry) {

        //console.log('if')

        var apiCreds = {
          'grant_type': config.get("retsrabbit_grant_type"),
          'client_id': config.get("retsrabbit_client_id"),
          'client_secret': config.get("retsrabbit_client_secret"),
        }

        //console.log(apiCreds);

        var serial = JSON.stringify(apiCreds);

        var ares;

        /* var tokenres = syncrequest('POST',
          'http://werx.retsrabbit.com/api/oauth/access_token', {
          json: apiCreds,
        });
        var ares = JSON.parse(tokenres.getBody('utf8')); */

        var optionsdd = {
          method: 'POST',
          uri: 'http://werx.retsrabbit.com/api/oauth/access_token',
          body: serial,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        let rpbody;
        try {
          rpbody = await rp(optionsdd);
        } catch (error) {
          console.log(error);
        }

        ares = JSON.parse(rpbody);

        /* console.log(ares);
        return; */

        expiryDate = new Date(now.getTime() + (ares.expires_in) * 1000);

        apiToken = {

          token: ares.access_token,
          expiry: expiryDate
        };

        //console.log(apiToken);

        try {
          let query = {
            "_id": tokenArr._id
          };
          let options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          };

          try {
            save = await ApiToken.findOneAndUpdate(query, apiToken, options);
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }
        } catch (err) {
          return res.status(400).send(err);
        }

        token = ares.access_token;


      } else {
        //console.log('else')
        token = tokenArr.token;
      }

    } else {

      var apiCreds = {
        'grant_type': config.get("retsrabbit_grant_type"),
        'client_id': config.get("retsrabbit_client_id"),
        'client_secret': config.get("retsrabbit_client_secret"),
      }

      var serial = JSON.stringify(apiCreds);

      var ares;

      /* var tokenres = syncrequest('POST',
        'http://werx.retsrabbit.com/api/oauth/access_token', {
        json: apiCreds,
      });
      var ares = JSON.parse(tokenres.getBody('utf8')); */

      var optionsdd = {
        method: 'POST',
        uri: 'http://werx.retsrabbit.com/api/oauth/access_token',
        body: serial,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      let rpbody;
      try {
        rpbody = await rp(optionsdd);
      } catch (error) {
        console.log(error);
      }

      ares = JSON.parse(rpbody);

      /* console.log(ares);
      return; */

      /* request({
        uri: 'http://werx.retsrabbit.com/api/oauth/access_token',
        body: serial,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      }, async function(err, re, body) {
        console.log("retsrabbit GRAB");
        if (err) {
          console.log(err);
          //res.send(err);
        }
        ares = JSON.parse(re.body); */
      //console.log('22');
      //console.log(ares);

      expiryDate = new Date(now.getTime() + (ares.expires_in) * 1000);
      //base = await RetsHelpers.retsrabbits(req.body, mlss);

      apiToken = new ApiToken({
        name: 'retsrabbit',
        slug: 'retsrabbit',
        token: ares.access_token,
        expiry: expiryDate
      });

      //console.log(apiToken);

      try {
        //let query = { "_id": id };
        let options = {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        };
        //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
        try {
          save = await ApiToken.findOneAndUpdate(filters, apiToken, options);
        } catch (err) {
          console.log(err); // TypeError: failed to fetch
        }
      } catch (err) {
        return res.status(400).send(err);
      }

      //console.log(JSON.parse(ares.getBody()));
      token = ares.access_token;

      //});

      //expires_in

    }

    try {
      base = await RetsHelpers.retsrabbits(req.body, mlss);
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }

  }

  if (api == 'Bridge') {

    token = config.get("bridge_access_token");

    try {
      base = await BridgeHelpers.bridge(req.body, mlss);
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }

  if (api == "CoreLogic") {

    if (tokenArr) {

      expiry = tokenArr.expiry;

      if (now > expiry) {

        console.log('generate_token corelogic 2');

        var apiCreds = {
          'grant_type': config.get("coreLogic_grant_type"),
          'client_id': config.get("coreLogic_client_id"),
          'client_secret': config.get("coreLogic_client_secret"),
          'scope': 'api'
        }
    
        var serial = querystring.stringify(apiCreds);

        console.log(serial);
    
        var optionsdd = {
          host: 'api-prod.corelogic.com',
          path: '/trestle/oidc/connect/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
        };
  
        //console.log(optionsdd);
        let ares;
        try {
          ares = await httpsRequest(optionsdd,serial);
          console.log(ares);
        } catch (error) {
          console.log(error);
          //res.status(400).send(error);
        }

        //expires_in

        if(ares){

          expiryDate = new Date(now.getTime() + (ares.expires_in) * 1000);
          //base = await RetsHelpers.retsrabbits(req.body, mlss);

          apiToken = {
            //name:'retsrabbit',
            //slug:'retsrabbit',
            token: ares.access_token,
            expiry: expiryDate
          };

          //console.log(apiToken);

          try {
            let query = {
              "_id": tokenArr._id
            };
            let options = {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true
            };
            //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
            try {
              save = await ApiToken.findOneAndUpdate(query, apiToken, options);
            } catch (err) {
              console.log(err); // TypeError: failed to fetch
            }
          } catch (err) {
            return res.status(400).send(err);
          }

          token = ares.access_token;
        }
        //});


      } else {
        token = tokenArr.token;
      }
    } else {

      console.log('generate_token corelogic 3');

      var apiCreds = {
        'grant_type': config.get("coreLogic_grant_type"),
        'client_id': config.get("coreLogic_client_id"),
        'client_secret': config.get("coreLogic_client_secret"),
        'scope': 'api'
      }
  
      var serial = querystring.stringify(apiCreds);

      console.log(serial);
  
      var optionsdd = {
        host: 'api-prod.corelogic.com',
        path: '/trestle/oidc/connect/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
      };

      //console.log(optionsdd);
      let ares;
      try {
        ares = await httpsRequest(optionsdd,serial);
        console.log(ares);
      } catch (error) {
        console.log(error);
        //res.status(400).send(error);
      }
      
      if(ares){

        //console.log(ares.expires_in);
        
        expiryDate = new Date(now.getTime() + (ares.expires_in) * 1000);
        //base = await RetsHelpers.retsrabbits(req.body, mlss);

        apiToken = new ApiToken({
          name: 'CoreLogic',
          slug: 'CoreLogic',
          token: ares.access_token,
          expiry: expiryDate
        });

        //console.log(apiToken);

        try {
          //let query = { "_id": id };
          let options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          };
          //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
          try {
            save = await ApiToken.findOneAndUpdate(filters, apiToken, options);
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }
        } catch (err) {
          return res.status(400).send(err);
        }

        //expires_in
        //console.log(JSON.parse(ares.getBody()));

        token = ares.access_token;
      
      }
      
    }

    try {
      base = await CorelogicHelpers.corelogic(req.body, mlss);
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }

  console.log("add_chart")
  /* console.log(api);
  console.log(base);
  console.log(token); */

  if (api == 'retsrabbit' && base && token) {
    //console.log(base);
    //console.log(token);
    var options = {
      host: 'werx.retsrabbit.com',
      path: encodeURI("/api/v2/property/?" + (base)),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'X-SparkApi-User-Agent': 'APC',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
    };
  }

  if (api == 'Bridge' && base && token) {
    var options = {
      host: 'api.bridgedataoutput.com',
      path: encodeURI("/api/v2/OData/miamire/Property?" + base),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      method: 'GET',
    };
  }

  if (api == "CoreLogic" && base && token) {
    var options = {
      host: 'api-prod.corelogic.com',
      path: encodeURI("/trestle/odata/Property?" + base),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      method: 'GET',
    };
  }

  console.log("Start Time:========="+new Date());

  console.log(options);

  try {
    res_standardStatus = await httpsRequest(options);

  if(res_standardStatus){
    //res.send(result);
      console.log("End Time:========="+new Date());
      //var res_standardStatus = JSON.parse(result);
      if(res_standardStatus.error){
        res.send(res_standardStatus.error.message);
      }
      else{
        var newArr = {};
        newArr.value = [];
        var distinctStandardObj = {};
        distinctStandardObj.status = [];
        distinctStandardObj.value = [];

        for (var k = 0; k < res_standardStatus.value.length; k++) {
          for (var l = k + 1; l < res_standardStatus.value.length; l++) {
            if (res_standardStatus.value[k].StandardStatus == res_standardStatus.value[l].StandardStatus) {
              if (!distinctStandardObj.status.includes(res_standardStatus.value[k].StandardStatus)) {
                distinctStandardObj.status.push(res_standardStatus.value[k].StandardStatus);
                distinctStandardObj.value.push(res_standardStatus.value[k]);
              }
            }
          }
          // newArr.push()
          try {
            res_standardStatus.value[k].StandardStatus = await statusHelpers.statuses(res_standardStatus.value[k].StandardStatus);
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }
          newArr.value.push(res_standardStatus.value[k]);
        }
        // console.log(distinctStandardObj);

        for (var i = 0; i < distinctStandardObj.status.length; i++) {

          let returnStatus;
          try {
            returnStatus = await statusHelpers.statuses(distinctStandardObj.status[i]);
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }
          if (!returnStatus) {
            var statusObj = {};
            statusObj.propertysample = [];
            statusObj.unknownstatus = distinctStandardObj.status[i];
            statusObj.updated = new Date();
            statusObj.propertysample.push(distinctStandardObj.value[i]);
            // console.log(statusObj);
            let unknownStatus_notification;
            try {
              unknownStatus_notification = await fs.readFileSync(__dirname + '/../email_templates/notify_unknown_status.html');
            } catch (err) {
              console.log(err); // TypeError: failed to fetch
            }
            let fieldsToSet = statusObj;
            var u_statusName = statusObj.unknownstatus;

            unknown_status = new Unknownstatus(fieldsToSet);

            for (let k = 0; k < unknown_status.propertysample.length; k++) {
              delete unknown_status.propertysample[k]["listing"]; //delete because of @odata.id key generate error
            }

            try {
              u_status = await Unknownstatus.findOne({
                "unknownstatus": u_statusName
              });
            } catch (err) {
              console.log(err); // TypeError: failed to fetch
            }

            // console.log(u_status);

            // console.log('lastUpdatedDate =======', lastUpdatedDate);
            if (u_status) {

              var lastUpdatedDate = u_status.updated;

              var newPropertySample;

              u_status.propertysample.push(statusObj.propertysample[0]);

              newPropertySample = u_status.propertysample

              var newFieldsToSet = {};
              // newFieldsToSet.propertysample = [];
              newFieldsToSet.propertysample = newPropertySample;
              newFieldsToSet.updated = new Date();
              // console.log(u_status.created);
              // console.log(newFieldsToSet.updated);
              try {
                let query = {
                  "_id": u_status._id
                };
                let options = {
                  upsert: true,
                  new: true,
                  setDefaultsOnInsert: true
                };
                //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
                try {
                  save = await Unknownstatus.findOneAndUpdate(query, newFieldsToSet, options);
                } catch (err) {
                  console.log(err); // TypeError: failed to fetch
                }

                var last_updated_date = lastUpdatedDate;
                var c_date = new Date();
                // console.log('c_date....', c_date);
                // console.log('last_updated_date....', last_updated_date);
                var date1 = new Date(last_updated_date);
                var date2 = new Date(c_date);

                var Difference_In_Time = date2.getTime() - date1.getTime();
                // console.log('Difference_In_Time....', Difference_In_Time);
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                // console.log('Difference_In_Days....', Difference_In_Days);
                if (Difference_In_Days >= 1) {
                  // console.log('in if ....');
                  sendMail();
                } else {
                  // do nothing;
                }
              } catch (err) {
                console.log(err);
                // return res.status(400).send(err);
              }
              // res.send({ "message": "Unknown status modified successfully." });
            } else {

              try {
                save = await unknown_status.save();

              } catch (err) {
                return res.status(400).send(err);
              }

              // res.send({ "message": "Unknown status successfully added." });
              sendMail();
            }
            async function sendMail() {
              let imgLogo = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/public/apcri-email-logo.png";
              const template = handlebars.compile(unknownStatus_notification.toString());
              const replacements = {
                unknown_status: u_statusName,
                imgLogo: imgLogo
                //site_url: config.get("SITE_URL")
              };

              const htmlToSend = template(replacements);

              const mailOptions = {
                from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                to: config.get("unknownstatus_email"),
                // to: 'nitin@tatrasdata.com',
                subject: 'Unknown Status',
                html: htmlToSend,
              };

              try {
                // await transporter.sendMail(mailOptions);
                transporter.sendMail(mailOptions);
              } catch (err) {
                console.log(err);
              }
            }
          }
        }

        res.send(JSON.stringify(newArr));
      }
  }
  } catch (error) {
    console.log(error);
  }
  

  /* reqq = https.request(options, function (response) {
    //ress.setEncoding('utf8');
    var result = ''
    response.on('data', function (chunk) {
      result += chunk;
    });

    response.on('end', async () => {
      //console.log(result);
      console.log("End Time:========="+new Date());
      var res_standardStatus = JSON.parse(result);
      if(res_standardStatus.error){
        res.send(res_standardStatus.error.message);
      }
      else{
        var newArr = {};
        newArr.value = [];
        var distinctStandardObj = {};
        distinctStandardObj.status = [];
        distinctStandardObj.value = [];

        for (var k = 0; k < res_standardStatus.value.length; k++) {
          for (var l = k + 1; l < res_standardStatus.value.length; l++) {
            if (res_standardStatus.value[k].StandardStatus == res_standardStatus.value[l].StandardStatus) {
              if (!distinctStandardObj.status.includes(res_standardStatus.value[k].StandardStatus)) {
                distinctStandardObj.status.push(res_standardStatus.value[k].StandardStatus);
                distinctStandardObj.value.push(res_standardStatus.value[k]);
              }
            }
          }
          // newArr.push()
          try {
            res_standardStatus.value[k].StandardStatus = await statusHelpers.statuses(res_standardStatus.value[k].StandardStatus);
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }
          newArr.value.push(res_standardStatus.value[k]);
        }
        // console.log(distinctStandardObj);

        for (var i = 0; i < distinctStandardObj.status.length; i++) {

          let returnStatus;
          try {
            returnStatus = await statusHelpers.statuses(distinctStandardObj.status[i]);
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }
          if (!returnStatus) {
            var statusObj = {};
            statusObj.propertysample = [];
            statusObj.unknownstatus = distinctStandardObj.status[i];
            statusObj.updated = new Date();
            statusObj.propertysample.push(distinctStandardObj.value[i]);
            // console.log(statusObj);
            let unknownStatus_notification;
            try {
              unknownStatus_notification = await fs.readFileSync(__dirname + '/../email_templates/notify_unknown_status.html');
            } catch (err) {
              console.log(err); // TypeError: failed to fetch
            }
            let fieldsToSet = statusObj;
            var u_statusName = statusObj.unknownstatus;

            unknown_status = new Unknownstatus(fieldsToSet);

            for (let k = 0; k < unknown_status.propertysample.length; k++) {
              delete unknown_status.propertysample[k]["listing"]; //delete because of @odata.id key generate error
            }

            try {
              u_status = await Unknownstatus.findOne({
                "unknownstatus": u_statusName
              });
            } catch (err) {
              console.log(err); // TypeError: failed to fetch
            }

            // console.log(u_status);

            // console.log('lastUpdatedDate =======', lastUpdatedDate);
            if (u_status) {

              var lastUpdatedDate = u_status.updated;

              var newPropertySample;

              u_status.propertysample.push(statusObj.propertysample[0]);

              newPropertySample = u_status.propertysample

              var newFieldsToSet = {};
              // newFieldsToSet.propertysample = [];
              newFieldsToSet.propertysample = newPropertySample;
              newFieldsToSet.updated = new Date();
              // console.log(u_status.created);
              // console.log(newFieldsToSet.updated);
              try {
                let query = {
                  "_id": u_status._id
                };
                let options = {
                  upsert: true,
                  new: true,
                  setDefaultsOnInsert: true
                };
                //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
                try {
                  save = await Unknownstatus.findOneAndUpdate(query, newFieldsToSet, options);
                } catch (err) {
                  console.log(err); // TypeError: failed to fetch
                }

                var last_updated_date = lastUpdatedDate;
                var c_date = new Date();
                // console.log('c_date....', c_date);
                // console.log('last_updated_date....', last_updated_date);
                var date1 = new Date(last_updated_date);
                var date2 = new Date(c_date);

                var Difference_In_Time = date2.getTime() - date1.getTime();
                // console.log('Difference_In_Time....', Difference_In_Time);
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                // console.log('Difference_In_Days....', Difference_In_Days);
                if (Difference_In_Days >= 1) {
                  // console.log('in if ....');
                  sendMail();
                } else {
                  // do nothing;
                }
              } catch (err) {
                console.log(err);
                // return res.status(400).send(err);
              }
              // res.send({ "message": "Unknown status modified successfully." });
            } else {

              try {
                save = await unknown_status.save();

              } catch (err) {
                return res.status(400).send(err);
              }

              // res.send({ "message": "Unknown status successfully added." });
              sendMail();
            }
            async function sendMail() {
              let imgLogo = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/public/apcri-email-logo.png";
              const template = handlebars.compile(unknownStatus_notification.toString());
              const replacements = {
                unknown_status: u_statusName,
                imgLogo: imgLogo
                //site_url: config.get("SITE_URL")
              };

              const htmlToSend = template(replacements);

              const mailOptions = {
                from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
                to: config.get("unknownstatus_email"),
                // to: 'nitin@tatrasdata.com',
                subject: 'Unknown Status',
                html: htmlToSend,
              };

              try {
                // await transporter.sendMail(mailOptions);
                transporter.sendMail(mailOptions);
              } catch (err) {
                console.log(err);
              }
            }
          }
        }

        res.send(JSON.stringify(newArr));
      }

    });

  })

  reqq.on('error', (error) => {
    res.send(error);
  })

  reqq.end(); */

};

exports.add_chart_rets = async (req, res) => {

  let mlss;
  try {
    mlss = await Mls.findOne({
      "_id": req.body.mls_id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  let api;

  if (mlss) {
    api = mlss.chart_api;
  }

  var base;

  //ApiToken
  var token;
  //const Id = req.params.id;
  let filters = {
    slug: api
  };

  let tokenArr;

  try {
    tokenArr = await ApiToken.findOne(filters);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  //console.log(api);
  var now = new Date();

  console.log("retsrabbit START");

  if (tokenArr) {

    //console.log("tokenArr");

    expiry = tokenArr.expiry;

    //console.log(expiry);

    if (now > expiry) {

      //console.log('if')

      var apiCreds = {
        'grant_type': config.get("retsrabbit_grant_type"),
        'client_id': config.get("retsrabbit_client_id"),
        'client_secret': config.get("retsrabbit_client_secret"),
      }

      //console.log(apiCreds);

      var serial = JSON.stringify(apiCreds);

      var ares;

      /* var tokenres = syncrequest('POST',
        'http://werx.retsrabbit.com/api/oauth/access_token', {
        json: apiCreds,
      });
      var ares = JSON.parse(tokenres.getBody('utf8')); */

      var optionsdd = {
        method: 'POST',
        uri: 'http://werx.retsrabbit.com/api/oauth/access_token',
        body: serial,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      let rpbody;
      try {
        rpbody = await rp(optionsdd);
      } catch (error) {
        console.log(error);
      }

      ares = JSON.parse(rpbody);

      /* console.log(ares);
      return; */

      //console.log(ares);

      expiryDate = new Date(now.getTime() + (ares.expires_in) * 1000);

      apiToken = {

        token: ares.access_token,
        expiry: expiryDate
      };

      //console.log(apiToken);

      try {
        let query = {
          "_id": tokenArr._id
        };
        let options = {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        };

        try {
          save = await ApiToken.findOneAndUpdate(query, apiToken, options);
        } catch (err) {
          console.log(err); // TypeError: failed to fetch
        }
      } catch (err) {
        return res.status(400).send(err);
      }

      token = ares.access_token;


    } else {
      //console.log('else')
      token = tokenArr.token;
    }

  } else {

    var apiCreds = {
      'grant_type': config.get("retsrabbit_grant_type"),
      'client_id': config.get("retsrabbit_client_id"),
      'client_secret': config.get("retsrabbit_client_secret"),
    }

    var serial = JSON.stringify(apiCreds);

    var ares;

    var optionsdd = {
      method: 'POST',
      uri: 'http://werx.retsrabbit.com/api/oauth/access_token',
      body: serial,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let rpbody;
    try {
      rpbody = await rp(optionsdd);
    } catch (error) {
      console.log(error);
    }

    ares = JSON.parse(rpbody);

    /* console.log(ares);
    return;
 */
    /* var tokenres = syncrequest('POST',
      'http://werx.retsrabbit.com/api/oauth/access_token', {
      json: apiCreds,
    });
    var ares = JSON.parse(tokenres.getBody('utf8')); */

    /* request({
      uri: 'http://werx.retsrabbit.com/api/oauth/access_token',
      body: serial,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }, async function(err, re, body) {
      console.log("retsrabbit GRAB");
      if (err) {
        console.log(err);
        //res.send(err);
      }
      ares = JSON.parse(re.body); */
    //console.log('22');
    //console.log(ares);

    expiryDate = new Date(now.getTime() + (ares.expires_in) * 1000);
    //base = await RetsHelpers.retsrabbits(req.body, mlss);

    apiToken = new ApiToken({
      name: 'retsrabbit',
      slug: 'retsrabbit',
      token: ares.access_token,
      expiry: expiryDate
    });

    //console.log(apiToken);

    try {
      //let query = { "_id": id };
      let options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      };
      //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
      try {
        save = await ApiToken.findOneAndUpdate(filters, apiToken, options);
      } catch (err) {
        console.log(err); // TypeError: failed to fetch
      }
    } catch (err) {
      return res.status(400).send(err);
    }

    //console.log(JSON.parse(ares.getBody()));
    token = ares.access_token;

    //});

    //expires_in

  }

  try {
    //console.log(req.body.params);
    base = await RetsHelpers.retsrabbits(req.body, mlss);
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  console.log("add_chart")
  //console.log(api);
  //console.log(base);
  //console.log(token);

  if (base && token) {
    //console.log(base);
    //console.log(token);
    var options = {
      host: 'werx.retsrabbit.com',
      path: encodeURI("/api/v2/property/?" + (base)),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'X-SparkApi-User-Agent': 'APC',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
    };
  }
  //console.log(options);

  reqq = https.request(options, function (response) {
    //ress.setEncoding('utf8');
    var result = ''
    response.on('data', function (chunk) {
      result += chunk;
    });

    response.on('end', async () => {

      var res_standardStatus = JSON.parse(result);
      //console.log(res_standardStatus);
      var newArr = {};
      newArr.value = [];
      var distinctStandardObj = {};
      distinctStandardObj.status = [];
      distinctStandardObj.value = [];

      for (var k = 0; k < res_standardStatus.value.length; k++) {
        for (var l = k + 1; l < res_standardStatus.value.length; l++) {
          if (res_standardStatus.value[k].StandardStatus == res_standardStatus.value[l].StandardStatus) {
            if (!distinctStandardObj.status.includes(res_standardStatus.value[k].StandardStatus)) {
              distinctStandardObj.status.push(res_standardStatus.value[k].StandardStatus);
              distinctStandardObj.value.push(res_standardStatus.value[k]);
            }
          }
        }
        // newArr.push()
        try {
          res_standardStatus.value[k].StandardStatus = await statusHelpers.statuses(res_standardStatus.value[k].StandardStatus);
        } catch (err) {
          console.log(err); // TypeError: failed to fetch
        }
        newArr.value.push(res_standardStatus.value[k]);
      }
      // console.log(distinctStandardObj);

      for (var i = 0; i < distinctStandardObj.status.length; i++) {

        let returnStatus;
        try {
          returnStatus = await statusHelpers.statuses(distinctStandardObj.status[i]);
        } catch (err) {
          console.log(err); // TypeError: failed to fetch
        }
        if (!returnStatus) {
          var statusObj = {};
          statusObj.propertysample = [];
          statusObj.unknownstatus = distinctStandardObj.status[i];
          statusObj.updated = new Date();
          statusObj.propertysample.push(distinctStandardObj.value[i]);
          // console.log(statusObj);
          let unknownStatus_notification;
          try {
            unknownStatus_notification = await fs.readFileSync(__dirname + '/../email_templates/notify_unknown_status.html');
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }
          let fieldsToSet = statusObj;
          var u_statusName = statusObj.unknownstatus;

          unknown_status = new Unknownstatus(fieldsToSet);

          for (let k = 0; k < unknown_status.propertysample.length; k++) {
            delete unknown_status.propertysample[k]["listing"]; //delete because of @odata.id key generate error
          }

          try {
            u_status = await Unknownstatus.findOne({
              "unknownstatus": u_statusName
            });
          } catch (err) {
            console.log(err); // TypeError: failed to fetch
          }

          // console.log(u_status);

          // console.log('lastUpdatedDate =======', lastUpdatedDate);
          if (u_status) {

            var lastUpdatedDate = u_status.updated;

            var newPropertySample;

            u_status.propertysample.push(statusObj.propertysample[0]);

            newPropertySample = u_status.propertysample

            var newFieldsToSet = {};
            // newFieldsToSet.propertysample = [];
            newFieldsToSet.propertysample = newPropertySample;
            newFieldsToSet.updated = new Date();
            // console.log(u_status.created);
            // console.log(newFieldsToSet.updated);
            try {
              let query = {
                "_id": u_status._id
              };
              let options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
              };
              //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
              try {
                save = await Unknownstatus.findOneAndUpdate(query, newFieldsToSet, options);
              } catch (err) {
                console.log(err); // TypeError: failed to fetch
              }

              var last_updated_date = lastUpdatedDate;
              var c_date = new Date();
              // console.log('c_date....', c_date);
              // console.log('last_updated_date....', last_updated_date);
              var date1 = new Date(last_updated_date);
              var date2 = new Date(c_date);

              var Difference_In_Time = date2.getTime() - date1.getTime();
              // console.log('Difference_In_Time....', Difference_In_Time);
              var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
              // console.log('Difference_In_Days....', Difference_In_Days);
              if (Difference_In_Days >= 1) {
                // console.log('in if ....');
                sendMail();
              } else {
                // do nothing;
              }
            } catch (err) {
              console.log(err);
              // return res.status(400).send(err);
            }
            // res.send({ "message": "Unknown status modified successfully." });
          } else {

            try {
              save = await unknown_status.save();

            } catch (err) {
              return res.status(400).send(err);
            }

            // res.send({ "message": "Unknown status successfully added." });
            sendMail();
          }
          async function sendMail() {
            let imgLogo = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/public/apcri-email-logo.png";
            const template = handlebars.compile(unknownStatus_notification.toString());
            const replacements = {
              unknown_status: u_statusName,
              imgLogo: imgLogo
              //site_url: config.get("SITE_URL")
            };

            const htmlToSend = template(replacements);

            const mailOptions = {
              from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
              to: config.get("unknownstatus_email"),
              // to: 'nitin@tatrasdata.com',
              subject: 'Unknown Status',
              html: htmlToSend,
            };

            try {
              // await transporter.sendMail(mailOptions);
              transporter.sendMail(mailOptions);
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
      res.send(JSON.stringify(newArr));
    });

  })

  reqq.on('error', (error) => {
    res.send(error);
  })

  reqq.end();

};

exports.add_chart_spark = async (req, res) => {

  const body = req.body;
  //console.log(body.params.listingkey);
  let listingkeys = body.params.listingkey.split(',');
  //console.log(listingkeys);
  let inQueue = [];
  var data = [];

  /* for (const listingkey of listingkeys) {
    //console.log(listingkey);
    var optionsdd = {
      method: 'GET',
      uri: 'https://sparkapi.com/v1/listings/' + listingkey,
      //body: serial,
      headers: {
        'Authorization': 'Bearer ' + config.get("spark_refresh_token"),
        'X-SparkApi-User-Agent': 'APC'
      }
    };
    var ares;
    try {
      ares = await rp(optionsdd);
    } catch (error) {
      console.log(error);
    }
    console.log(JSON.parse(ares));
  }
  */

  listingkeys.forEach(function (listingkey, index) {
    //console.log(listingkey);
    var ares = syncrequest('GET',
      'https://sparkapi.com/v1/listings/' + listingkey, {
      headers: {
        'Authorization': 'Bearer ' + config.get("spark_refresh_token"),
        'X-SparkApi-User-Agent': 'APC'
      }
    });

    var aresphotos = syncrequest('GET',
      'https://sparkapi.com/v1/listings/' + listingkey + '/photos', {
      headers: {
        'Authorization': 'Bearer ' + config.get("spark_refresh_token"),
        'X-SparkApi-User-Agent': 'APC'
      }
    });

    const photos = [];

    JSON.parse(aresphotos.getBody()).D.Results.forEach(function (photo, index) {
      photos.push(photo.UriLarge)
    });

    var el = JSON.parse(ares.getBody()).D.Results[0].StandardFields;
    /*  console.log("ListPrice"+el.ListPrice);
     console.log("ClosePrice"+el.ClosePrice);
     console.log("MlsStatus"+el.MlsStatus); */
    //el.saleDate = new Date();
    //el.CloseDate = new Date();
    //console.log("ClosePriceGetting..."+el.ClosePrice);
    //el.ClosePrice = 50000+(index*45600);
    //el.saleDate = new Date();
    /* if(el.ClosePrice == "********"){
        el.LivingArea = 1;
        el.ListPrice = 1;
        el.ClosePrice = 1;
        el.saleDate = new Date();
        el.CloseDate = new Date();
    } */
    //20110128190201945321000000

    /* console.log("ListPrice-"+el.ListPrice);
    console.log("CloseDate-"+el.CloseDate);
    console.log("ClosedTimestamp-"+el.ClosedTimestamp);
    console.log("ClosePrice-"+el.ClosePrice);
    console.log("listingkey-"+listingkey);
    console.log("StandardStatus-"+el.StandardStatus);
    console.log("living area-", el.LivingArea); */

    if (el.LivingArea === '0' || el.LivingArea === null || el.LivingArea === '********' || el.LivingArea < 1 || el.StreetNumber === null ||
      el.StreetName === null || el.City === null || el.ListPrice === null ||
      el.ListingId === null || el.PostalCode === null) {
      //console.log("StandardStatus-"+el.StandardStatus);
      /* console.log(listingkey);
      console.log(el.StandardStatus);
      console.log("living area: ", el.LivingArea) */
    } else {

      //console.log("listingkey--"+listingkey);
      /* console.log("ListPrice-"+el.ListPrice);
      console.log("ClosePrice-"+el.ClosePrice);
      console.log("listingkey-"+listingkey);
      console.log("StandardStatus-"+el.StandardStatus);
      console.log("living area-", el.LivingArea); */

      var parsedDaysOnMarket = null;
      //console.log("DaysOnMarket-"+el.DaysOnMarket)
      if (el.StandardStatus === 'Closed' && el.OriginalOnMarketTimestamp != null) {
        // Perform Math for Closed Properties
        //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
        var closedDate = new Date(el.CloseDate);
        //console.log("A: " + closedDate);
        var entryDate = new Date(el.OriginalOnMarketTimestamp);
        //console.log("B: " + entryDate);
        var timeDiff = closedDate.getTime() - entryDate.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        //console.log("Closed Days: " + diffDays);
        parsedDaysOnMarket = diffDays;
      } else if ((el.StandardStatus.toLowerCase() === 'active contingent' || el.StandardStatus.substring(0, 1).toLowerCase() === 'p' || el.StandardStatus.substring(0, 3).toLowerCase() === 'opt' ||
        el.StandardStatus.substring(0, 1).toLowerCase() === 'b' || el.StandardStatus.substring(0, 1).toLowerCase() === 'u' ||
        el.StandardStatus.substring(0, 2).toLowerCase() === 'co' || el.StandardStatus.substring(0, 2).toLowerCase() === 'in' ||
        el.StandardStatus.toLowerCase() === 'activeundercontract' || el.StandardStatus.toLowerCase() === 'application approved' || el.StandardStatus.toLowerCase() === 'application submitted') && el.OriginalOnMarketTimestamp != null) {
        // Perform Math for Pending Properties
        //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
        var currentDate = new Date();
        //console.log("AA: " + currentDate);
        var entryDate = new Date(el.OriginalOnMarketTimestamp);
        //console.log("BB: " + entryDate);
        var timeDiff = currentDate.getTime() - entryDate.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        //console.log("Pending Days: " + diffDays);
        parsedDaysOnMarket = diffDays;
      } else if (el.StandardStatus === 'Active' && el.OriginalOnMarketTimestamp != null) {
        // Perform Math for Active Properties
        //console.log("Fixing Null DOM Listing ID: " + el.ListingId)
        var currentDate = new Date();
        //console.log("AAA: " + currentDate);
        var entryDate = new Date(el.OriginalOnMarketTimestamp);
        //console.log("BBB: " + entryDate);
        var timeDiff = currentDate.getTime() - entryDate.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        //console.log("Active Days: " + diffDays);
        parsedDaysOnMarket = diffDays;

      } else {
        //console.log("Dashed DOM")
        parsedDaysOnMarket = "-";
      }

      if (parsedDaysOnMarket < 0) {
        //console.log("Found Negative Days for " + el.ListingId + ": " + parsedDaysOnMarket);
        parsedDaysOnMarket = Math.abs(parsedDaysOnMarket);
      } else {
        //console.log("Carry On")
      }

      var parsedDaysOnMarketPriceChange = null;
      if (el.StandardStatus === 'Closed' && el.PriceChangeTimestamp != null) {
        // PerforsaysOnMarketPriceChange = diffDays;
      } else if ((el.StandardStatus.toLowerCase() === 'active contingent' || el.StandardStatus.substring(0, 1).toLowerCase() === 'p' || el.StandardStatus.substring(0, 3).toLowerCase() === 'opt' ||
        el.StandardStatus.substring(0, 1).toLowerCase() === 'b' || el.StandardStatus.substring(0, 1).toLowerCase() === 'u' ||
        el.StandardStatus.substring(0, 2).toLowerCase() === 'co' || el.StandardStatus.substring(0, 2).toLowerCase() === 'in' ||
        el.StandardStatus.toLowerCase() === 'activeundercontract' || el.StandardStatus.toLowerCase() === 'application approved' || el.StandardStatus.toLowerCase() === 'application submitted') && el.PriceChangeTimestamp != null) {
        // Perform Math for Pending Properties
        //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
        var currentDate = new Date();
        //console.log("AA: " + currentDate);
        var entryDate = new Date(el.PriceChangeTimestamp);
        //console.log("BB: " + entryDate);
        var timeDiff = currentDate.getTime() - entryDate.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        //console.log("Pending Days: " + diffDays);
        parsedDaysOnMarketPriceChange = diffDays;
      } else if (el.StandardStatus === 'Active' && el.PriceChangeTimestamp != null) {
        // Perform Math for Active Properties
        //console.log("LPXDOM Set-Up Listing ID: " + el.ListingId)
        var currentDate = new Date();
        //console.log("AAA: " + currentDate);
        var entryDate = new Date(el.PriceChangeTimestamp);
        //console.log("BBB: " + entryDate);
        var timeDiff = currentDate.getTime() - entryDate.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        //console.log("Active Days: " + diffDays);
        parsedDaysOnMarketPriceChange = diffDays;
      } else {
        //console.log("Equalizing LPxDOM")
        //parsedDaysOnMarketPriceChange = parsedDaysOnMarket;
        //console.log("Dashing LPxDOM")
        parsedDaysOnMarketPriceChange = "-";
      }


      // DOM Validation
      if (parsedDaysOnMarket != "-" && parsedDaysOnMarketPriceChange != "-" && parsedDaysOnMarket < parsedDaysOnMarketPriceChange) {
        //console.log ("Correcting DOM")
        if (el.StandardStatus === 'Closed' && el.OriginalOnMarketTimestamp != null) {
          // Perform Math for Closed Properties
          //console.log("Listing ID: " + el.ListingId)
          var closedDate = new Date(el.CloseDate);
          //console.log("A: " + closedDate);
          var entryDate = new Date(el.OriginalOnMarketTimestamp);
          //console.log("B: " + entryDate);
          var timeDiff = closedDate.getTime() - entryDate.getTime();
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          //console.log("Closed Days: " + diffDays);
          parsedDaysOnMarket = diffDays;
        } else if ((el.StandardStatus.toLowerCase() === 'active contingent' || el.StandardStatus.substring(0, 1).toLowerCase() === 'p' || el.StandardStatus.substring(0, 3).toLowerCase() === 'opt' ||
          el.StandardStatus.substring(0, 1).toLowerCase() === 'b' || el.StandardStatus.substring(0, 1).toLowerCase() === 'u' ||
          el.StandardStatus.substring(0, 2).toLowerCase() === 'co' || el.StandardStatus.substring(0, 2).toLowerCase() === 'in' ||
          el.StandardStatus.toLowerCase() === 'activeundercontract' || el.StandardStatus.toLowerCase() === 'application approved' || el.StandardStatus.toLowerCase() === 'application submitted') && el.OriginalOnMarketTimestamp != null) {
          // Perform Math for Pending Properties
          //console.log("Listing ID: " + el.ListingId)
          var currentDate = new Date();
          //console.log("AA: " + currentDate);
          var entryDate = new Date(el.OriginalOnMarketTimestamp);
          //console.log("BB: " + entryDate);
          var timeDiff = currentDate.getTime() - entryDate.getTime();
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          //console.log("Pending Days: " + diffDays);
          parsedDaysOnMarket = diffDays;
        } else if (el.StandardStatus === 'Active' && el.OriginalOnMarketTimestamp != null) {
          // Perform Math for Active Properties
          //console.log("Listing ID: " + el.ListingId)
          var currentDate = new Date();
          //console.log("AAA: " + currentDate);
          var entryDate = new Date(el.OriginalOnMarketTimestamp);
          //console.log("BBB: " + entryDate);
          var timeDiff = currentDate.getTime() - entryDate.getTime();
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          //console.log("Active Days: " + diffDays);
          parsedDaysOnMarket = diffDays;
        } else {
          //console.log ("Data not Accessible - Missing OriginalEntryTimestamp");
        }
      } else {
        //console.log("DOM is already Validated");
      }

      if (parsedDaysOnMarketPriceChange > parsedDaysOnMarket) {
        //console.log("Equal ALL")
        parsedDaysOnMarketPriceChange = parsedDaysOnMarket;
      } else if (parsedDaysOnMarketPriceChange < 0) {
        //console.log("Dashed Negative")
        parsedDaysOnMarketPriceChange = "-";
      } else {
        //console.log("Continue")
      }

      var parsedYearBuilt = (el.YearBuilt != null) ? el.YearBuilt : "-";
      var parsedListPrice = null
      var parsedClosedPrice = null
      var parsedSquareFootage = null;
      var parsedPrice = null;
      /* if (localStorage.getItem('api') === 'Bridge') {
          parsedListPrice = el.ListPrice;
          parsedClosedPrice = el.ClosePrice;
          parsedSquareFootage = el.LivingArea;
          parsedPrice = el.StandardStatus === 'Closed' ? el.ClosePrice : el.ListPrice;
      } else { */
      parsedListPrice = el.ListPrice ? parseInt(el.ListPrice) : "-";
      parsedClosedPrice = (el.ClosePrice) ? parseInt(el.ClosePrice) : (el.ClosePrice);
      parsedSquareFootage = parseInt(el.LivingArea);
      parsedPrice = parseInt(el.StandardStatus === 'Closed' ? el.ClosePrice : el.ListPrice);
      //}
      var parsedPricePerSqFt = parsedListPrice / parsedSquareFootage;
      var parsedSalesPriceToListPrice = (parsedClosedPrice / parsedListPrice) * 100;
      var parsedBathrooms;
      /* if ($scope.MLSKey === "CTAR") {
      //console.log("Grabbing Decimal Value")
      parsedBathrooms = el.BathroomsTotalDecimal;
      //console.log("Got Value - " + parsedBathrooms);
      if (parsedBathrooms === null) {
          parsedBathrooms = "-";
          //console.log("Null Value")
      } else {
          var subNum = parsedBathrooms.substring(2, 3);
          var charLength = parsedBathrooms.length;
          if (subNum === "5") {
          parsedBathrooms = parsedBathrooms.slice(0, charLength - 1);
          //console.log("Sliced Value (.5): " + parsedBathrooms)
          } else {
          parsedBathrooms = parsedBathrooms.slice(0, charLength - 3);
          //console.log("Sliced Value (.0): " + parsedBathrooms)
          }
      }
      } else */
      if (el.BathsFull === null && el.BathsHalf === null) {
        //console.log("Nothing Here At All")
        parsedBathrooms = "-";
      } else if (el.BathsFull === 0) {
        //console.log("Nothing Here Half Zero")
        parsedBathrooms = parseInt(el.BathsFull);
      } else if (el.BathsFull === null) {
        //console.log("Nothing Here Half Null")
        parsedBathrooms = parseInt(el.BathsFull);
      } else {
        //console.log("Do Math")
        parsedBathrooms = parseInt(el.BathsFull) + (parseInt(el.BathsHalf) / 2);
      }

      /* if( isNaN(parsedBathrooms) || parsedBathrooms == '-' ){
          parsedBathrooms = el.BathroomsTotalDecimal;
          //console.log("Got Value - " + parsedBathrooms);
          if (parsedBathrooms === null) {
              parsedBathrooms = "-";
              //console.log("Null Value")
          } else {
              var subNum = parsedBathrooms.substring(2, 3);
              var charLength = parsedBathrooms.length;
              if (subNum === "5") {
              parsedBathrooms = parsedBathrooms.slice(0, charLength - 1);
              //console.log("Sliced Value (.5): " + parsedBathrooms)
              } else {
              parsedBathrooms = parsedBathrooms.slice(0, charLength - 3);
              //console.log("Sliced Value (.0): " + parsedBathrooms)
              }
          }
      } */

      //console.log(parsedBathrooms);

      var parsedBedrooms;
      /* if ($scope.MLSKey === "GMLS") {
      //console.log("IsGMLS is true")
      parsedBedrooms = el.MainLevelBedrooms ? parseInt(el.MainLevelBedrooms) : "-";
      } else { */
      //console.log("All Else")
      parsedBedrooms = el.BedsTotal ? parseInt(el.BedsTotal) : "-";
      /* } */
      //console.log("ParsedBed: " + parsedBedrooms)
      //console.log("ParsedBath: " + parsedBathrooms)
      //console.log("ParsedDays: " + parsedDaysOnMarket)

      inQueue.push({
        mlsNumber: el.ListingId,
        address: el.StreetNumber + " " + el.StreetName,
        city: el.City,
        state: el.StateOrProvince,
        zip: el.PostalCode,
        lat: el.Latitude,
        long: el.Longitude,
        yearBuilt: parsedYearBuilt,
        bed: parsedBedrooms,
        bath: parsedBathrooms,
        days: parsedDaysOnMarket,
        daysPx: parsedDaysOnMarketPriceChange,
        status: el.StandardStatus,
        squareFootage: parsedSquareFootage,
        price: parsedPrice,
        closePrice: parsedClosedPrice,
        listPrice: parsedListPrice,
        saleDate: (el.StandardStatus === 'Sold' || el.StandardStatus === 'Closed') ? el.CloseDate : null,
        priceSqFt: parsedPricePerSqFt,
        salesToList: parsedSalesPriceToListPrice,
        photos: photos,
      });
    }

    //res.send(inQueue);
    //return false;
    //});

    /* formdata['relatedHomes'] = inQueue;
    formdata['activeHomes'] = [];
    formdata['pendingHomes'] = [];
    formdata['closedHomes'] = [];
    for (var i = 0; i < inQueue.length; i++) {
        //console.log(inQueue[i].status);
        if (inQueue[i].status === "Active") {
            //console.log("Pulling Status of Active Home " + i + " : " + relatedHomes[i].status)
            formdata['activeHomes'].push(inQueue[i]);
        } else if ((inQueue[i].status.toLowerCase() === 'active contingent' || inQueue[i].status.substring(0, 1).toLowerCase() === 'p' || inQueue[i].status.substring(0, 3).toLowerCase() === 'opt' ||
        inQueue[i].status.substring(0, 1).toLowerCase() === 'b' || inQueue[i].status.substring(0, 1).toLowerCase() === 'u' ||
        inQueue[i].status.substring(0, 2).toLowerCase() === 'co' || inQueue[i].status.substring(0, 2).toLowerCase() === 'in' ||
        inQueue[i].status.toLowerCase() === 'activeundercontract' || inQueue[i].status.toLowerCase() === 'application approved' || inQueue[i].status.toLowerCase() === 'application submitted')) {
            //console.log("Pulling Status of Pending Home " + i + " : " + relatedHomes[i].status)
            formdata['pendingHomes'].push(inQueue[i]);
        } else {
            //console.log("Pulling Status of Closed Home " + i + " : " + relatedHomes[i].status)
            formdata['closedHomes'].push(inQueue[i]);
        }
    }
    formdata['marketConditions'] = [];
    /* formdata['marketConditions']['compListingsTotal'] = total_count;
    formdata['marketConditions']['compActiveListings'] = active_count;
    formdata['marketConditions']['compSoldListings'] = cancel_count;
    formdata['marketConditions']['compPendingListings'] = pending_count > 0 ? this.pending_count : 1; */
    // Sends an established Date Range
    //console.log(new Date(),new Date(formdata['relatedProperty']['min_date']))
    //formdata['marketConditions']['dateRange'] = Math.ceil(Math.abs(new Date() - new Date(formdata['relatedProperty']['min_date'])) / 86400000);

    // Set Map Data for Chart-Detail
    //formdata['mapDetailCenter'] = [];
    /* formdata['mapDetailCenter']['lat'] = this.mapCenter.lat();
    formdata['mapDetailCenter']['lng'] = this.mapCenter.lng();
    formdata['mapDetailCenter']['zoom'] = this.mapObj.getZoom(); */

    // Checking if chart is for research or not
    //formdata['relatedProperty'].researchCheck = $rootScope.researchDisplay;
    /* this.loader = true;
    var body = {
        'activeHomes': formdata['activeHomes'],
        'agent': formdata['agent'],
        'client': formdata['client'],
        'id': formdata['id'],
        'closedHomes': formdata['closedHomes'],
        'mapDetailCenter': {
            'lat': formdata['mapDetailCenter']['lat'],
            'lng': formdata['mapDetailCenter']['lng'],
            'zoom': formdata['mapDetailCenter']['zoom']
        },
        'marketConditions': {
            'compListingsTotal': formdata['marketConditions']['compListingsTotal'],
            'compActiveListings': formdata['marketConditions']['compActiveListings'],
            'compSoldListings': formdata['marketConditions']['compSoldListings'],
            'compPendingListings': formdata['marketConditions']['compPendingListings'],
            'dateRange': formdata['marketConditions']['dateRange']
        },
        'pendingHomes': formdata['pendingHomes'],
        'relatedHomes': formdata['relatedHomes'],
        'relatedProperty': formdata['relatedProperty'],
        'targetProperty': formdata['targetProperty'],
        'sqr_ft': formdata['sqr_ft'],
        'chart_title': formdata['chart_title']
    } */


    /*  data[index] = JSON.parse(ares.getBody()).D.Results[0].StandardFields;
     data[index]["photos"] = photos; */

  });

  var formdata = [];
  formdata['relatedHomes'] = inQueue;
  formdata['activeHomes'] = [];
  formdata['pendingHomes'] = [];
  formdata['closedHomes'] = [];
  for (var i = 0; i < inQueue.length; i++) {
    //console.log(inQueue[i].status);
    if (inQueue[i].status === "Active") {
      //console.log("Pulling Status of Active Home " + i + " : " + relatedHomes[i].status)
      formdata['activeHomes'].push(inQueue[i]);
    } else if ((inQueue[i].status.toLowerCase() === 'active contingent' || inQueue[i].status.substring(0, 1).toLowerCase() === 'p' || inQueue[i].status.substring(0, 3).toLowerCase() === 'opt' ||
      inQueue[i].status.substring(0, 1).toLowerCase() === 'b' || inQueue[i].status.substring(0, 1).toLowerCase() === 'u' ||
      inQueue[i].status.substring(0, 2).toLowerCase() === 'co' || inQueue[i].status.substring(0, 2).toLowerCase() === 'in' ||
      inQueue[i].status.toLowerCase() === 'activeundercontract' || inQueue[i].status.toLowerCase() === 'application approved' || inQueue[i].status.toLowerCase() === 'application submitted')) {
      //console.log("Pulling Status of Pending Home " + i + " : " + relatedHomes[i].status)
      formdata['pendingHomes'].push(inQueue[i]);
    } else {
      //console.log("Pulling Status of Closed Home " + i + " : " + relatedHomes[i].status)
      formdata['closedHomes'].push(inQueue[i]);
    }
  }

  formdata['marketConditions'] = [];
  /* formdata['marketConditions']['compListingsTotal'] = this.total_count;
  formdata['marketConditions']['compActiveListings'] = this.active_count;
  formdata['marketConditions']['compSoldListings'] = this.cancel_count;
  formdata['marketConditions']['compPendingListings'] = this.pending_count > 0 ? this.pending_count : 1; */
  // Sends an established Date Range
  //console.log(new Date(),new Date(formdata['relatedProperty']['min_date']))
  //formdata['marketConditions']['dateRange'] = Math.ceil(Math.abs(new Date() - new Date(formdata['relatedProperty']['min_date'])) / 86400000);

  // Set Map Data for Chart-Detail
  formdata['mapDetailCenter'] = [];
  //formdata['sqr_ft'] = this.addChart.controls.sqr_ft.value;//property id
  //formdata['chart_title'] = this.addChart.controls.chart_title.value;
  /* formdata['mapDetailCenter']['lat'] = this.mapCenter.lat();
  formdata['mapDetailCenter']['lng'] = this.mapCenter.lng();
  formdata['mapDetailCenter']['zoom'] = this.mapObj.getZoom(); */

  // Checking if chart is for research or not
  //formdata['relatedProperty'].researchCheck = $rootScope.researchDisplay;
  this.loader = true;
  var body2 = {
    'activeHomes': formdata['activeHomes'],
    'agent': formdata['agent'],
    'client': formdata['client'],
    'id': formdata['id'],
    'closedHomes': formdata['closedHomes'],
    'mapDetailCenter': {
      'lat': formdata['mapDetailCenter']['lat'],
      'lng': formdata['mapDetailCenter']['lng'],
      'zoom': formdata['mapDetailCenter']['zoom']
    },
    'marketConditions': {
      'compListingsTotal': formdata['marketConditions']['compListingsTotal'],
      'compActiveListings': formdata['marketConditions']['compActiveListings'],
      'compSoldListings': formdata['marketConditions']['compSoldListings'],
      'compPendingListings': formdata['marketConditions']['compPendingListings'],
      'dateRange': formdata['marketConditions']['dateRange']
    },
    'pendingHomes': formdata['pendingHomes'],
    'relatedHomes': formdata['relatedHomes'],
    'relatedProperty': formdata['relatedProperty'],
    'targetProperty': formdata['targetProperty'],
    'sqr_ft': formdata['sqr_ft'],
    'chart_title': formdata['chart_title']
  }


  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  try {
    user = await User.findOne({
      "_id": Id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  let client;
  let property;
  if (req.body.client_id) {

    try {
      client = await Client.findOne({
        "_id": req.body.client_id
      });
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }

  }

  if (req.body.property_id) {

    try {
      property = await Property.findOne({
        "_id": req.body.property_id
      });
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }

  //console.log(body2.chart_title);
  var id = body2.id;

  if (user) {
    var fieldsToSet = {
      userId: Id,
      chart_title: req.body.chart_title,
      property_id: req.body.property_id ? req.body.property_id : '',
      agent: {
        fullName: user.firstname + ' ' + user.lastname,
        company: user.companyname,
        phone: user.phone,
        email: user.email,
        website: user.website,
        photo: user.profile_image,
        photo_50X50: user.profile_image_50X50 ? user.profile_image_50X50 : user.profile_image,
        photo_150X150: user.profile_image_150X150 ? user.profile_image_150X150 : user.profile_image,
        photo_250X250: user.profile_image_250X250 ? user.profile_image_250X250 : user.profile_image,
        logo: user.logo,
        logo_50X50: user.logo_50X50 ? user.logo_50X50 : user.logo,
        logo_150X150: user.logo_150X150 ? user.logo_150X150 : user.logo,
        logo_250X250: user.logo_250X250 ? user.logo_250X250 : user.logo
        //streetAddress: body2.agent.streetAddress,
        //city: body2.agent.city,
        //zip: body2.agent.zip
      },
      relatedProperty: {
        //researchCheck: body2.relatedProperty.researchCheck,
        //mls: body2.relatedProperty.mls,
        propertySubType: req.body.property_type,
        bed: req.body.bedrooms,
        bath: req.body.bathrooms,
        //wf: body2.relatedProperty.wf,
        //pool: body2.relatedProperty.pool,
        //hopa: body2.relatedProperty.hopa,
        //hoa: body2.relatedProperty.hoa,
        //subDivisionArray: body2.relatedProperty.sub_divisions,
        //zipCodeArray: body2.relatedProperty.zip_code,
        //areaArray: body2.relatedProperty.areaArray,
        //minYear: req.body.min_year,
        //maxYear: req.body.max_year,
        builtYear: req.body.built_year
        //minPrice: body2.relatedProperty.min_price,
        //maxPrice: body2.relatedProperty.max_price,
        ///minArea: body2.relatedProperty.min_square_footage,
        //maxArea: body2.relatedProperty.max_square_footage,
        //sminClose: body2.relatedProperty.min_date
      },
      marketConditions: {
        /*  compListingsTotal: body2.marketConditions.compListingsTotal,
         compActiveListings: body2.marketConditions.compActiveListings,
         compSoldListings: body2.marketConditions.compSoldListings,
         compPendingListings: body2.marketConditions.compPendingListings,
         dateRange: body2.marketConditions.dateRange */
      },
      //mapDetailCenter: body2.mapDetailCenter,
      relatedHomes: body2.relatedHomes,
      activeHomes: body2.activeHomes,
      pendingHomes: body2.pendingHomes,
      closedHomes: body2.closedHomes
    };
    //console.log(fieldsToSet)
  }

  if (client) {

    fieldsToSet["client"] = {
      first: client.firstname,
      last: client.lastname,
      phone: client.phone,
      email: client.email
    };

  }

  var state;

  if (property) {

    //State.find({}

    try {
      state = await State.findOne({
        "_id": property.state
      });
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }

    if (state) {
      fieldsToSet["targetProperty"] = {

        address: property.address,
        city: property.city,
        state: state.name,
        squareFootage: property.square_footage,
        zip: property.zip,
        image: property.property_image,
        seasonality: property.seasonality ? property.seasonality : new Date(),
        quality: property.quality ? property.quality : 3,
        site: property.site ? property.site : 3,
        condition: property.condition ? property.condition : 3,
        layout: property.layout ? property.layout : 3,
        bedroom: property.bedroom,
        bathroom: property.bathroom,
        mls_number: property.mls_number,
        property_type: property.property_type,
        //lat: property.lat,
        //lng: property.lng
      };
    }

  } else {
    fieldsToSet["targetProperty"] = {

      /* address: property.address,
      city: property.city,
      state: state.name, */
      squareFootage: req.body.sqr_ft,
      /* zip: property.zip,
      image: property.property_image, */
      seasonality: new Date(),
      quality: 3,
      site: 3,
      condition: 3,
      layout: 3
      //lat: property.lat,
      //lng: property.lng
    };
  }

  /* console.log(fieldsToSet);
  res.send({ "message": "Chart successfully added.", "fieldsToSet": fieldsToSet }); */

  request({
    uri: config.get("analytic_url") + '/outlier_detection',
    body: JSON.stringify(fieldsToSet),
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }, function (err, re, body) {

    if (err) {
      console.log(err);
      //res.send(err);
    }
    //console.log("res: ", re);
    if (re.statusCode == 200) {
      return res.send({
        data: fieldsToSet,
        response: re.body
      });
    } else {
      return res.status(re.statusCode).send({
        error: "something went wrong",
        data: fieldsToSet,
        response: re.body
      });
    }
    //return res.send({ data: fieldsToSet, response: re.body });
  });

  /* chart = new Chart(fieldsToSet);
  var save;
  //console.log(id);
  if (id) {
      //console.log('if');
      try {
          let query = { "_id": id };
          let options = { upsert: true, new: true, setDefaultsOnInsert: true };
          //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
          save = await Chart.findOneAndUpdate(query, fieldsToSet, options);
      } catch (err) {
          return res.status(400).send(err);
      }
      res.send({ "message": "Chart modified successfully.", "_id": id });
  }
  else {
      //console.log('else');
      try {
          save = await chart.save();
      } catch (err) {
          return res.status(400).send(err);
      }
      res.send({ "message": "Chart successfully added.", "_id": save._id,"fieldsToSet":fieldsToSet });
  } */

  //res.send(body2);

};

exports.add_chart_response = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;
  // console.log(req.user);
  const Id = req.user._id;

  try {
    user = await User.findOne({
      "_id": Id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  let client;
  let property;
  if (req.body.client) {

    try {
      client = await Client.findOne({
        "_id": req.body.client
      });
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }

  if (req.body.targetProperty) {

    try {
      property = await Property.findOne({
        "_id": req.body.targetProperty
      });
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }

  //console.log(req.body.chart_title);
  var id = req.body.id;

  let value;
  try {
    value = await rclient.get('currencies');
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  var quotes = {
    USDMXN: 18.79079,
    USDCAD: 1.32239,
    USDUSD: 1
  };
  if (value === null) {
    //console.log("Null reset")
    value = quotes;
    //console.log(value);
  } else {
    //console.log("Got Values");
    value = JSON.parse(value).quotes
    //console.log(value);
  }

  if (user) {
    var fieldsToSet = {
      userId: Id,
      chart_title: req.body.chart_title,
      property_id: req.body.targetProperty ? req.body.targetProperty : '',
      currencyValues: value,
      agent: {
        fullName: user.firstname + ' ' + user.lastname,
        company: user.companyname,
        phone: user.phone,
        email: user.email,
        website: user.website,
        photo: user.profile_image,
        photo_50X50: user.profile_image_50X50 ? user.profile_image_50X50 : user.profile_image,
        photo_150X150: user.profile_image_150X150 ? user.profile_image_150X150 : user.profile_image,
        photo_250X250: user.profile_image_250X250 ? user.profile_image_250X250 : user.profile_image,
        logo: user.logo,
        logo_50X50: user.logo_50X50 ? user.logo_50X50 : user.logo,
        logo_150X150: user.logo_150X150 ? user.logo_150X150 : user.logo,
        logo_250X250: user.logo_250X250 ? user.logo_250X250 : user.logo
        //streetAddress: req.body.agent.streetAddress,
        //city: req.body.agent.city,
        //zip: req.body.agent.zip
      },
      relatedProperty: {
        //researchCheck: req.body.relatedProperty.researchCheck,
        mls: req.body.relatedProperty.mls,
        mls_id: req.body.relatedProperty.mls_id,
        propertySubType: req.body.relatedProperty.property_type,
        listing_type: req.body.relatedProperty.listing_type,
        furnished: req.body.relatedProperty.furnished,
        wf: req.body.relatedProperty.waterfront,
        pool: req.body.relatedProperty.private_pool,
        hopa: req.body.relatedProperty.hopa,
        hoa: req.body.relatedProperty.hoa,
        folionumber: req.body.relatedProperty.folionumber,
        subDivisionArray: req.body.relatedProperty.sub_divisions,
        zipCodeArray: req.body.relatedProperty.zip_code,
        //areaArray: req.body.relatedProperty.areaArray,
        minYear: req.body.relatedProperty.min_year,
        maxYear: req.body.relatedProperty.max_year,
        minPrice: req.body.relatedProperty.min_price,
        maxPrice: req.body.relatedProperty.max_price,
        minArea: req.body.relatedProperty.min_square_footage,
        maxArea: req.body.relatedProperty.max_square_footage,
        minClose: req.body.relatedProperty.min_date,
        maxClose: req.body.relatedProperty.max_date,
        isSSO: req.body.relatedProperty.isSSO
      },
      marketConditions: {
        compListingsTotal: req.body.marketConditions.compListingsTotal,
        compActiveListings: req.body.marketConditions.compActiveListings,
        compSoldListings: req.body.marketConditions.compSoldListings,
        compPendingListings: req.body.marketConditions.compPendingListings,
        dateRange: req.body.marketConditions.dateRange
      },
      mapDetailCenter: req.body.mapDetailCenter,
      relatedHomes: req.body.relatedHomes,
      offMarketHomes: req.body.offMarketHomes,
      activeHomes: req.body.activeHomes,
      pendingHomes: req.body.pendingHomes,
      closedHomes: req.body.closedHomes
    };
    //console.log(fieldsToSet)
  }

  if (client) {

    fieldsToSet["client"] = {
      client_id:req.body.client,
      first: client.firstname,
      last: client.lastname,
      phone: client.phone,
      email: client.email
    };

  }

  var state;

  if (property) {

    //State.find({}

    try {
      state = await State.findOne({
        "_id": property.state
      });
    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }

    if (state) {
      fieldsToSet["targetProperty"] = {

        address: property.address,
        city: property.city,
        state: state.name,
        squareFootage: property.square_footage,
        zip: property.zip,
        image: property.property_image,
        seasonality: property.seasonality ? property.seasonality : new Date(),
        quality: property.quality ? property.quality : 3,
        site: property.site ? property.site : 3,
        condition: property.condition ? property.condition : 3,
        layout: property.layout ? property.layout : 3,
        bedroom: property.bedroom,
        bathroom: property.bathroom,
        mls_number: property.mls_number,
        property_type: property.property_type,
        //lat: property.lat,
        //lng: property.lng
      };
    }

  } else {
    fieldsToSet["targetProperty"] = {

      /* address: property.address,
      city: property.city,
      state: state.name, */
      squareFootage: req.body.sqr_ft,
      /* zip: property.zip,
      image: property.property_image, */
      seasonality: new Date(),
      quality: 3,
      site: 3,
      condition: 3,
      layout: 3
      //lat: property.lat,
      //lng: property.lng
    };
  }

  if (id) {
    fieldsToSet["id"] = id
  }

  //console.log(config.get("analytic_url") + '/outlier_detection');

  request({
    uri: config.get("analytic_url") + '/outlier_detection',
    body: JSON.stringify(fieldsToSet),
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }, function (err, re, body) {

    if (err) {
      console.log(err);
      //res.send(err);
    }
    if (re.statusCode == 200) {
      return res.send({
        data: fieldsToSet,
        response: re.body
      });
    } else {
      return res.status(re.statusCode).send({
        error: "something went wrong",
        data: fieldsToSet,
        response: re.body
      });
    }

  });

};

exports.add_chart_response_investment_check = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
  //
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  // const Id = resultJwt._id;

  const Id = req.user._id;

  try {
    user = await User.findOne({ "_id": Id });

  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  let client;
  let property;

  var propertyValueResSelect = req.body.investment.propertyValueResSelect;
  var propertyValueRes = req.body.investment.propertyValueRes;
  var loanvalue = req.body.investment.loanvalue;
  var LoantoValue = req.body.investment.LoantoValue;

  //const userId = await req.body.userid;
  let filtersproperty = { _id: propertyValueResSelect };
  //console.log(filters);
  let chartproperty;
  try {
    chartproperty = await Chart.findOne(filtersproperty);

  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  var serial = JSON.stringify(chartproperty);

  var averagePro = 0;

  request({
    uri: config.get("analytic_url") + '/price_analysis',
    body: serial,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }, function (err, re, body) {

    if (err) {
      console.log(err);
      //res.send(err);
    }
    if (re) {
      if (re.statusCode == 200) {

        return res.send({ response: re.body });
      }
      else {
        return res.status(re.statusCode).send({ error: "something went wrong", response: re.body });
      }
    }

  });
}

exports.add_chart_response_investment_check_rental = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
  //
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  // const Id = resultJwt._id;

  const Id = req.user._id;

  try {
    user = await User.findOne({ "_id": Id });

  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  let client;
  let property;

  var propertyValueRenSelect = req.body.investment.propertyValueRenSelect;
  var propertyValueRes = req.body.investment.propertyValueRes;
  var loanvalue = req.body.investment.loanvalue;
  var LoantoValue = req.body.investment.LoantoValue;

  //const userId = await req.body.userid;
  let filtersproperty = { _id: propertyValueRenSelect };
  //console.log(filters);
  let chartproperty;
  try {
    chartproperty = await Chart.findOne(filtersproperty);

  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  var serial = JSON.stringify(chartproperty);

  var averagePro = 0;

  request({
    uri: config.get("analytic_url") + '/price_analysis',
    body: serial,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }, function (err, re, body) {

    if (err) {
      console.log(err);
      //res.send(err);
    }
    if (re) {
      if (re.statusCode == 200) {

        return res.send({ response: re.body });
      }
      else {
        return res.status(re.statusCode).send({ error: "something went wrong", response: re.body });
      }
    }

  });
}

exports.add_chart_response_investment = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
  //
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  // const Id = resultJwt._id;

  const Id = req.user._id;

  try {
    user = await User.findOne({ "_id": Id });

  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  let client;
  let property;

  var id = req.body.id;

  if (id) {
    client = req.body.client;
  }
  else {
    if (req.body.client) {
      try {
        client = await Client.findOne({ "_id": req.body.client });

      } catch (err) {
        console.log(err); // TypeError: failed to fetch
      }
    }
  }


  if (req.body.targetProperty) {
    try {
      property = await Property.findOne({ "_id": req.body.targetProperty });

    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  }

  //console.log(req.body.chart_title);
  let value;
  try {
    value = await rclient.get('currencies');

  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  var quotes = {
    USDMXN: 18.79079,
    USDCAD: 1.32239,
    USDUSD: 1
  };
  if (value === null) {
    //console.log("Null reset")
    value = quotes;
    //console.log(value);
  } else {
    //console.log("Got Values");
    value = JSON.parse(value).quotes
    //console.log(value);
  }
  //console.log(JSON.parse(value).quotes);
  if (user) {
    var fieldsToSet = {
      userId: Id,
      chart_title: req.body.chart_title,
      property_id: req.body.targetProperty ? req.body.targetProperty : '',
      currencyValues: value,
      agent: {
        fullName: user.firstname + ' ' + user.lastname,
        company: user.companyname,
        phone: user.phone,
        email: user.email,
        website: user.website,
        photo: user.profile_image,
        photo_50X50: user.profile_image_50X50 ? user.profile_image_50X50 : user.profile_image,
        photo_150X150: user.profile_image_150X150 ? user.profile_image_150X150 : user.profile_image,
        photo_250X250: user.profile_image_250X250 ? user.profile_image_250X250 : user.profile_image,
        logo: user.logo,
        logo_50X50: user.logo_50X50 ? user.logo_50X50 : user.logo,
        logo_150X150: user.logo_150X150 ? user.logo_150X150 : user.logo,
        logo_250X250: user.logo_250X250 ? user.logo_250X250 : user.logo
        //streetAddress: req.body.agent.streetAddress,
        //city: req.body.agent.city,
        //zip: req.body.agent.zip
      },
      relatedProperty: {
        mls: req.body.relatedProperty.mls,
        mls_id: req.body.relatedProperty.mls_id,
      },
      investment: {
        LoantoValue: req.body.investment.LoantoValue,
        advanced: req.body.investment.advanced,
        propertyValueRes_chart_id: req.body.investment.propertyValueResSelect,
        propertyValueRes: req.body.investment.propertyValueRes,
        propertyValueRen_chart_id: req.body.investment.propertyValueRenSelect,
        propertyValueRental: req.body.investment.propertyValueRental,
        loanvalue: req.body.investment.loanvalue,
        propertyInsurance: req.body.investment.propertyInsurance,
        rtaxes: req.body.investment.rtaxes,
        annual_hoa: req.body.investment.hoa,
        landValue: req.body.investment.landValue,
        Improvements: req.body.investment.Improvements,
        BuildingValue: req.body.investment.BuildingValue,
        TotalImprovementValue: req.body.investment.TotalImprovementValue,
        RateofInflation: req.body.investment.RateofInflation,
        HouseValueAppreciation: req.body.investment.HouseValueAppreciation,
        CostofSale: req.body.investment.CostofSale,
        EstimatedVacancy: req.body.investment.EstimatedVacancy,
        NominalFederalIncomeTaxRate: req.body.investment.NominalFederalIncomeTaxRate,
        NominalStateIncomeTaxRate: req.body.investment.NominalStateIncomeTaxRate,
        NominalLocalIncomeTaxRate: req.body.investment.NominalLocalIncomeTaxRate,
        NominalStraightLineRecaptureTaxRate: req.body.investment.NominalStraightLineRecaptureTaxRate,
        NominalFederalCapitalGainTaxRate: req.body.investment.NominalFederalCapitalGainTaxRate,
        NominalStateCapitalGainTaxRate: req.body.investment.NominalStateCapitalGainTaxRate,
        NominalLocalCapitalGainTaxRate: req.body.investment.NominalLocalCapitalGainTaxRate,
        FmInterestRate: req.body.investment.FmInterestRate,
        FmTerm: req.body.investment.FmTerm,
        SmLoantoValueorLoanAmount: req.body.investment.SmLoantoValueorLoanAmount,
        SmInterestRate: req.body.investment.SmInterestRate,
        SmTerm: req.body.investment.SmTerm,
        Repairs: req.body.investment.Repairs,
        RegimeFee: req.body.investment.RegimeFee,
        Electric: req.body.investment.Electric,
        Water: req.body.investment.Water,
        Accounting: req.body.investment.Accounting,
        Liscenses: req.body.investment.Liscenses,
        Advertising: req.body.investment.Advertising,
        Trash: req.body.investment.Trash,
        monitoring: req.body.investment.monitoring,
        maintenance: req.body.investment.maintenance,
        Pest: req.body.investment.Pest,
        Management: req.body.investment.Management,
        Other: req.body.investment.Other,
        EstimatedClosingCosts: req.body.investment.EstimatedClosingCosts,
        DownpaymentorEquity: req.body.investment.DownpaymentorEquity,
        LoantoValueSm: req.body.investment.LoantoValueSm,
        FmEstimatedClosingCosts: req.body.investment.FmEstimatedClosingCosts,
        //Smloanvalue: req.body.investment.Smloanvalue,
        SmEstimatedClosingCosts: req.body.investment.SmEstimatedClosingCosts
      }
    };
    //console.log(fieldsToSet)
  }


  if (id) {
    client = req.body.client;
    fieldsToSet["client"] = {
      first: client.first,
      last: client.last,
      phone: client.phone,
      email: client.email
    };
  }
  else {
    if (client) {

      fieldsToSet["client"] = {
        first: client.firstname,
        last: client.lastname,
        phone: client.phone,
        email: client.email
      };

    }
  }

  var state;

  if (property) {

    //State.find({}
    try {
      state = await State.findOne({ "_id": property.state });

    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
    if (state) {
      fieldsToSet["targetProperty"] = {

        address: property.address,
        city: property.city,
        state: state.name,
        squareFootage: property.square_footage,
        zip: property.zip,
        image: property.property_image,
        seasonality: property.seasonality ? property.seasonality : new Date(),
        quality: property.quality ? property.quality : 3,
        site: property.site ? property.site : 3,
        condition: property.condition ? property.condition : 3,
        layout: property.layout ? property.layout : 3,
        bedroom: property.bedroom,
        bathroom: property.bathroom,
        mls_number: property.mls_number,
        property_type: property.property_type,
        //lat: property.lat,
        //lng: property.lng
      };
    }

  }
  else {
    fieldsToSet["targetProperty"] = {

      /* address: property.address,
      city: property.city,
      state: state.name, */
      //squareFootage: req.body.sqr_ft,
      /* zip: property.zip,
      image: property.property_image, */
      seasonality: new Date(),
      quality: 3,
      site: 3,
      condition: 3,
      layout: 3
      //lat: property.lat,
      //lng: property.lng
    };
  }

  if (id) {
    fieldsToSet["id"] = id
  }

  return res.send({ data: fieldsToSet });

};

exports.save_unknownstatus = async (req, res) => {

  // const unknownStatus_notification = await fs.readFileSync(__dirname + '/../email_templates/notify_unknown_status.html');

  // req.body.updated = new Date();

  // var save;

  // let fieldsToSet = req.body;

  // var unknownstatus = req.body.unknownstatus;

  // unknown_status = new Unknownstatus(fieldsToSet);
  // for (let k = 0; k < unknown_status.propertysample.length; k++) {
  //     delete unknown_status.propertysample[k]["listing"];//delete because of @odata.id key generate error
  // }


  // u_status = await Unknownstatus.findOne({ "unknownstatus": unknownstatus });
  // // console.log(req.body.propertysample);
  // var lastUpdatedDate = u_status.updated;
  // // console.log('lastUpdatedDate =======',lastUpdatedDate);
  // if (u_status) {
  //     var newPropertySample;
  //     u_status.propertysample.push(req.body.propertysample[0]);

  //     newPropertySample = u_status.propertysample

  //     var newFieldsToSet = {};
  //     // newFieldsToSet.propertysample = [];
  //     newFieldsToSet.propertysample = newPropertySample;
  //     newFieldsToSet.updated = new Date();
  //     // console.log(u_status.created);
  //     // console.log(newFieldsToSet.updated);
  //     try {
  //         let query = { "_id": u_status._id };
  //         let options = { upsert: true, new: true, setDefaultsOnInsert: true };
  //         //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
  //         save = await Unknownstatus.findOneAndUpdate(query, newFieldsToSet, options);

  //         var last_updated_date = lastUpdatedDate;
  //         var c_date = new Date();
  //         // console.log('c_date....', c_date);
  //         // console.log('last_updated_date....', last_updated_date);
  //         var date1 = new Date(last_updated_date);
  //         var date2 = new Date(c_date);

  //         var Difference_In_Time = date2.getTime() - date1.getTime();
  //         // console.log('Difference_In_Time....', Difference_In_Time);
  //         var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  //         console.log('Difference_In_Days....', Difference_In_Days);
  //         if (Difference_In_Days >= 1) {
  //             // console.log('in if ....');
  //             sendMail();
  //         } else {
  //             // console.log('in else ....');
  //         }
  //     } catch (err) {
  //         console.log(err);
  //         // return res.status(400).send(err);
  //     }
  //     res.send({ "message": "Unknown status modified successfully." });
  // }
  // else {

  //     try {
  //         save = await unknown_status.save();

  //     } catch (err) {
  //         return res.status(400).send(err);
  //     }

  //     res.send({ "message": "Unknown status successfully added." });
  //     sendMail();

  //     // try {
  //     //      unknown_status.save((err,data) => {
  //     //          if(err){ console.log(err);}
  //     //          console.log('bar');
  //     //      });

  //     // } catch (err) {
  //     //     return res.status(400).send(err);
  //     // }
  //     // res.send({ "message": "Unknown status successfully added."});
  // }

  // async function sendMail() {
  //     const template = handlebars.compile(unknownStatus_notification.toString());
  //     const replacements = {
  //         unknown_status: req.body.unknownstatus,
  //         //site_url: config.get("SITE_URL")
  //     };

  //     const htmlToSend = template(replacements);

  //     const mailOptions = {
  //         from: config.get("FROM_NAME") + '<' + config.get("FROM_EMAIL") + '>',
  //         to: config.get("unknownstatus_email"),
  //         // to: 'nitin@tatrasdata.com',
  //         subject: 'Unknown Status',
  //         html: htmlToSend,
  //     };

  //     try {
  //         await transporter.sendMail(mailOptions);
  //     }
  //     catch (err) {
  //         console.log(err);
  //     }
  // }
}

exports.save_chart_db = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  try {
    user = await User.findOne({
      "_id": Id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  req.body.updated = new Date();

  let fieldsToSet = req.body;

  var id = req.body.id;

  chart = new Chart(fieldsToSet);

  var save;

  //console.log(id);

  //console.log('else');
  if (id) {
    console.log('if');
    try {
      let query = {
        "_id": id,
        "userId": mongoose.Types.ObjectId(Id)
      };

      filters = { _id: id, userId: mongoose.Types.ObjectId(Id) };

      let chart;

      try {
        chart = await Chart.findOne(filters);
      } catch (err) {
        console.log(err); // TypeError: failed to fetch
      }

      if (chart) {
        let options = {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        };
        //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
        try {
          save = await Chart.findOneAndUpdate(query, fieldsToSet, options);
        } catch (err) {
          console.log(err); // TypeError: failed to fetch
        }
        res.send({
          "message": "Chart modified successfully.",
          "_id": id
        });
      }
      else {
        res.status(400).send({
          "message": "Chart not belongs to you.",
          "_id": id
        });
      }

    } catch (err) {
      return res.status(400).send(err);
    }


  } else {
    console.log('else');
    try {
      save = await chart.save();
    } catch (err) {
      return res.status(400).send(err);
    }
    res.send({
      "message": "Chart successfully added.",
      "_id": save._id
    });
  }

};

exports.edit_chart_response = async (req, res) => {

  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  // const Id = resultJwt._id;

  const Id = req.user._id;

  try {
    user = await User.findOne({
      "_id": Id
    });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }

  var save;

  try {
    let query = {
      "_id": req.body._id
    };
    let update = {
      "targetProperty": req.body.targetProperty,
      "closedHomes": req.body.closedHomes,
      "pendingHomes": req.body.pendingHomes,
      "activeHomes": req.body.activeHomes,
      "relatedHomes": req.body.relatedHomes,
      "offMarketHomes": req.body.offMarketHomes,
      updated: new Date()
    };
    let options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    };
    try {
      save = await Chart.findOneAndUpdate(query, update, options);

    } catch (err) {
      console.log(err); // TypeError: failed to fetch
    }
  } catch (err) {
    return res.status(400).send(err);
  }

  if (save) {
    var serial = JSON.stringify(req.body);

    request({
      uri: config.get("analytic_url") + '/price_analysis',
      body: serial,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }, function (err, re, body) {

      if (err) {
        console.log(err);
        //res.send(err);
      }
      //console.log("res: ", re);
      if (re.statusCode == 200) {
        return res.send({
          data: req.body,
          response: re.body
        });
      } else {
        return res.status(re.statusCode).send({
          error: "something went wrong",
          data: req.body,
          response: re.body
        });
      }
      //return res.send({ data: req.body, response: re.body });
    });
  }

};

exports.properties_import = async (req, res) => {

  //console.log(req.body);
  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  const fileStream = fs.createReadStream(req.files.file.path);
  const csv = require('csvtojson')
  csv()
    .fromFile(req.files.file.path)
    .then((jsonObj) => {

      //res.send(jsonObj);
      let validationMsg = [];

      if (!jsonObj[0]['Street #']) {
        //console.log('Street missing');
        validationMsg.push('Street column missing.')
      }
      if (!jsonObj[0]['Street Name']) {
        //console.log('Street Name missing');
        validationMsg.push('Street Name column missing.')
      }
      if (!jsonObj[0]['Baths - Total']) {
        //console.log('Baths - Total missing');
        validationMsg.push('Baths - Total column missing.')
      }
      if (!jsonObj[0]['Total Bedrooms']) {
        //console.log('Total Bedrooms missing');
        validationMsg.push('Total Bedrooms column missing.')
      }
      if (!jsonObj[0]['City']) {
        //console.log('City missing');
        validationMsg.push('City column missing.')
      }
      if (!jsonObj[0]['Days on Market']) {
        //console.log('Days on Market missing');
        validationMsg.push('Days on Market column missing.')
      }
      if (!jsonObj[0]['Geo Lat']) {
        //console.log('Geo Lat missing');
        validationMsg.push('Geo Lat column missing.')
      }
      if (!jsonObj[0]['List Price']) {
        //console.log('List Price missing');
        validationMsg.push('List Price column missing.')
      }
      if (!jsonObj[0]['Geo Lon']) {
        //console.log('Geo Lon missing');
        validationMsg.push('Geo Lon column missing.')
      }
      if (!jsonObj[0]['List Number']) {
        //console.log('List Number missing');
        validationMsg.push('List Number column missing.')
      }
      if (!jsonObj[0]['Photo URL']) {
        //console.log('Photo URL missing');
        validationMsg.push('Photo URL column missing.')
      }
      if (!jsonObj[0]['List Price/SqFt']) {
        //console.log('List Price/SqFt missing');
        validationMsg.push('List Price/SqFt column missing.')
      }
      if (!jsonObj[0]['State/Province']) {
        //console.log('State/Province missing');
        validationMsg.push('State/Province column missing.')
      }
      if (!jsonObj[0]['Status']) {
        //console.log('Status missing');
        validationMsg.push('Status column missing.')
      }
      if (!jsonObj[0]['SqFt - Living']) {
        //console.log('SqFt - Living missing');
        validationMsg.push('SqFt - Living column missing.')
      }
      if (!jsonObj[0]['Year Built']) {
        //console.log('Year Built missing');
        validationMsg.push('Year Built column missing.')
      }
      if (!jsonObj[0]['Zip Code']) {
        //console.log('Zip Code missing');
        validationMsg.push('Zip Code column missing.')
      }

      //console.log(validationMsg);

      if (validationMsg.length == 0) {

        let validateArr = {};

        jsonObj.forEach((element, index) => {

          let street = element["Street #"];
          let streetname = element["Street Name"];
          let bath = element["Baths - Total"];
          let bed = element["Total Bedrooms"];
          let city = element["City"];
          let days = element["Days on Market"];
          let lat = element["Geo Lat"];
          let listPrice = element["List Price"];
          let long = element["Geo Lon"];
          let mlsNumber = element["List Number"];
          let photos = element['Photo URL'];
          let priceSqFt = element["List Price/SqFt"];
          let squareFootage = element["SqFt - Living"];
          let state = element["State/Province"];
          let status = element["Status"];
          let yearBuilt = element["Year Built"];
          let zip = element["Zip Code"];

          if (street.trim() == '') {

            if ('Street #' in validateArr) {
              validateArr['Street #'].push(index + 1);
            }
            else {
              validateArr['Street #'] = [index + 1];
            }

          }

          if (streetname.trim() == '') {

            if ('Street Name' in validateArr) {
              validateArr['Street Name'].push(index + 1);
            }
            else {
              validateArr['Street Name'] = [index + 1];
            }

          }

          if (bath.trim() == '' || isNaN(bath)) {

            if ('Baths - Total' in validateArr) {
              validateArr['Baths - Total'].push(index + 1);
            }
            else {
              validateArr['Baths - Total'] = [index + 1];
            }

          }

          if (bed.trim() == '' || isNaN(bed)) {

            if ('Total Bedrooms' in validateArr) {
              validateArr['Total Bedrooms'].push(index + 1);
            }
            else {
              validateArr['Total Bedrooms'] = [index + 1];
            }

          }

          if (city.trim() == '') {

            if ('City' in validateArr) {
              validateArr['City'].push(index + 1);
            }
            else {
              validateArr['City'] = [index + 1];
            }
          }

          if (days.trim() == '' || isNaN(days)) {

            if ('Days on Market' in validateArr) {
              validateArr['Days on Market'].push(index + 1);
            }
            else {
              validateArr['Days on Market'] = [index + 1];
            }
          }

          if (lat && (lat.trim() == '' || isNaN(lat) || !lat.match(/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/))) {

            if ('Geo Lat' in validateArr) {
              validateArr['Geo Lat'].push(index + 1);
            }
            else {
              validateArr['Geo Lat'] = [index + 1];
            }
          }

          if (listPrice.trim() == '' || isNaN(listPrice)) {

            if ('List Price' in validateArr) {
              validateArr['List Price'].push(index + 1);
            }
            else {
              validateArr['List Price'] = [index + 1];
            }
          }

          if (long.trim() == '' || isNaN(long) || !long.match(/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/)) {

            if ('Geo Lon' in validateArr) {
              validateArr['Geo Lon'].push(index + 1);
            }
            else {
              validateArr['Geo Lon'] = [index + 1];
            }
          }

          if (mlsNumber.trim() == '') {

            if ('List Number' in validateArr) {
              validateArr['List Number'].push(index + 1);
            }
            else {
              validateArr['List Number'] = [index + 1];
            }
          }

          if (photos.trim() == '') {

            if ('Photo URL' in validateArr) {
              validateArr['Photo URL'].push(index + 1);
            }
            else {
              validateArr['Photo URL'] = [index + 1];
            }
          }

          if (priceSqFt.trim() == '' || isNaN(priceSqFt)) {

            if ('List Price/SqFt' in validateArr) {
              validateArr['List Price/SqFt'].push(index + 1);
            }
            else {
              validateArr['List Price/SqFt'] = [index + 1];
            }
          }

          if (squareFootage.trim() == '' || isNaN(squareFootage)) {

            if ('SqFt - Living' in validateArr) {
              validateArr['SqFt - Living'].push(index + 1);
            }
            else {
              validateArr['SqFt - Living'] = [index + 1];
            }
          }

          if (state.trim() == '') {

            if ('State/Province' in validateArr) {
              validateArr['State/Province'].push(index + 1);
            }
            else {
              validateArr['State/Province'] = [index + 1];
            }
          }

          if (status.trim() == '') {

            if ('Status' in validateArr) {
              validateArr['Status'].push(index + 1);
            }
            else {
              validateArr['Status'] = [index + 1];
            }
          }

          if (yearBuilt.trim() == '' || isNaN(yearBuilt)) {

            if ('Year Built' in validateArr) {
              validateArr['Year Built'].push(index + 1);
            }
            else {
              validateArr['Year Built'] = [index + 1];
            }
          }

          if (zip.trim() == '' || isNaN(zip) || zip.length != 5) {

            if ('Zip Code' in validateArr) {
              validateArr['Zip Code'].push(index + 1);
            }
            else {
              validateArr['Zip Code'] = [index + 1];
            }
          }

        });

        if (Object.keys(validateArr).length == 0) {

          var closed = jsonObj.filter(function (el) {
            el.StandardStatus = statusHelpers.statuses(el['Status'])
            return (el.StandardStatus === 'Closed');
          });

          const hasSeven = closed.length < 7 ? false : true;
          const tooBig = closed.length > 100 ? true : false;

          if (jsonObj.length > 249) {
            res.status(400).send({ 'errorType': 1 });

          } else if ((!hasSeven)) {
            res.status(400).send({ 'errorType': 2 });

          } else if ((tooBig)) {
            res.status(400).send({ 'errorType': 3 });

          }
          else {
            let data = {
              user_id: Id,
              mls_id: req.body.mls_id,
              jsondata: JSON.stringify(jsonObj)
            };

            var temppropertydata = new Temppropertydata(data);
            temppropertydata.save(async function (err, new_data) {
              if (err) res.status(400).send(err);

              params = {
                Bucket: config.get("S3_BUCKET") + '/property_import_csvs',
                Key: new_data._id + `.csv`,
                Body: fileStream,
              }

              //let LocationPath;
              try {
                const { Location, Key } = await s3.upload(params).promise();
                //LocationPath = Location;
              } catch (err) {
                console.log(err); // TypeError: failed to fetch
              }

              res.send({ 'success': 'data insert successful.', 'id': new_data._id,'jsondata': jsonObj })
            })
          }

        }
        else {
          res.status(400).send({ 'errorType': 4, 'error': validateArr });
        }

      }
      else {
        res.status(400).send({ 'errorType': 5, 'error': validationMsg });
      }

    });

  // else{
  //   res.status(400).send({'error':'not authorized'});
  // }

};

exports.omp_properties_import = async (req, res) => {

  //console.log(req.body);
  //const token = req.headers.authorization.split(' ')[1];

  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }
  //
  // const Id = resultJwt._id;

  const Id = req.user._id;

  const fileStream = fs.createReadStream(req.files.file.path);
  const csv = require('csvtojson')
  csv()
    .fromFile(req.files.file.path)
    .then((jsonObj) => {

      //res.send(jsonObj);
      let validationMsg = [];

      try {

        if (!jsonObj[0]['Street #']) {
          //console.log('Street missing');
          validationMsg.push('Street column missing.')
        }
        if (!jsonObj[0]['Street Name']) {
          //console.log('Street Name missing');
          validationMsg.push('Street Name column missing.')
        }
        if (!jsonObj[0]['Baths - Total']) {
          //console.log('Baths - Total missing');
          validationMsg.push('Baths - Total column missing.')
        }
        if (!jsonObj[0]['Total Bedrooms']) {
          //console.log('Total Bedrooms missing');
          validationMsg.push('Total Bedrooms column missing.')
        }
        if (!jsonObj[0]['City']) {
          //console.log('City missing');
          validationMsg.push('City column missing.')
        }
        if (!jsonObj[0]['Days on Market']) {
          //console.log('Days on Market missing');
          validationMsg.push('Days on Market column missing.')
        }
        if (!jsonObj[0]['Geo Lat']) {
          //console.log('Geo Lat missing');
          validationMsg.push('Geo Lat column missing.')
        }
        if (!jsonObj[0]['List Price']) {
          //console.log('List Price missing');
          validationMsg.push('List Price column missing.')
        }
        if (!jsonObj[0]['Geo Lon']) {
          //console.log('Geo Lon missing');
          validationMsg.push('Geo Lon column missing.')
        }
        if (!jsonObj[0]['List Number']) {
          //console.log('List Number missing');
          validationMsg.push('List Number column missing.')
        }
        if (!jsonObj[0]['Photo URL']) {
          //console.log('Photo URL missing');
          validationMsg.push('Photo URL column missing.')
        }
        if (!jsonObj[0]['List Price/SqFt']) {
          //console.log('List Price/SqFt missing');
          validationMsg.push('List Price/SqFt column missing.')
        }
        if (!jsonObj[0]['State/Province']) {
          //console.log('State/Province missing');
          validationMsg.push('State/Province column missing.')
        }
        if (!jsonObj[0]['Status']) {
          //console.log('Status missing');
          validationMsg.push('Status column missing.')
        }
        if (!jsonObj[0]['SqFt - Living']) {
          //console.log('SqFt - Living missing');
          validationMsg.push('SqFt - Living column missing.')
        }
        if (!jsonObj[0]['Year Built']) {
          //console.log('Year Built missing');
          validationMsg.push('Year Built column missing.')
        }
        if (!jsonObj[0]['Zip Code']) {
          //console.log('Zip Code missing');
          validationMsg.push('Zip Code column missing.')
        }

        //console.log(validationMsg);

        if (validationMsg.length == 0) {

          let validateArr = {};

          jsonObj.forEach((element, index) => {

            let street = element["Street #"];
            let streetname = element["Street Name"];
            let bath = element["Baths - Total"];
            let bed = element["Total Bedrooms"];
            let city = element["City"];
            let days = element["Days on Market"];
            let lat = element["Geo Lat"];
            let listPrice = element["List Price"];
            let long = element["Geo Lon"];
            let mlsNumber = element["List Number"];
            let photos = element['Photo URL'];
            let priceSqFt = element["List Price/SqFt"];
            let squareFootage = element["SqFt - Living"];
            let state = element["State/Province"];
            let status = element["Status"];
            let yearBuilt = element["Year Built"];
            let zip = element["Zip Code"];

            if (street.trim() == '') {

              if ('Street #' in validateArr) {
                validateArr['Street #'].push(index + 1);
              }
              else {
                validateArr['Street #'] = [index + 1];
              }

            }

            if (streetname.trim() == '') {

              if ('Street Name' in validateArr) {
                validateArr['Street Name'].push(index + 1);
              }
              else {
                validateArr['Street Name'] = [index + 1];
              }

            }

            if (bath.trim() == '' || isNaN(bath)) {

              if ('Baths - Total' in validateArr) {
                validateArr['Baths - Total'].push(index + 1);
              }
              else {
                validateArr['Baths - Total'] = [index + 1];
              }

            }

            if (bed.trim() == '' || isNaN(bed)) {

              if ('Total Bedrooms' in validateArr) {
                validateArr['Total Bedrooms'].push(index + 1);
              }
              else {
                validateArr['Total Bedrooms'] = [index + 1];
              }

            }

            if (city.trim() == '') {

              if ('City' in validateArr) {
                validateArr['City'].push(index + 1);
              }
              else {
                validateArr['City'] = [index + 1];
              }
            }

            if (days.trim() == '' || isNaN(days)) {

              if ('Days on Market' in validateArr) {
                validateArr['Days on Market'].push(index + 1);
              }
              else {
                validateArr['Days on Market'] = [index + 1];
              }
            }

            if (lat && (lat.trim() == '' || isNaN(lat))) {

              if ('Geo Lat' in validateArr) {
                validateArr['Geo Lat'].push(index + 1);
              }
              else {
                validateArr['Geo Lat'] = [index + 1];
              }
            }

            if (listPrice.trim() == '' || isNaN(listPrice)) {

              if ('List Price' in validateArr) {
                validateArr['List Price'].push(index + 1);
              }
              else {
                validateArr['List Price'] = [index + 1];
              }
            }

            if (long.trim() == '' || isNaN(long)) {

              if ('Geo Lon' in validateArr) {
                validateArr['Geo Lon'].push(index + 1);
              }
              else {
                validateArr['Geo Lon'] = [index + 1];
              }
            }

            if (mlsNumber.trim() == '') {

              if ('List Number' in validateArr) {
                validateArr['List Number'].push(index + 1);
              }
              else {
                validateArr['List Number'] = [index + 1];
              }
            }

            if (photos.trim() == '') {

              if ('Photo URL' in validateArr) {
                validateArr['Photo URL'].push(index + 1);
              }
              else {
                validateArr['Photo URL'] = [index + 1];
              }
            }

            if (priceSqFt.trim() == '' || isNaN(priceSqFt)) {

              if ('List Price/SqFt' in validateArr) {
                validateArr['List Price/SqFt'].push(index + 1);
              }
              else {
                validateArr['List Price/SqFt'] = [index + 1];
              }
            }

            if (squareFootage.trim() == '' || isNaN(squareFootage)) {

              if ('SqFt - Living' in validateArr) {
                validateArr['SqFt - Living'].push(index + 1);
              }
              else {
                validateArr['SqFt - Living'] = [index + 1];
              }
            }

            if (state.trim() == '') {

              if ('State/Province' in validateArr) {
                validateArr['State/Province'].push(index + 1);
              }
              else {
                validateArr['State/Province'] = [index + 1];
              }
            }

            if (status.trim() == '') {

              if ('Status' in validateArr) {
                validateArr['Status'].push(index + 1);
              }
              else {
                validateArr['Status'] = [index + 1];
              }
            }

            if (yearBuilt.trim() == '' || isNaN(yearBuilt)) {

              if ('Year Built' in validateArr) {
                validateArr['Year Built'].push(index + 1);
              }
              else {
                validateArr['Year Built'] = [index + 1];
              }
            }

            if (zip.trim() == '' || isNaN(zip)) {

              if ('Zip Code' in validateArr) {
                validateArr['Zip Code'].push(index + 1);
              }
              else {
                validateArr['Zip Code'] = [index + 1];
              }
            }

          });

          if (Object.keys(validateArr).length == 0) {

            res.send({ 'success': 'data insert successful.','jsondata': jsonObj })

          }
          else {
            res.status(400).send({ 'errorType': 4, 'error': validateArr });
          }

        }
        else {
          res.status(400).send({ 'errorType': 5, 'error': validationMsg });
        }

      } catch (error) {
        //console.log(error);
        var array = [];
        array.push('Please upload correct csv.');
        res.status(400).send({ 'errorType': 5, 'error': array });
      }

    });

  // else{
  //   res.status(400).send({'error':'not authorized'});
  // }

};

exports.properties_import_zip = async (req, res) => {
  let mlsIDs = [];
  let new_id;
  //const token = req.headers.authorization.split(' ')[1];
  var temppropertydata;
  // try {
  //   resultJwt = await jwt.verify(token, config.get("jwtSecret"), {
  //     expiresIn: config.get("refreshTokenLife"),
  //     issuer: config.get("issuer")
  //   });
  // } catch (err) {
  //   console.log(err); // TypeError: failed to fetch
  // }

  const mlsId = req.body.mls_id;
  let filters = {
    _id: mlsId
  };
  let mls;
  try {
    mls = await Mls.findOne(filters);
    if (mls != null && mls.name.includes('+')) {
      mls.name = mls.name.replace("+", "");
    }
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
  const csv1 = require('csvtojson')
  const CSV = require('csv-string');

  //const Id = resultJwt._id;
  const Id = req.user._id;
  const StreamZip = require('node-stream-zip');
  const zip = new StreamZip({
    file: req.files.file.path,
    storeEntries: true
  });

  zip.on('ready', async () => {
    const zipEntries = Object.values(zip.entries());
    let csvFileEntry;
    let parsedCsv;
    if (zipEntries != null && (zipEntries.filter(o => o.name.indexOf('.csv') !== -1)) != '') {
      csvFileEntry = zipEntries.filter(o => o.name.indexOf('.csv') !== -1)[0];
      if (csvFileEntry) {
        let zipDotTxtContents = zip.entryDataSync(csvFileEntry.name).toString('utf8');
        parsedCsv = CSV.parse(zipDotTxtContents);
        parsedCsv[0].push('PHOTOURL');
        //console.log(parsedCsv[0].length);
        for (let index = 0; index < parsedCsv.length; index++) {
          const element = parsedCsv[index];
          if (index > 0) {
            mlsIDs.push(element[element.length - 1]);
            var imageEntry = zipEntries.filter(z => z.name.indexOf(element[0]) >= 0)[0];
            let isImageUploaded;
            if (imageEntry) {
              const dataImg = zip.entryDataSync(imageEntry.name);
              const typeImg = imageEntry.name.split(';')[0].split('/')[1];
              try {
                const bucket = config.get("S3_BUCKET") + '/export_import/' + mls.name;
                const imgName = imageEntry.name.split(';')[0].split('/')[1];
                console.log(imgName);
                //var params1 = { Bucket: b, Key: imageEntry.name };
                var crypto = require('crypto');
                //var algo = 'md5';
                let algorithm = "md5";
                let encoding = "hex";
                var shasum = crypto.createHash(algorithm);



                zip.stream(imageEntry, async (err, stm) => {
                  //stm.pipe(process.stdout);
                  stm.on('data', async function (d) { shasum.update(d); })
                  stm.on('end', async function () {
                    var d = shasum.digest(encoding);
                    console.log(imgName);
                    //console.log(d);

                    let imageupload;
                    try {
                      imageupload = await ImageUpload.findOne({
                        "name": imgName.toString(),
                        "checksum": d.toString(),
                        "mls_id": req.body.mls_id
                      });
                    } catch (err) {
                      console.log(err); // TypeError: failed to fetch
                    }
                    //console.log(imageupload);

                    if (imageupload == null) {
                      var dbsave = {
                        name: imgName.toString(),
                        algorithm: algorithm,
                        encoding: encoding,
                        checksum: d.toString(),
                        path: imgName.toString(),
                        mls_id: req.body.mls_id
                      };

                      const schema = {
                        name: Joi.string().required(),
                        algorithm: Joi.string().required(),
                        encoding: Joi.string().required(),
                        checksum: Joi.string().required(),
                        path: Joi.string().required(),
                        mls_id: Joi.string().required()
                      };

                      const result = Joi.validate(dbsave, schema);

                      if (result.error) {
                        return res.status(400).send({ message: result.error.details[0].message });
                      }
                      imageupload = new ImageUpload(_.pick(dbsave, ['name', 'algorithm', 'encoding', 'checksum', 'path', 'mls_id']));

                      try {
                        await imageupload.save();
                        //console.log(result);
                      } catch (err) {
                        return res.status(400).send(err);
                      }


                    };
                  });


                  // var fs = require('fs');

                  //var md5 = crypto.createHash(algorithm).update(imgName.toString()).digest(encoding);

                  // let imageupload;
                  // try {
                  //   imageupload = await ImageUpload.findOne({
                  //     "name": imgName.toString(),
                  //     "checksum": md5.toString()
                  //   });
                  // } catch (err) {
                  //   console.log(err); // TypeError: failed to fetch
                  // }
                  // //console.log(imageupload);

                  // if (imageupload == null) {
                  //   var dbsave = {
                  //     name: imgName.toString(),
                  //     algorithm: algorithm,
                  //     encoding: encoding,
                  //     checksum: md5.toString(),
                  //     path: imgName.toString()
                  //   };

                  //   const schema = {
                  //     name: Joi.string().required(),
                  //     algorithm: Joi.string().required(),
                  //     encoding: Joi.string().required(),
                  //     checksum: Joi.string().required(),
                  //     path: Joi.string().required()
                  //   };

                  //   const result = Joi.validate(dbsave, schema);

                  //   if (result.error) {
                  //     return res.status(400).send({ message: result.error.details[0].message });
                  //   }
                  //   imageupload = new ImageUpload(_.pick(dbsave, ['name', 'algorithm', 'encoding', 'checksum', 'path']));

                  //   try {
                  //     await imageupload.save();
                  //     //console.log(result);
                  //   } catch (err) {
                  //     return res.status(400).send(err);
                  //   }
                });
                let checkResult;
                try {
                  checkResult = await s3.headObject({ Bucket: bucket, Key: imgName }).promise();
                  if (checkResult && imageEntry.size == checkResult.ContentLength) {
                    //console.log('imageEntry.size == data.ContentLength');
                    element[element.length] = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/export_import/" + mls.name + "/" + imageEntry.name.split(';')[0].split('/')[1];
                    isImageUploaded = true;
                  }
                  else if (checkResult && imageEntry.size != checkResult.ContentLength) {
                    isImageUploaded = true;
                    const params = {
                      Bucket: bucket,
                      Key: imgName,
                      Body: dataImg,
                      ACL: 'public-read',
                      //ContentEncoding: 'base64',
                      ContentType: `image/${typeImg}`
                    }
                    try {
                      const { Location, Key } = await s3.upload(params).promise();
                      element[element.length] = Location;
                      //console.log(Location);
                      //return { Location, Key };
                    }
                    catch (err) {
                      console.log(err); // TypeError: failed to fetch
                    }
                    //console.log('NotFound Err')
                    //element[element.length] = await uploadPropertyImage(imgName, bucket, dataImg, typeImg).Location;

                  }
                  else {
                    isImageUploaded = false;
                    element[element.length] = "https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/export_import/" + mls.name + "/" + imageEntry.name.split(';')[0].split('/')[1];
                    //console.log("https://" + config.get("S3_BUCKET") + ".s3.amazonaws.com/property_image/" + imageEntry.name);
                    //console.log('element[element.length]');
                  }
                }
                catch (err) {
                  //console.log(err);
                  if (err && err.code === 'NotFound') {
                    isImageUploaded = true;
                    const params = {
                      Bucket: bucket,
                      Key: imgName,
                      Body: dataImg,
                      ACL: 'public-read',
                      //ContentEncoding: 'base64',
                      ContentType: `image/${typeImg}`
                    }
                    try {
                      const { Location, Key } = await s3.upload(params).promise();
                      element[element.length] = Location;
                      //console.log(Location);
                      //return { Location, Key };
                    }
                    catch (err) {
                      console.log(err); // TypeError: failed to fetch
                    }
                  }
                  else if (err) {
                    isImageUploaded = true;
                    //console.log('NotFound Err')
                    const params = {
                      Bucket: bucket,
                      Key: imgName,
                      Body: dataImg,
                      ACL: 'public-read',
                      //ContentEncoding: 'base64',
                      ContentType: `image/${typeImg}`
                    }
                    try {
                      const { Location, Key } = await s3.upload(params).promise();
                      element[element.length] = Location;
                      //console.log(Location);
                      //return { Location, Key };
                    }
                    catch (err) {
                      console.log(err); // TypeError: failed to fetch
                    }
                  }
                }
                //console.log(checkResult);
                //let err, data;
                // if (checkResult != null && checkResult.ContentLength != null) {
                //   data = checkResult;
                // }
                // else {
                //   err = checkResult;
                // }


                //}


              } catch (err) {
                console.log(err); // TypeError: failed to fetch
              }
            }
          }
        }
      }
      //console.log(parsedCsv);
      let jsonObj = CSV.stringify(parsedCsv);

      //console.log(parsedCsv[0]);

      let validationMsg = [];

      if (!(parsedCsv[0][2] == "ADDRESS")) {
        //console.log('Address missing');
        validationMsg.push('Address column missing.')
      }
      // if (!(parsedCsv[0][5] == "HBATHS")) {
      //   //console.log('HBATHS missing');
      //   validationMsg.push('HBATHS column missing.')
      // }
      // if (!(parsedCsv[0][4] == "FBATHS")) {
      //   //console.log('FBATHS missing');
      //   validationMsg.push('FBATHS column missing.')
      // }
      // if (!(parsedCsv[0][3] == "BEDS")) {
      //   //console.log('Beds missing');
      //   validationMsg.push('Beds column missing.')
      // }
      if (!(parsedCsv[0][11] == "CITY")) {
        //console.log('City missing');
        validationMsg.push('City column missing.')
      }
      if (!(parsedCsv[0][70] == "ADOM")) {
        //console.log('Days on Market missing');
        validationMsg.push('ADOM column missing.')
      }
      // if (!(parsedCsv[0][73] == "LAT")) {
      //   //console.log('Geo Lat missing');
      //   validationMsg.push('Latitude(LAT) column missing.')
      // }
      if (!(parsedCsv[0][6] == "LIST PRICE")) {
        //console.log('List Price missing');
        validationMsg.push('List Price column missing.')
      }
      if (!(parsedCsv[0][73] == "DX_ORIG_MLNO ")) {
        //console.log('Geo Lon missing');
        validationMsg.push('DX_ORIG_MLNO column missing.')
      }
      if (!(parsedCsv[0][0] == "MLS NUMBER")) {
        //console.log('List Number missing');
        validationMsg.push('MLS Number column missing.')
      }
      // if (!jsonObj[0]['Photo URL']) {
      //   //console.log('Photo URL missing');
      //   validationMsg.push('Photo URL column missing.')
      // }
      // if (!jsonObj[0]['List Price/SqFt']) {
      //   //console.log('List Price/SqFt missing');
      //   validationMsg.push('List Price/SqFt column missing.')
      // }
      // if (!jsonObj[0]['State/Province']) {
      //   //console.log('State/Province missing');
      //   validationMsg.push('State/Province column missing.')
      // }
      if (!(parsedCsv[0][1] == "STATUS")) {
        //console.log('Status missing');
        validationMsg.push('Status column missing.')
      }
      if (!(parsedCsv[0][15] == "LIV SQFT")) {
        //console.log('SqFt - Living missing');
        validationMsg.push('Living - SqFt column missing.')
      }
      if (!(parsedCsv[0][16] == "YEAR BUILT")) {
        //console.log('Year Built missing');
        validationMsg.push('Year Built column missing.')
      }
      if (!(parsedCsv[0][72] == "ZIP CODE")) {
        //console.log('Zip Code missing');
        validationMsg.push('Zip Code column missing.')
      }

      //console.log(validationMsg.length);

      const jsonObj1 = await csv1().fromString(jsonObj);
      if (validationMsg.length == 0) {

        let validateArr = {};

        jsonObj1.forEach((element, index) => {

          let address = element["ADDRESS"];
          // let fbaths = element["FBATHS"];
          // let hbaths = element["HBATHS"];
          // let beds = element["BEDS"];
          let city = element["CITY"];
          let adom = element["ADOM"];
          //let lat = element["LAT"];
          let listPrice = element["LIST PRICE"];
          let orgMls = element["DX_ORIG_MLNO"];
          let mlsNumber = element["MLS NUMBER"];
          //let photos = element['Photo URL'];
          //let priceSqFt = element["List Price/SqFt"];
          let squareFootage = element["LIV SQFT"];
          //let state = element["State/Province"];
          let status = element["STATUS"];
          let yearBuilt = element["YEAR BUILT"];
          let zip = element["ZIP CODE"];

          let currentYear = new Date().getFullYear().toString();
          //console.log(currentYear);
          //console.log(currentYear <= yearBuilt);
          var validation = {
            isEmailAddress: function (str) {
              var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
              return pattern.test(str);  // returns a boolean
            },
            isNotEmpty: function (str) {
              var pattern = /\S+/;
              return pattern.test(str);  // returns a boolean
            },
            isNumber: function (str) {
              var pattern = /^\d+$/;
              return pattern.test(str);  // returns a boolean
            },
            isSame: function (str1, str2) {
              return str1 === str2;
            },
            isZipCode: function (str) {
              var pattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
              return pattern.test(str);
            },
            isNumberFive: function (str) {
              var pattern = /^\d{5}$/;
              return pattern.test(str);
            }
          };

          if (!validation.isNotEmpty(address)) {

            if ('ADDRESS' in validateArr) {
              validateArr['ADDRESS'].push(index + 1);
            }
            else {
              validateArr['ADDRESS'] = [index + 1];
            }

          }

          // if (fbaths.trim() == '') {

          //   if ('FBATHS' in validateArr) {
          //     validateArr['FBATHS'].push(index + 1);
          //   }
          //   else {
          //     validateArr['FBATHS'] = [index + 1];
          //   }

          // }

          // if (hbaths.trim() == '' || isNaN(hbaths)) {

          //   if ('HBATHS' in validateArr) {
          //     validateArr['HBATHS'].push(index + 1);
          //   }
          //   else {
          //     validateArr['HBATHS'] = [index + 1];
          //   }

          // }

          // if (beds.trim() == '' || isNaN(beds)) {

          //   if ('BEDS' in validateArr) {
          //     validateArr['BEDS'].push(index + 1);
          //   }
          //   else {
          //     validateArr['BEDS'] = [index + 1];
          //   }

          // }

          if (!validation.isNotEmpty(city)) {

            if ('CITY' in validateArr) {
              validateArr['CITY'].push(index + 1);
            }
            else {
              validateArr['CITY'] = [index + 1];
            }
          }

          if (!validation.isNotEmpty(adom) || !validation.isNumber(adom) || isNaN(adom)) {

            if ('ADOM' in validateArr) {
              validateArr['ADOM'].push(index + 1);
            }
            else {
              validateArr['ADOM'] = [index + 1];
            }
          }

          // if (lat && (lat.trim() == '' || isNaN(lat))) {

          //   if ('LAT' in validateArr) {
          //     validateArr['LAT'].push(index + 1);
          //   }
          //   else {
          //     validateArr['LAT'] = [index + 1];
          //   }
          // }

          if (isNaN(listPrice) || !validation.isNotEmpty(listPrice) || !validation.isNumber(listPrice)) {

            if ('LIST PRICE' in validateArr) {
              validateArr['LIST PRICE'].push(index + 1);
            }
            else {
              validateArr['LIST PRICE'] = [index + 1];
            }
          }

          if (!validation.isNotEmpty(orgMls)) {

            if ('DX_ORIG_MLNO' in validateArr) {
              validateArr['DX_ORIG_MLNO'].push(index + 1);
            }
            else {
              validateArr['DX_ORIG_MLNO'] = [index + 1];
            }
          }

          if (!validation.isNotEmpty(mlsNumber)) {
            if ('MLS NUMBER' in validateArr) {
              validateArr['MLS NUMBER'].push(index + 1);
            }
            else {
              validateArr['MLS NUMBER'] = [index + 1];
            }
          }

          // if (photos.trim() == '') {

          //   if ('Photo URL' in validateArr) {
          //     validateArr['Photo URL'].push(index + 1);
          //   }
          //   else {
          //     validateArr['Photo URL'] = [index + 1];
          //   }
          // }

          // if (priceSqFt.trim() == '' || isNaN(priceSqFt)) {

          //   if ('List Price/SqFt' in validateArr) {
          //     validateArr['List Price/SqFt'].push(index + 1);
          //   }
          //   else {
          //     validateArr['List Price/SqFt'] = [index + 1];
          //   }
          // }

          if (!validation.isNotEmpty(squareFootage) || !validation.isNumber(squareFootage) || isNaN(squareFootage)) {

            if ('LIV SQFT' in validateArr) {
              validateArr['LIV SQFT'].push(index + 1);
            }
            else {
              validateArr['LIV SQFT'] = [index + 1];
            }
          }

          // if (state.trim() == '') {

          //   if ('State/Province' in validateArr) {
          //     validateArr['State/Province'].push(index + 1);
          //   }
          //   else {
          //     validateArr['State/Province'] = [index + 1];
          //   }
          // }

          if (!validation.isNotEmpty(status)) {

            if ('STATUS' in validateArr) {
              validateArr['STATUS'].push(index + 1);
            }
            else {
              validateArr['STATUS'] = [index + 1];
            }
          }

          if (!validation.isNotEmpty(yearBuilt) || !validation.isNumber(yearBuilt) || isNaN(yearBuilt) || currentYear <= yearBuilt) {

            if ('YEAR BUILT' in validateArr) {
              validateArr['YEAR BUILT'].push(index + 1);
            }
            else {
              validateArr['YEAR BUILT'] = [index + 1];
            }
          }

          if (!validation.isNotEmpty(zip) || !validation.isZipCode(zip) || isNaN(zip)) {

            if ('ZIP CODE' in validateArr) {
              validateArr['ZIP CODE'].push(index + 1);
            }
            else {
              validateArr['ZIP CODE'] = [index + 1];
            }
          }

        });
        //console.log(validateArr);
        if (Object.keys(validateArr).length == 0) {

          var closed = jsonObj1.filter(function (el) {
            el.STATUS = statusHelpers.statuses(el['STATUS'])
            return (el.STATUS === 'Closed');
          });
          //console.log(closed.length);
          const hasSeven = closed.length < 7 ? false : true;
          const tooBig = closed.length > 100 ? true : false;

          if (jsonObj1.length > 249) {
            res.status(400).send({ 'errorType': 1 });

          } else if ((!hasSeven)) {
            res.status(400).send({ 'errorType': 2 });

          } else if ((tooBig)) {
            res.status(400).send({ 'errorType': 3 });

          }
          else {

            let data = {
              user_id: Id,
              mls_id: req.body.mls_id,
              jsondata: JSON.stringify(jsonObj1)
            };
            //console.log(jsonArray);
            temppropertydata = new Temppropertydata(data);
            temppropertydata.save(async function (err, new_data) {
              new_id = new_data._id;
              //console.log(new_data);
              if (err) res.status(400).send(err);
              zip.close();
              res.send({ 'success': 'data insert successful.', 'id': new_id, 'mlsIds': mlsIDs });
            });

          }
        }
        else {
          res.status(400).send({ 'errorType': 4, 'error': validateArr });
        }
      }
      else {
        res.status(400).send({ 'errorType': 5, 'error': validationMsg });
      }
    }
    else {
      //zip.close();
      res.status(400).send({ 'errorType': 6, 'error': 'File not contain any zip file or file is invalid.' });
    }
  });
  // async function uploadPropertyImage(imgName, bucket, dataImg, typeImg) {
  //   //if (isImageUploaded) {
  //   const params = {
  //     Bucket: bucket,
  //     Key: imgName,
  //     Body: dataImg,
  //     ACL: 'public-read',
  //     ContentEncoding: 'base64',
  //     ContentType: `image/${typeImg}`
  //   }
  //   try {
  //     const { Location, Key } = await s3.upload(params).promise();
  //     //element[element.length] = Location;
  //     //console.log(Location);
  //     return { Location, Key };
  //   }
  //   catch (err) {
  //     console.log(err); // TypeError: failed to fetch
  //   }
  //   //  }
  // }
};

exports.getTempData = async (req, res) => {

  //console.log(req.params.id);

  const id = req.params.id;

  try {
    await Temppropertydata.findOne({
      "_id": id,
    }, function (err, data) {
      if (!err) res.send(data);
    });
  } catch (error) {
    res.status(400).send(error);
  }

};

function httpsRequest(params, postData) {
  return new Promise(function(resolve, reject) {
    var req = https.request(params, function(res) {
        // reject on bad status
        if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error('statusCode=' + res.statusCode));
        }
        // cumulate data
        var body = [];
        res.on('data', function(chunk) {
            body.push(chunk);
        });
        // resolve on end
        res.on('end', function() {
            try {
                body = JSON.parse(Buffer.concat(body).toString());
            } catch(e) {
                reject(e);
            }
            resolve(body);
        });
    });
    // reject on request error
    req.on('error', function(err) {
        // This is not a "Second reject", just a different sort of failure
        reject(err);
    });
    if (postData) {
        req.write(postData);
    }
    // IMPORTANT
    req.end();
  });
}

exports.find_mls_image = async (req, res) => {
// console.log(req.body);

// var base = "";
// var token;
//
// var api;
// var tokenArr;
// var filters;

let mlss;

try {
  mlss = await Mls.findOne({
    "_id": req.body.mls_id
  });
} catch (err) {
  console.log(err); // TypeError: failed to fetch
}
//console.log(mlss);
let api;

if (mlss) {
  api = mlss.chart_api;
}

var base = "$top=1";

//ApiToken
var token;
//const Id = req.params.id;
let filters = {
  slug: api
};

let tokenArr;

try {
  tokenArr = await ApiToken.findOne(filters);
} catch (err) {
  console.log(err); // TypeError: failed to fetch
}
var listing_type = (req.body.listing_type == 'null' || req.body.listing_type == null || req.body.listing_type == undefined) ? null : "'" + req.body.listing_type + "'";
var now = new Date();

let listingkey = req.body.listingid;
//if (api == 'retsrabbit') {

  console.log("data fatch START");
if (api == "retsrabbit") {
    var apiCreds = {
      'grant_type': config.get("retsrabbit_grant_type"),
      'client_id': config.get("retsrabbit_client_id"),
      'client_secret': config.get("retsrabbit_client_secret"),
    }

    var serial = JSON.stringify(apiCreds);

    var ares;

    var optionsdd = {
      method: 'POST',
      uri: 'http://werx.retsrabbit.com/api/oauth/access_token',
      body: serial,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let rpbody;
    try {
      rpbody = await rp(optionsdd);
    } catch (error) {
      console.log(error);
    }

    ares = JSON.parse(rpbody);

    expiryDate = new Date(now.getTime() + (ares.expires_in) * 1000);
    //base = await RetsHelpers.retsrabbits(req.body, mlss);

    apiToken = new ApiToken({
      name: 'retsrabbit',
      slug: 'retsrabbit',
      token: ares.access_token,
      expiry: expiryDate
    });

    //console.log(apiToken);

    try {
      //let query = { "_id": id };
      let options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      };

    } catch (err) {
      return res.status(400).send(err);
    }

    //console.log(JSON.parse(ares.getBody()));
    token = ares.access_token;


var selectArr = [
  'photos'
];

// Selected Specific Valued Constructed
base += "&$select="

for (var i = 0; i < selectArr.length; i++) {
  if (i === (selectArr.length - 1)) {
    //console.log(" Not Ok")
    base += selectArr[i];
  } else {
    //console.log("Ok")
    base += selectArr[i] + ",";
  }
};

if (req.body.mlsid) {
  console.log("FOUND MLS")
  // let paragonMls = req.body.mlsid;
  // if (paragonMls === 'IMLS') {
  //   //console.log('IMLS')
  //   base += "&$filter=server_id eq 2 and ";
  // } else {
  //   //console.log('NO IMLS')
  //   base += "&$filter=server_id eq 51 and ";
  // }
  if (mlss.server_id == '15') {
    if (listing_type === "'Rental'") {
      console.log("Type Check CTAR: " + listing_type);
      base += "&$filter=server_id eq " + mlss.server_id + " and (PropertyType eq 'Residential') and ";
    } else {
      console.log("Move On")
      base += "&$filter=server_id eq " + mlss.server_id + " and (PropertyType eq null) and ";
    }
  }
  //ABOR
  else if (mlss.server_id == '46' || mlss.server_id == '76' || mlss.server_id == '63' || mlss.server_id == '65' || mlss.server_id == '60') {
    if (listing_type === "'Rental'" && (mlss.server_id == '63' || mlss.server_id == '76')) {
      base += "&$filter=server_id eq " + mlss.server_id + " and (PropertyType eq 'Residential Lease') and ";
    } else {
      base += "&$filter=server_id eq " + mlss.server_id + " and (PropertyType eq 'Residential') and ";
    }
  }
  //FMLS & GAMLS
  else if (mlss.server_id == '35' || mlss.server_id == '55') {
    //GAMLS
    if (listing_type === "'Rental'" && mlss.server_id == '35') {
      base += "&$filter=server_id eq " + mlss.server_id + " and (PropertyType eq 'Rental Residential') and ";
      //FMLS
    } else if (listing_type === "'Rental'" && mlss.server_id == '55') {
      base += "&$filter=server_id eq " + mlss.server_id + " and (PropertyType eq 'Residential Lease') and ";
    } else {
      base += "&$filter=server_id eq " + mlss.server_id + " and ";
    }
  }
  //BEACHES
  else if (mlss.server_id == 'RGM') {
    if (listing_type === "'Rental'") {
      base += "&$filter=(server_id eq 51 or server_id eq 72) and ((PropertyType eq 'F') or (PropertyType eq 'Residential Rental') or (PropertyType eq 'Residential Lease')) and ";
    } else {
      base += "&$filter=(server_id eq 51 or server_id eq 72) and ((PropertyType ne 'B') and (PropertyType ne 'C') and (PropertyType ne 'D') and (PropertyType ne 'E') and (PropertyType ne 'F') and (PropertyType ne 'Business Opportunity') and (PropertyType ne 'Commercial/Business/Agricultural/Industrial Land') and (PropertyType ne 'Commercial/Industrial') and (PropertyType ne 'Residential Income') and (PropertyType ne 'Residential Land/Boat Docks') and (PropertyType ne 'Residential Rental') and (PropertyType ne 'Residential Lease') and (PropertyType ne 'Land') and (PropertyType ne 'Farm') and (PropertyType ne 'Commercial Sale') and (PropertyType ne 'Residential Income')) and ";
    }
  }
  //BEACHES
  else if (mlss.server_id == '58') {
    if (listing_type === "'Rental'") {
      base += "&$filter=server_id eq 58 and (PropertyType ne 'Residential') and ";
    } else {
      base += "&$filter=server_id eq 58 and (PropertyType eq 'Residential') and ";
    }
  } else {
    base += "&$filter=server_id eq " + mlss.server_id + " and ";
  }
  //base += "$filter=server_id eq " + mlss.server_id + " and ";
} else {
  console.log("No Return")
  return (base);
}



base += "ListingId eq '" + listingkey + "'";

}
if (api == 'retsrabbit' && base && token) {
  //console.log(base);
  //console.log(token);
  var options = {
    host: 'werx.retsrabbit.com',
    path: encodeURI("/api/v2/property/?" + (base)),
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token,
      'X-SparkApi-User-Agent': 'APC',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
  };
}

if (api == 'Bridge') {

  token = config.get("bridge_access_token");

  var base = "$top=10&$filter=PropertyType eq 'Residential' and ListingId eq '" + listingkey + "'";
}

if (api == "CoreLogic") {

  if (tokenArr) {

    expiry = tokenArr.expiry;

    if (now > expiry) {

      var apiCreds = {
        'grant_type': config.get("coreLogic_grant_type"),
        'client_id': config.get("coreLogic_client_id"),
        'client_secret': config.get("coreLogic_client_secret"),
        'scope': 'api'
      }

      var serial = querystring.stringify(apiCreds);

      var ares;
      console.log('generate_token corelogic 2');
      var optionsdd = {
        method: 'POST',
        uri: 'https://api-prod.corelogic.com/trestle/oidc/connect/token',
        body: serial,
        headers: {
          'content-type': 'application/x-www-form-urlencoded' // Is set automatically
        }
      };

      let rpbody

      try {
        rpbody = await rp(optionsdd);
        //return Promise.resolve(rpbody);
      } catch (error) {
        console.log(error);
      }

      ares = JSON.parse(rpbody);

      expiryDate = new Date(now.getTime() + (ares.expires_in) * 1000);
      //base = await RetsHelpers.retsrabbits(req.body, mlss);

      apiToken = {
        //name:'retsrabbit',
        //slug:'retsrabbit',
        token: ares.access_token,
        expiry: expiryDate
      };

      //console.log(apiToken);

      try {
        let query = {
          "_id": tokenArr._id
        };
        let options = {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        };

      } catch (err) {
        return res.status(400).send(err);
      }

      token = ares.access_token;


    } else {
      token = tokenArr.token;
    }
  } else {

    var apiCreds = {
      'grant_type': config.get("coreLogic_grant_type"),
      'client_id': config.get("coreLogic_client_id"),
      'client_secret': config.get("coreLogic_client_secret"),
      'scope': 'api'
    }

    var serial = querystring.stringify(apiCreds);

    var ares;

    /* var tokenres = syncrequest('POST',
      'http://werx.retsrabbit.com/api/oauth/access_token', {
      json: apiCreds,
    }); */
    console.log('generate_token corelogic 3');
    var optionsdd = {
      method: 'POST',
      uri: 'https://api-prod.corelogic.com/trestle/oidc/connect/token',
      body: serial,
      headers: {
        'content-type': 'application/x-www-form-urlencoded' // Is set automatically
      }
    };
    let rpbody;

    console.log(optionsdd);

    try {
      rpbody = await rp(optionsdd);
    } catch (error) {
      console.log(error);
    }

    //console.log(rpbody);

    ares = JSON.parse(rpbody);

    expiryDate = new Date(now.getTime() + (ares.expires_in) * 1000);
    //base = await RetsHelpers.retsrabbits(req.body, mlss);

    apiToken = new ApiToken({
      name: 'CoreLogic',
      slug: 'CoreLogic',
      token: ares.access_token,
      expiry: expiryDate
    });

    //console.log(apiToken);

    try {
      //let query = { "_id": id };
      let options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      };
      //res.send({ "message": "Chart modified successfully.", "query": query, "options": options, "chart": chart });
      try {
        save = await ApiToken.findOneAndUpdate(filters, apiToken, options);
      } catch (err) {
        console.log(err); // TypeError: failed to fetch
      }
    } catch (err) {
      return res.status(400).send(err);
    }

    //expires_in
    //console.log(JSON.parse(ares.getBody()));

    token = ares.access_token;

    //});

  }
  //let listingkey = req.body.listingid;
  base = "$filter=(ListingKey eq '" + listingkey + "')&$expand=Media($select=MediaURL;$top=10;$orderby=Order)";

}


// console.log(base);
console.log("find_data_mls_wise")
/* console.log(api);
console.log(base);
console.log(token); */



if (api == 'Bridge' && base && token) {
  var options = {
    host: 'api.bridgedataoutput.com',
    path: encodeURI("/api/v2/OData/miamire/Property?" + base),
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    method: 'GET',
  };
}

if (api == "CoreLogic" && base && token) {
  var options = {
    host: 'api-prod.corelogic.com',
    path: encodeURI("/trestle/odata/Property?" + base),
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    method: 'GET',
  };
}



// console.log(options);

reqq = https.request(options, function (response) {
  //ress.setEncoding('utf8');
  var result = ''
  response.on('data', function (chunk) {
    result += chunk;
  });

  response.on('end', async () => {
 //console.log(result);
    var res_standardStatus = JSON.parse(result);
    var newArr = {};
    newArr.value = [];

    for (var k = 0; k < res_standardStatus.value.length; k++) {
      newArr.value.push(res_standardStatus.value[k]);
    }

    res.send(JSON.stringify(newArr));
  });
})

reqq.on('error', (error) => {
  res.send(error);
})

reqq.end();
}
