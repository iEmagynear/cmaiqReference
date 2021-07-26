const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const mlsSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        maxlength: 80,
    },
    chart_api: {
        type: String,
        trim: true
    },
    alias: {
        type: String,
        trim: true
    },
    server_id: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        trim: true,
        default: false
    },
    enableCSVUpload: {
        type: Boolean,
        trim: true,
        default: false
    },
    hasRental: {
        type: String,
        trim: true
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Mls = mongoose.model("Mls", mlsSchema, 'mlss');

exports.Mls = Mls;
