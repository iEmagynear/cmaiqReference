const mongoose = require('mongoose');

const unknownStatusSchema = new mongoose.Schema({

    unknownstatus: {
        type: String
    },
    propertysample : { type: mongoose.Schema.Types.Mixed },
    // propertysample : { type : Mixed , "default" : [] },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },

});



const Unknownstatus = mongoose.model("Unknownstatus", unknownStatusSchema, 'unknownstatus');

exports.Unknownstatus = Unknownstatus;
