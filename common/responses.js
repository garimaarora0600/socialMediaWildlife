const functions = require("./functions");

module.exports = () => (req, res, next) => {
    // success response
    res.success = (message, data, lang) => {
        console.log(lang, "lang");
        message = functions.prettyCase(message);
        return res.send({
            statusCode: 200,
            message,
            data: data || {},
            status: 1
        });
    };

    // error response
    res.error = (code, message, data, errCode,lang) => {
        console.log(code, message, data,lang);
        message = functions.prettyCase(message);
        code = code ? code : 400;
        if (code == 401) {
            return res.status(code).send({
                statusCode: code,
                message,
                data: data || {},
                status: 0,
                "isSessionExpired": true,
                errCode: errCode || 0
            });
        } else {
            return res.status(code).send({
                statusCode: code,
                message,
                data: data || {},
                status: 0,
                "isSessionExpired": false,
                errCode: errCode || 0
            });
        }
    };

    // proceed forward
    next();
};