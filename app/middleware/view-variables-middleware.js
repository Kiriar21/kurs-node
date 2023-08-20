module.exports = function(req, res, next) {
    //res.locals.nazwaZmiennej = response bedzie zawieralo url requesta
    res.locals.url= req.url,
    res.locals.errors=null,
    res.locals.form={},
    res.locals.query= req.query,
    next();
}