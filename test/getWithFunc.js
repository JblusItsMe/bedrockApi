const API = require('./../src/index');
const api = new API();

const ip = 'play.nethergames.org';
const port = 19132;

console.log('Server Information: ');
api.isOnline(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Is online: ', result);
    }
});
api.getAckId(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('AckID: ', result);
    }
});
api.getMaxOnline(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Max Players: ', result);
    }
});
api.getOnline(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Online Players: ', result);
    }
});
api.getCleanName(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Clean Name: ', result);
    }
});
api.getName(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Name: ', result);
    }
});
api.getVersion(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Version: ', result);
    }
});
api.getGame(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Game: ', result);
    }
});
api.getPingId(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Ping id: ', result);
    }
});
api.getServerId(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Server id: ', result);
    }
});
api.getIp(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Ip: ', result);
    }
});
api.getIpFamilly(ip, port, function(error, result) {
    if(error) {
        console.error('Error: ', error);
    } else {
        console.log('Ip Familly: ', result);
    }
});