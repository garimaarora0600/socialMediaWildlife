const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let CMSSchema = new Schema({
    privacyPolicy: {
        type: String,
        default: "",
        index: true
    },
    termsAndConditions: {
        type: String,
        default: "",
        index: true
    },
    customerPolicy: {
        type: String,
        default: ""
    },
    aboutUs: {
        type: String,
        default: ""
    },
    deletionPolicy: {
        type: String,
        default: ""
    },
    supportPolicy: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});


module.exports = mongoose.model('Cms', CMSSchema);
