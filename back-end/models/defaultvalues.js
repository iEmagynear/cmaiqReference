const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const DefaultValuesSchema = new mongoose.Schema ({    
    Improvements: {
        type: String,
        trim: true,
    },
    TotalImprovementValue: {
        type: String,
        trim: true,
    },
    BuildingValue: {
        type: String,
        trim: true,
    },
    RateofInflation: {
        type: String,
        trim: true,
    },
    HouseValueAppreciation: {
        type: String,
        trim: true,
    },
    CostofSale: {
        type: String,
        trim: true,
    },
    EstimatedVacancy: {
        type: String,
        trim: true,
    },
    NominalFederalIncomeTaxRate: {
        type: String,
        trim: true,
    },
    NominalStateIncomeTaxRate: {
        type: String,
        trim: true,
    },
    NominalLocalIncomeTaxRate: {
        type: String,
        trim: true,
    },
    NominalStraightLineRecaptureTaxRate: {
        type: String,
        trim: true,
    },
    NominalFederalCapitalGainTaxRate: {
        type: String,
        trim: true,
    },
    NominalStateCapitalGainTaxRate: {
        type: String,
        trim: true,
    },
    NominalLocalCapitalGainTaxRate: {
        type: String,
        trim: true,
    },
    FmInterestRate: {
        type: String,
        trim: true,
    },
    FmTerm: {
        type: String,
        trim: true,
    },
    SmLoantoValueorLoanAmount: {
        type: String,
        trim: true,
    },
    SmInterestRate: {
        type: String,
        trim: true,
    },
    SmTerm: {
        type: String,
        trim: true,
    },
    Hoa: {
        type: String,
        trim: true,
    },
    Repairs: {
        type: String,
        trim: true,
    },
    RegimeFee: {
        type: String,
        trim: true,
    },
    Electric: {
        type: String,
        trim: true,
    },
    Water: {
        type: String,
        trim: true,
    },
/*     CostofSale: {
        type: String,
        trim: true,
    }, */
    /* CostofSale: {
        type: String,
        trim: true,
    }, */
    Accounting: {
        type: String,
        trim: true,
    },
    Liscenses: {
        type: String,
        trim: true,
    },
    Advertising: {
        type: String,
        trim: true,
    },
    Trash: {
        type: String,
        trim: true,
    },
    monitoring: {
        type: String,
        trim: true,
    },
    maintenance: {
        type: String,
        trim: true,
    },
    Pest: {
        type: String,
        trim: true,
    },
    Management: {
        type: String,
        trim: true,
    },
    Other: {
        type: String,
        trim: true,
    },
    EstimatedClosingCosts: {
        type: String,
        trim: true,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});


const DefaultValues = mongoose.model("DefaultValues", DefaultValuesSchema);

exports.DefaultValues = DefaultValues;