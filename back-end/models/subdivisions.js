const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const subdivisionsSchema = new mongoose.Schema ({
    
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

const Subdivision = mongoose.model("Subdivision", subdivisionsSchema, 'subdivisions');

exports.Subdivision = Subdivision;
