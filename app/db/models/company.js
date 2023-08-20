const {mongoose, Schema} = require('mongoose')
const { checkForbiddenString }  = require('../validators')
const User = require('./user')

const CompanySchema = new Schema({
    slug: {
        type: String,
        required: [true,'Pole slug jest wymagane'],
        minLength: [3,'Minimalna długośc slugu to 3'],
        validate: value => checkForbiddenString(value,'slug'),
        trim: true,
        lowercase: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true,'Pole name jest wymagane'],
        minLength: [5,'Minimalna długosc name to 5']
    },
    employeesCount: {
        type: Number,
        min: [1,'Minimalna liczba pracownikow to 1'],
        default: 1
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: User, 
    },
    image: String,
})

//middleware dla sprawdzenia czy slug jest UNIQUE
CompanySchema.post('save', function(error, doc, next) {
    if (error.code === 11000) {
        error.errors = {
            slug: {
                message: 'Ten slug jest zajęty.'
            }
        }
    }
    next(error);
})


//setter - zachowanie miedzy funkcja a dodaniem do bazy, korzysta z czystego JS
// CompanySchema.path('slug').set((value)=> value.toLowerCase())

    //Można wyłączyć __v w mongoodb w schema
    //versionKey: false 

//Tworzenie modelu obiektu do bazy danych
const Company = mongoose.model('Company', CompanySchema)


module.exports = Company