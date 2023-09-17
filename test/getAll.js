const API = require('./../src/index');
const api = new API();

const ip = 'play.nethergames.org';
const port = 19132;

api.ping(ip, port, function(err, res) {
    if(err) {
        console.error(err);
    } else {
        console.log(res);
    }
});