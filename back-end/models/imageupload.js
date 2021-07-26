const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const { isInteger } = require('lodash');

const imageuploadschema = new mongoose.Schema({

    name: {
        type: String,
        trim: true
    },
    algorithm: {
        type: String,
        trim: true
    },
    encoding: {
        type: String,
        trim: true
    },
    checksum: {
        type: String,
        trim: true
    },
    path: {
        type: String,
        trim: true
    },
    mls_id: {
        type: String,
        trim: true,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const ImageUpload = mongoose.model("ImageUpload", imageuploadschema, 'imageuploads');

exports.ImageUpload = ImageUpload;