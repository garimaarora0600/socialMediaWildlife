const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require("../common/constants");

const AccessRoleSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    permission: [{
        sideBarId: {
            type: Number,
            enum: Object.values(constants.MODULES)
        },
        label: {
            type: String,
            default: null
        },
        isView: {
            type: Boolean,
            default: false
        },
        isAdd: {
            type: Boolean,
            default: false
        },
        isDelete: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});
module.exports = mongoose.model('AccessRole', AccessRoleSchema);