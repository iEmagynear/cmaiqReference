// importing the dependencies

var express = require("express");
var http = require('http');
var fs = require('fs');
var mongoose = require("mongoose");
var cors = require('cors');
var morgan = require("morgan");
var helmet = require('helmet');
var passport = require('passport');
var saml = require('passport-saml');
var bodyParser = require('body-parser');
var authRouter = require("./routers/auth");
var usersRouter = require("./routers/users");
var adminRouter = require("./routers/admin");
var chartRouter = require("./routers/chart");
var mlsRouter = require("./routers/mls");
var stripeRouter = require("./routers/stripe");
const config = require("config");
const jwt = require("jsonwebtoken");
var rclient = require('./redis');
var cronRouter = require('./routers/cron')
var passportHelper = require('./helpers/passport');
var ssoHelper = require('./helpers/sso')
const {
  base64encode,
  base64decode
} = require('nodejs-base64');
const XMLExtract = require('xml-extract');
var format = require('xml-formatter');
var parser = require('fast-xml-parser');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passportHelper.passportInit();
passportHelper.passportInitBeach();
var samlObject = passportHelper.getSamlStrategy();
var samlObjectBeach = passportHelper.getBeachSamlStrategy();
var xmlElementArr = [];
var finalSamlObj = null;

passport.use('saml', samlObject);
passport.use('samlBeach', samlObjectBeach);

// Defining the Express app
var app = express();

app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));

mongoose.Promise = global.Promise;

let connectionUrl;
if (!config.has('DB_REPLICA_SET_HOST')) {
  connectionUrl = "mongodb://" + config.get("DB_HOST") + ":" + config.get("DB_PORT") + "/" + config.get("DB_NAME") + "";
} else {
  connectionUrl = config.get("DB_REPLICA_SET_HOST");
}

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB!');

})
.catch((err) => {
  console.log("Unable to connect to the database: ", err);
  process.exit(1);
  //throw new Error(err);
});


// mongoose.set('debug', true);


const TokenCheckMiddleware = async (req, res, next) => {

  //console.log(req.headers);
  if (req.headers.authorization) {

    const authorizationHeaader = req.headers.authorization;

    if (authorizationHeaader) {

      const token = req.headers.authorization.split(' ')[1];

      try {
        decoded = await jwt.verify(token, config.get("jwtSecret"), {
          expiresIn: config.get("refreshTokenLife"),
          issuer: config.get("issuer")
        })
        const value = await rclient.get(decoded._id);

        if (decoded.uuid != value) {
          //console.log("unmached");
          res.status(401).send({
            "msg": "Invalid token."
          });
        } else {
          //console.log("mached");
          req.user = decoded;
          next();
        }


      } catch (e) {
        res.status(401).send({
          "msg": "Invalid token."
        });
      }
    }
  } else {
    res.status(401).send({
      "msg": "Invalid token."
    });
  }

}

app.use(cors()); // enabling CORS for all requests
app.use(helmet()); // adding Helmet to enhance your API's security
app.use(morgan('tiny')); // adding morgan to log HTTP requests

app.get("/", (req, res) => {
  res.send("Connected...");
});

app.get("/api", (req, res) => {
  res.send("Connected to API...");
});

// SAML Configration START

app.get("/api/shibboleth", (req, res) => {
  var package = passportHelper.getSamlMetadata();
  res.type('application/xml');
  res.send(package);
});

app.get("/api/shibbolethBeaches", (req, res) => {
  var packageBeach = passportHelper.getBeachSamlMetadata();
  res.type('application/xml');
  res.send(packageBeach);
});

app.get('/api/passport/ssoAuth',
  passport.authenticate('saml', {
    failureRedirect: '/api/passport/failedAuth',
    successRedirect: '/api/passport/successAuth'
  }),
);

app.get('/api/passport/ssoAuthBeach',
  passport.authenticate('samlBeach', {
    failureRedirect: '/api/passport/failedAuth',
    successRedirect: '/api/passport/successAuth'
  }),
);

