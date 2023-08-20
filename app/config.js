require('dotenv').config()

module.exports = {
    port : process.env.PORT || 1024,
    database: process.env.DATABASE || 'mongodb://127.0.0.1/node-kurs',
    sessionKeySecret: process.env.SESSION_KEY_SECRET,
    ssl: process.env.SSL || false
}