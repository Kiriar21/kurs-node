const { RateLimiterMemory } = require('rate-limiter-flexible')

const rateLimiter = new RateLimiterMemory({
    points: 1, // ile requestow na 
    duration: 1 // sekunde / wiecej sekund 
})

const rateLimiterMiddleware = (req,res,next) => {
    rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => {
            res.status(429).send('Too many requests')
        })
}

module.exports = rateLimiterMiddleware