const app = require('./app');
const { port }  = require('./config');
app.listen(port, () => {
    console.log('Serwer został uruchomiony.\nNasłuchiwanie na porcie: ' + port);
})