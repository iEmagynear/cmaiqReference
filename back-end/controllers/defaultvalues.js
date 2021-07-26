const Joi = require("joi");
const _ = require('lodash');
const { User } = require("../models/user");
const { DefaultValues } = require("../models/defaultvalues");
const jwt = require("jsonwebtoken");
const config = require("config");
const csv = require('csv-parser');
const fs = require('fs');
const csv2 = require('csvtojson');
const nodeMailer = require('nodemailer')
const bcrypt = require('bcrypt');
var handlebars = require('handlebars');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const stripe = require("stripe")(config.get("stripe_sk"));
const { Payment } = require("../models/payment");

exports.update_default_values = async (req, res) => {

    const schema = {
        Improvements: Joi.number().required(),
        TotalImprovementValue: Joi.number().required(),
        BuildingValue: Joi.number().required(),
        RateofInflation: Joi.number().required(),
        HouseValueAppreciation: Joi.number().required(),
        CostofSale: Joi.number().required(),
        EstimatedVacancy: Joi.number().required(),
        NominalFederalIncomeTaxRate: Joi.number().required(),
        NominalStateIncomeTaxRate: Joi.number().required(),
        NominalLocalIncomeTaxRate: Joi.number().required(),
        NominalStraightLineRecaptureTaxRate: Joi.number().required(),
        NominalFederalCapitalGainTaxRate: Joi.number().required(),
        NominalStateCapitalGainTaxRate: Joi.number().required(),
        NominalLocalCapitalGainTaxRate: Joi.number().required(),
        FmInterestRate: Joi.number().required(),
        FmTerm: Joi.number().required(),
        SmLoantoValueorLoanAmount: Joi.number().required(),
        SmInterestRate: Joi.number().required(),
        SmTerm: Joi.number().required(),
        Hoa: Joi.number().required(),
        Repairs: Joi.number().required(),
        RegimeFee: Joi.number().required(),
        Electric: Joi.number().required(),
        Water: Joi.number().required(),
        CostofSale: Joi.number().required(),
        Accounting: Joi.number().required(),
        Liscenses: Joi.number().required(),
        Advertising: Joi.number().required(),
        Trash: Joi.number().required(),
        monitoring: Joi.number().required(),
        maintenance: Joi.number().required(),
        Pest: Joi.number().required(),
        Management: Joi.number().required(),
        Other: Joi.number().required(),
        EstimatedClosingCosts: Joi.number().required(),
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        return res.status(400).send({ message: result.error.details[0].message });
    }
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };
    try {
        await DefaultValues.findOneAndUpdate({}, req.body, options);
        res.send({ "message": "Default Values Updated"});
    }
    catch(err){
        return res.status(400).send(err);
    }

    
};

exports.get_default_values = async(req,res) => {

    let defaultValues;
    
    try {
        defaultValues = await DefaultValues.findOne();

    } catch(err) {
        console.log(err); // TypeError: failed to fetch
    }

    res.send({'defaultValues':defaultValues})
};
