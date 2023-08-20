const {mongoose, Schema} = require('mongoose');
const {validateEmail} = require('../validators');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true,'Email jest wymagany'],
        lowercase: true,
        trim: true,
        unique: true,
        validate: [validateEmail, 'Email jest nieprawidłowy'],
    },
    password:{
        type: String,
        required: [true,'Hasło jest wymagane'],
        minLength: [4,'Hasło musi zawierać conajmniej 4 znaki']
    },
    firstName: {
        type:   String,
    },
    lastName: {
        type: String,
    },
    apiToken: {
        type: String,
    }
})

//Ten zapis hashuje haslo przed walidacja

// userSchema.path('password').set(value => {
//     //Generate hash of password, salt is second arg
//     const hash = bcrypt.hashSync(value,10);    
//     return hash;
// })

userSchema.pre('save',async function(next){
    const user = this;
    if(!user.isModified('password')) 
        return next();
    else 
        user.password = await bcrypt.hashSync(user.password,11);
    next();
})

//middleware dla sprawdzenia czy email jest UNIQUE
userSchema.post('save', function(error, doc, next) {
    if (error.code === 11000) {
        error.errors = {
            email: {
                message: 'Ten adres email jest zajęty.'
            }
        }
    }
    next(error);
})

userSchema.pre('save', function(next){
    const user = this

    if(user.isNew) this.apiToken = randomstring.generate(100)
    next()
})

userSchema.methods = {
    async comparePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

userSchema.virtual('fullName').get( function() {
    return `${this.firstName} ${this.lastName[0]}.`;
})

const User = mongoose.model('User', userSchema);

module.exports = User;