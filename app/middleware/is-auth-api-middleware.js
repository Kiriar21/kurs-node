const User = require("../db/models/user");

module.exports = async function(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(403).json({message: "Nie masz dostepu. Zaloguj się."})
    }

    const user = await User.findOne({apiToken: token})

    if (!user) res.status(403).json({message: "Nie masz dostepu. Zaloguj się."})
    else {
        req.user = user;
        next();
    }
    

}