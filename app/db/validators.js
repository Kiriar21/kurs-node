const validator = require('validator');

module.exports = {
    checkForbiddenString(value, forbiddenString) {
        if (value === forbiddenString) {
            throw new Error(`Nazwa ${forbiddenString} jest zakazana`);
        }
    },

    validateEmail(email) {
        return validator.isEmail(email);
    }


} 