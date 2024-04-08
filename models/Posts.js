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
    parkId: {
        type: ObjectId,
        ref: "Park",
        default: null
    },
    visibility:{
        type:Number,
        default:0,
        min:0,
        max:5
    },
    traffic:{
        type:Number,
        default:0,
        min:0,
        max:3
    },
    time:{
        type:Date,
        default:new Date()
    },
    howManyYouSee:{
        type:Number,
        default:0
    },
    location: {
        type: {
          type: String,
          default: "Point"
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
    },
    status: {
        type: Number,
        enum: Object.values(constants.POST_STATUS),
        default: constants.POST_STATUS.PENDING
    }
}, {
    timestamps: true
});
PostSchema.set("toJSON", {
    virtuals: true
});


module.exports = mongoose.model("Posts", PostSchema);