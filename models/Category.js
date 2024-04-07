const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.Schema.Types.ObjectId;
const constants=require("../common/constants");
const CategorySchema=new Schema({
    name:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
    },
    label:{
        type:String,
        default:""
    },
    parentId:{
        type:ObjectId,
        ref:"Category",
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    categoryType:{
        type:Number,
        enum:Object.values(constants.CATEGORY_TYPE)
    }
},{
    timestamps:true
});
CategorySchema.set("toJSON",{
    virtuals:true
});
module.exports=mongoose.model("Category",CategorySchema);