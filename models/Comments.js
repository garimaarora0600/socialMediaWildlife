const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const constants=require("../common/constants");
const CommentSchema=new Schema({
    comment:{
        type:String,
        default:""
    },
    postId:{
        type:ObjectId,
        ref:"Posts",
        default:null,
        index:true
    },
    parentId:{
        type:ObjectId,
        ref:"Posts",
        default:null,
        index:true
    },
    replyToId:{
        type:ObjectId,
        ref:"Users",
        default:null,
        index:true
    },
    userId:{
        type:ObjectId,
        ref:"Users",
        default:null,
        index:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
    // commentType:{
    //     type:Number,
    //     enum:Object.values(constants.COMMENT_TYPE)
    // }
},{
    timestamps:true
});
CommentSchema.set("toJSON",{
    virtuals:true
});
module.exports = mongoose.model('Comments', CommentSchema);