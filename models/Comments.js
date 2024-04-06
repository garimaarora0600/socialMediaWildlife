const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

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
    commentId:{
        type:ObjectId,
        ref:"Comments",
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
},{
    timestamps:true
});
CommentSchema.set("toJSON",{
    virtuals:true
});
module.exports = mongoose.model('Comments', CommentSchema);