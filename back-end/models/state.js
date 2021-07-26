const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const stateSchema = new mongoose.Schema ({
    
    name: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        trim: true
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const State = mongoose.model("State", stateSchema, 'states');

exports.State = State;
