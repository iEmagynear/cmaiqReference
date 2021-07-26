const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const clientSchema = new mongoose.Schema ({

    email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 255
    },
    firstname: {
        type: String,
        trim: true,
        maxlength: 80,
    },
    lastname: {
        type: String,
        trim: true,
        maxlength: 80,
    },
    phone:{
        type: String,
        trim: true,
        maxlength: 200,
    },
    mls_user_id:{
        type: String,
        trim: true,
    },
    mls_id:{
        type: String,
        trim: true,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});


const Client = mongoose.model("Client", clientSchema);

exports.Client = Client;
