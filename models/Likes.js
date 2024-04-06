const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const LikesSchema=new Schema({
    like:{
        type:Number,
        default:0
    },
    postId:{
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
LikesSchema.set("toJSON",{
    virtuals:true
});
module.exports = mongoose.model('Likes', LikesSchema);