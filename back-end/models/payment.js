const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const PaymentSchema = new mongoose.Schema ({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    mls_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Mls' 
    },
    subscription_id: {
        type: String,
        trim: true,
    },
    subscription_plan: {
        type: String,
        trim: true,
    },
    subscription_end_date: {
        type: String,
        trim: true,
    },
    canceled_at_period_end: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        trim: true,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});


const Payment = mongoose.model("Payment", PaymentSchema);

exports.Payment = Payment;