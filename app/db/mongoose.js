const {mongoose} = require('mongoose')
const { database }  = require('../config')
const Company = require('./models/company')

async function connection() {
    await mongoose.connect(database)
    console.log("Połączenie udane")
}
connection();
