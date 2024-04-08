const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParkSchema=new Schema({
    name:{
        type:String,
        default:""
    },
    geoFence: {
        type: {
            type: String
        },
        coordinates: {
            type: Array
        }
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});
ParkSchema.set("toJSON",{
    virtuals:true
});
module.exports = mongoose.model('Park', ParkSchema);