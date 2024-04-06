const _=require("lodash");
const bcrypjs=require("bcryptjs");
module.exports.prettyCase = (str) => {
    if (typeof str == "string" && /^[A-Z_]+$/.test(str)) {
      str = _.lowerCase(str);
      str = _.startCase(str);
    }
    return str;
  };

module.exports.generateRandomStringAndNumbers = function (len) {
    let text = _.times(len, () => _.random(35).toString(36)).join('');
    return text;
};
module.exports.generateRandomNumbers = function (len) {
    let number = _.times(len, () => _.random(0,9)).join('');
    return number;
};
module.exports.hashPasswordUsingBcrypt=async(plainTextPassword)=>{
    try {
        return bcrypjs.hashSync(plainTextPassword,10);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports.comparePasswordUsingBcrypt=async(plain,hash)=>{
    try {
        return bcrypjs.compareSync(plain,hash);
    } catch (error) {
        throw new Error(error);
    }
};