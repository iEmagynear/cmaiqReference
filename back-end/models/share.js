const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const shortid = require('shortid');

const shareSchema = new mongoose.Schema ({
    _id: {
        type: String,
        default: shortid.generate
    },
    user_id: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    agency: {
        type: String,
        trim: true,
    },
    agent_email: {
        type: String,
        trim: true,
    },
    agent_name: {
        type: String,
        trim: true,
    },
    agent_phone: {
        type: String,
        trim: true,
    },
    available: {
        type: String,
        trim: true,
    },
    baths: {
        type: String,
        trim: true,
    },
    beds: {
        type: String,
        trim: true,
    },
    chart_id: {
        type: String,
        trim: true,
    },
    note: {
        type: String
    },
    price: {
        type: String,
        trim: true,
    },
    property_image: {
        type: String,
        trim: true,
    },
    sqft: {
        type: String,
        trim: true,
    },
    webiste: {
        type: String,
        trim: true,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});


const Share = mongoose.model("Share", shareSchema);

exports.Share = Share;
