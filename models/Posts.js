const mongoose = require("mongoose");
const constants = require('../common/constants');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = new Schema({
    image: {
        type: String,
        default: ""
    },
    video: {
        type: String,
        default: ""
    },
    text: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userId:{
        type: ObjectId,
        ref: "User",
        default:null
    },
    categoryId: {
        type: ObjectId,
        ref: "Category",
        default: null
    },
    subCategoryId: [{
        type: ObjectId,
        ref: "Category",
        default: null
    }],
    type: {
        type: Number,
        enum:  Object.values(constants.PITCH_TYPE) 
    },
    status: {
        type: Number,
        enum: Object.values(constants.PITCH_STATUS),
        default: constants.PITCH_STATUS.PENDING
    }
}, {
    timestamps: true
});
PostSchema.set("toJSON", {
    virtuals: true
});


module.exports = mongoose.model("Posts", PostSchema);