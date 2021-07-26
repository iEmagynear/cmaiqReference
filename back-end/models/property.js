const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const propertySchema = new mongoose.Schema ({

    address: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    zip:{
        type: String,
        trim: true,
    },
    square_footage:{
        type: String,
        trim: true,
    },
    client:{
        type: String,
        trim: true,
    },
    property_image:{
        type: String,
        trim: true,
        default:null
    },
    mls_user_id:{
        type: String,
        trim: true,
    },
    mls_id:{
        type: String,
        trim: true,
    },
    mls_number:{
        type: String,
        trim: true,
    },
    property_type:{
        type: String,
        trim: true,
    },
    bedroom:{
        type: String,
        trim: true,
    },
    bathroom:{
        type: String,
        trim: true,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});


const Property = mongoose.model("Property", propertySchema);

exports.Property = Property;