app.post('/api/passport/ssoAuth/callback', async (req, res) => {
  var samlResponse = null;
  var samlDecoded = null;
  var formattedXml = null;
  var options = {
    attributeNamePrefix: "samlData_",
    textNodeName: "samlValue",
    ignoreAttributes: false,
    ignoreNameSpace: true,
    allowBooleanAttributes: false,
    parseNodeValue: false,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata",
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
    stopNodes: ["parse-me-as-string"]
  };
  //var n = 0
  //var xmlElementArrSend = [];

  samlResponse = res.req.body.SAMLResponse;

  try {
    samlDecoded = await base64decode(samlResponse);
    formattedXml = await format(samlDecoded);
  } catch(err) {
      console.log(err); // TypeError: failed to fetch
  }
  
  //console.log(formattedXml);
  
  //formattedXml = "`" + formattedXml + "`";

  // Testing Purposes ONLY //
  /*res.send({
    samlResponse: samlResponse,
    samlDecoded: samlDecoded,
    formattedXml: formattedXml
  });*/
  // Comment Out Line 192 First
  /*res.type('application/xml');
  res.send(formattedXml);*/

  // New Solution
  if (parser.validate(formattedXml) === true) {
    let jsonObj;

    try {
      jsonObj = await parser.parse(formattedXml, options);
    } catch(err) {
      console.log(err); // TypeError: failed to fetch
    }
    //console.log(jsonObj.Response.Assertion.AttributeStatement.Attribute.length);
    
    var samlObj = {
      loginid: "A",
      Email: "B",
      mlsName: "C",
      FirstName: "D",
      LastName: "E"
    }
    var samlLength = jsonObj.Response.Assertion.AttributeStatement.Attribute.length
    for (var x = 0; x < samlLength; x++) {
      var dataItem = jsonObj.Response.Assertion.AttributeStatement.Attribute[x].samlData_Name;
      //console.log(dataItem);
      //console.log(jsonObj.Response.Assertion.AttributeStatement.Attribute[x].AttributeValue.samlValue);
      
      switch (dataItem) {
        case "loginid":
          samlObj.loginid = jsonObj.Response.Assertion.AttributeStatement.Attribute[x].AttributeValue.samlValue;
          break;
        case "Email":
        case "email":
          samlObj.Email = jsonObj.Response.Assertion.AttributeStatement.Attribute[x].AttributeValue.samlValue;
          break;
        case "MLS":
          samlObj.mlsName = jsonObj.Response.Assertion.AttributeStatement.Attribute[x].AttributeValue.samlValue;
          break;
        case "FirstName":
          samlObj.FirstName = jsonObj.Response.Assertion.AttributeStatement.Attribute[x].AttributeValue.samlValue;
          break;
        case "LastName":
          samlObj.LastName = jsonObj.Response.Assertion.AttributeStatement.Attribute[x].AttributeValue.samlValue;
          break;
        default:
          console.log("Extra Data")
      }
    }
    
    finalSamlObj = samlObj;
    
    console.log(samlObj.mlsName);
    
    if (finalSamlObj != null) {
      //res.redirect('/api/passport/successAuth');
      let ssodata;
      try {
        ssodata = await ssoHelper.checkUserDetails(finalSamlObj);
      } catch(err) {
        console.log(err); // TypeError: failed to fetch
      }
      console.log(ssodata);
      
      res.redirect(config.get("SITE_URL")+'shibboleth/'+ssodata+'/'+samlObj.mlsName);
      //res.send(samlObj);
    } else {
      res.redirect('/api/passport/failedAuth');
    }
  } else {
    res.redirect('/api/passport/failedAuth');
  }

  // Old Solution
  /*XMLExtract(formattedXml, 'saml2:AttributeValue', false, (error, element) => {
    if (error) {
      throw new Error(error);
    }

    xmlElementArrSend.push(element)
    xmlElementArrSend[n] = xmlElementArrSend[n].trim();
    n++;

    if (xmlElementArrSend.length < 5) {
      //console.log("Continue... ")
    } else if (xmlElementArrSend.length === 5) {
      //console.log(xmlElementArr);
      xmlElementArr = xmlElementArrSend;
      res.redirect('/api/passport/successAuth');
    } else {
      res.redirect('/api/passport/failedAuth');
    }

  });*/

});

app.get("/api/passport/failedAuth", (req, res) => {
  res.send('Failure to authenticate. An error occured, please try again.');
});

/* app.get("/api/passport/successAuth", (req, res) => {
  res.redirect('/shibboleth');
}); */

app.post('/api/passport/userCapture', async function(req, res) {
  //console.log(req);
  //console.log(req.body);

  let loginData;
  try {
    loginData = await ssoHelper.UserLogin(req.body);
  } catch(err) {
    console.log(err); // TypeError: failed to fetch
  }
  //console.log(loginData.status);
  
  if(loginData.status == 400){
    //console.log('in');
    
    res.status(400).send(loginData);
  }
  else{
    //console.log('in444');
    res.send(loginData);
  }
  //res.send(loginData);

});

app.get("/api/passport/xmlClear", (req, res) => {
  finalSamlObj = null;
  res.send({
    data: finalSamlObj
  });
});


// SAML Configration END

app.get("/cron/", (req, res) => {
  res.send("Connected Cron...");
});

app.use('/cron/', cronRouter);

app.use('/api/auth', authRouter);

app.use('/api/users', usersRouter);

app.use('/api/chart', chartRouter);

app.use('/api/admin', adminRouter);

app.use('/api/mls', mlsRouter);

app.use('/api/stripe', TokenCheckMiddleware, stripeRouter);

app.use(passport.initialize());
app.use(passport.session());

//General Error Handler
app.use(function(err, req, res, next) {
  console.log("Fatal error: " + JSON.stringify(err));
  next(err);
});

// Starting the Server
app.listen(config.get("APP_PORT"), () => {
  console.log("Server listening on Port " + config.get("APP_PORT"));
});
