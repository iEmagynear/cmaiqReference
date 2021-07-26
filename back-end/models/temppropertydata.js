const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const temppropertydataSchema = new mongoose.Schema ({
    user_id: {
        type: String,
        trim: true
    },
    mls_id: {
        type: String,
        trim: true
    },
    jsondata: {
        type: String,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});


const Temppropertydata = mongoose.model("Temppropertydata", temppropertydataSchema);

exports.Temppropertydata = Temppropertydata;
