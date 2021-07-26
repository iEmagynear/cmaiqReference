const config = require("config");
const saml = require('passport-saml');
const passport = require('passport');
const fs = require('fs');

// Global Vars
var privateCert;
var publicCert;
var cert;
var certBeaches;

var parsedProfile;
var samlStrategy;
var samlStrategyBeach;
var package;
var packageBeach;

exports.passportInit = function() {

  console.log("Initilaizing Passport SSO")

  //Certificates & Keys
  privateCert = fs.readFileSync(__dirname + '/cert/key.pem', 'utf8');
  publicCert = fs.readFileSync(__dirname + '/cert/cert.pem', 'utf8');
  cert = fs.readFileSync(__dirname + '/cert/idp_cert.pem', 'utf8');

  samlStrategy = new saml.Strategy({
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: config.get("paragon_callback_url"),
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: config.get("paragon_entry_point"),
    // Usually specified as `/shibboleth` from site root
    issuer: config.get("paragon_issuer"),

    identifierFormat: null,

    // Service Provider Certificate
    privateCert: privateCert,
    // Identity Provider's public key
    cert: cert,

    validateInResponseTo: false,
    disableRequestedAuthnContext: true
  }, function(profile, done) {
    console.log("Checking Profile");
    return done(null, {
      id: profile.loginid,
      email: profile.email,
      displayName: profile.MLS,
      firstName: profile.FirstName,
      lastName: profile.LastName
    });
  });

  package = samlStrategy.generateServiceProviderMetadata(publicCert, publicCert);

  // View Completed Components
  //console.log("package: " + package);

};

exports.passportInitBeach = function() {

  console.log("Initilaizing Passport Beach SSO")

  //Certificates & Keys
  privateCert = fs.readFileSync(__dirname + '/cert/key.pem', 'utf8');
  publicCert = fs.readFileSync(__dirname + '/cert/cert.pem', 'utf8');
  certBeaches = fs.readFileSync(__dirname + '/cert/idp_cert_beach.pem', 'utf8');

  samlStrategyBeach = new saml.Strategy({
    // URL that goes from the Identity Provider -> Service Provider
    callbackUrl: config.get("paragon_callback_url"),
    // URL that goes from the Service Provider -> Identity Provider
    entryPoint: config.get("beaches_entry_point"),
    // Usually specified as `/shibboleth` from site root
    issuer: config.get("beaches_issuer"),

    identifierFormat: null,

    // Service Provider Certificate
    privateCert: privateCert,
    // Identity Provider's public key
    cert: certBeaches,

    validateInResponseTo: false,
    disableRequestedAuthnContext: true
  }, function(profile, done) {
    console.log("Checking Profile");
    return done(null, {
      id: profile.loginid,
      email: profile.email,
      displayName: profile.MLS,
      firstName: profile.FirstName,
      lastName: profile.LastName
    });
  });

  packageBeach = samlStrategyBeach.generateServiceProviderMetadata(publicCert, publicCert);

  // View Completed Components
  //console.log("package: " + package);

};

exports.getSamlMetadata = function() {
  return package;
};

exports.getSamlStrategy = function() {
  return samlStrategy;
};

exports.getBeachSamlMetadata = function() {
  return packageBeach;
};

exports.getBeachSamlStrategy = function() {
  return samlStrategyBeach;
};
