const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 80,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String
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
    companyname: {
        type: String,
        trim: true,
        maxlength: 200,
    },
    is_registered: {
        type: Boolean,
        default: true
    },
    reset_password_token: {
        type: String,
        default: null
    },
    reset_password_expires: {
        type: Date,
        default: null
    },
    stripe_cus_id: {
        type: String,
        default: null
    },
    roles: [{
        role: String,
        association: [{
            mls_id: mongoose.Schema.Types.ObjectId,
            expiry: {
                type: Date,
                default: null
            },
            payer_type_online: {
                type: String,
                default: null
            }
        }]
    }],
    default_mls_admin: {
        type: String,
        default: null
    },
    default_mls_frontend: {
        type: String,
        default: null
    },
    mls_specific_data: {
        type: Object,
        default: null
    },
    profile_image: {
        type: String,
        trim: true,
        default: null
    },
    profile_image_50X50: {
        type: String,
        trim: true,
        default: null
    },
    profile_image_150X150: {
        type: String,
        trim: true,
        default: null
    },
    profile_image_250X250: {
        type: String,
        trim: true,
        default: null
    },
    logo: {
        type: String,
        trim: true,
        default: null
    },
    logo_50X50: {
        type: String,
        trim: true,
        default: null
    },
    logo_150X150: {
        type: String,
        trim: true,
        default: null
    },
    logo_250X250: {
        type: String,
        trim: true,
        default: null
    },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    is_Agree: {
        type: Boolean,
        default: false
    },
    eula_Check: {
        type: Boolean,
        default: false
    },
    toa_Check: {
        type: Boolean,
        default: false
    },
    third_party_login: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function (uuid) {
    console.log("trying to generate jwt token ;)");
    const token = jwt.sign({ _id: this._id, email: this.email, uuid: uuid }, config.get("jwtSecret"), { expiresIn: config.get("refreshTokenLife"), issuer: config.get("issuer") });
    return token;
}

userSchema.methods.getSafe = function () {
    return _.pick(this, ['_id', 'username', 'firstname', 'lastname', 'email', 'roles', 'default_mls_frontend', 'companyname']);
}

const User = mongoose.model("User", userSchema);

exports.User = User;