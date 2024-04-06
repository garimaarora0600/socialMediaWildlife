const mongoose = require("mongoose");
global.ObjectId = mongoose.Types.ObjectId;

//Mongo Db connection
module.exports.mongodb = async () => {
    try {
        console.log('process.env.MONGODB_URL,: ', process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("mongo connected");
    } catch (error) {
        console.error("mongo error: ", error);
    }
};