const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 80,
    },
    content: {
        type: String,
        trim: true
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const News = mongoose.model("News", newsSchema, 'news');

exports.News = News;
