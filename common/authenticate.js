const jwt=require("jsonwebtoken");
const Model=require("../models");
module.exports.getToken=(data)=>
    jwt.sign(data,process.env.SECRET_KEY,{
        expiresIn:"30 days"
    });

module.exports.verifyToken=(token)=>
    jwt.verify(token,process.env.SECRET_KEY);

module.exports.verify=(...args)=>async(req,res,next)=>{
    try {
        let roles=[].concat(args).map((role)=>role.toLowerCase());
        const token=String(req.headers.authorization||"")
        .replace(/bearer|jwt|Guest/i,"")
        .trim();

        let check=null;
        let role="";
        console.log(token, "token",roles);
        const verified=this.verifyToken(token);
        if(verified!=null && roles.includes("user")){
            console.log("result after verifyign token",verified);
            role="user";
            check=await Model.User.findOne({
                _id:verified._id,
                isBlocked:false,
                isDeleted:false,
                jti:verified.jti
            });
        }
        if(verified!=null && roles.includes("admin")){
            console.log("result after verifying token",verified);
            role="admin";
            check=await Model.Admin.findOne({
                _id:verified._id,
                isBlocked:false,
                isDeleted:false,
                jti:verified.jti
            });
        }
        if(!verified){
            return res.status(401).send({
                "statusCode":401,
                "message":"UNAUTHROIZED ACCESS",
                "data":{},
                "status":1,
                "isSessionExpired":true
            });
        }
        if(role) req[role]=check.toJSON();
        console.log("req.role",req.role);
        next();
    } catch (error) {
       console.error(error);
       const message=
       String(error.name).toLowerCase()=="error"?
       error.message:"UNAUTHORIZED ACCESS";
       return res.error(401,message);
    }
};