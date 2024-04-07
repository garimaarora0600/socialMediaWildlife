const constants=require("../common/constants");
const Model=require("../models");
module.exports.checkSubAdmin=async(req)=>{
    let isAccess=false;
    if(req.admin.role==constants.ROLE.SUBADMIN){
        let qry={
            sideBarId:Number(req.query.sideBarId)
        };
        if(req.query.apiType=="get"){
            qry.isView=true;
        }else{
            qry.isView=true;
            if(req.query.apiType=="delete"){
                qry.isDelete=true;
            }
            if(req.query.apiType=="add"){
                qry.isAdd=true;
            }
        }
        let checkPermission=await Model.AccessRole.aggregate([
            {
                $match:{
                    _id:req.admin.accessRole,
                    permission:{
                        $elemMatch:qry
                    }
                }
            }
        ]);
        if(checkPermission.length>0){
            isAccess=true;
            return isAccess;
        }
    }else if(req.admin.role==constants.ROLE.ADMIN){
        isAccess=true;
        return isAccess;
    }
};