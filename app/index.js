const app = require('./app');
const { port, ssl }  = require('./config');
const https = require('https');
const fs = require('fs');
//http 80
app.listen(port, () => {
    console.log('Serwer został uruchomiony.\nNasłuchiwanie na porcie: ' + port);
})

//https 443
if(ssl){
    https.createServer({
        key: fs.readFileSync('/sciezka/privkey'),
        cert: fs.readFileSync('/sciezka/cert.pem'),
        ca: fs.readFileSync('/sciezka/chain.pem')
    }).listen(443, () => {
        console.log('Serwer został uruchomiony na porcie 443');
    })
}