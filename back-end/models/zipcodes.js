const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const ZipcodesSchema = new mongoose.Schema ({
    
    mls_id: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Zipcode = mongoose.model("Zipcode", ZipcodesSchema, 'zipcodes');

exports.Zipcode = Zipcode;
