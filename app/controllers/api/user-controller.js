const User = require('../../db/models/user');


class UserController{
    
    async login(req,res){
        try{
            const user = await User.findOne({ email: req.body.email})

            if(!user){
                throw new Error('User not found')
            } 

            const isValidPassword = await user.comparePassword(req.body.password);
            
            if(!isValidPassword) {
                throw new Error('Invalid password')
            }
            
            //login
            res.status(200).json({ apiToken: user.apiToken})


        } catch(err) {
           res.sendStatus(401);
        }
    }
}

module.exports = new UserController()