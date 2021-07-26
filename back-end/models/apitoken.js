const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const ApiTokenSchema = new mongoose.Schema ({

    name: {
        type: String,
        trim: true,
        maxlength: 80,
    },
    slug: {
        type: String,
        trim: true,
        maxlength: 80,
    },
    token:{
        type: String,
        trim: true,
        //maxlength: 200,
    },
    expiry: { type: Date, default: null },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});


const ApiToken = mongoose.model("ApiToken", ApiTokenSchema);

exports.ApiToken = ApiToken;
