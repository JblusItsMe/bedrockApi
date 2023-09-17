'use strict';

const dgram = require('dgram');
const bytebuffer = require('bytebuffer');
const portfinder = require('portfinder');
const dns = require('dns');
const { RAKNET } = require('./config');
const Challenge = require('./function/challenge/challenge');
const ChallengeResponse = require('./function/challenge/challengeResponse');
const StatsRequest = require('./function/stat/statRequest');
const StatsResponse = require('./function/stat/statResponse');
const UnconnectedPing = require('./function/unconnectedPing');
const UnconnectedPong = require('./function/unconnectedPong');

class BedrockAPI {

    constructor() {
        this.START_TIME = new Date().getTime();
        this.MCPE_DEFAULT_PORT = 19132;
    }

    ping(server, port, callback, timeout, fullQuery) {
        if(typeof timeout == 'boolean' && typeof timeout === 'undefined') {
            fullQuery = timeout;
            timeout = undefined;
        }
        if(typeof port == 'function') {
            callback = port;
            port = this.MCPE_DEFAULT_PORT;
        }
        if(typeof port !== 'number') {
            port = this.MCPE_DEFAULT_PORT;
        }
        if(typeof timeout === 'undefined') {
            timeout = 5000;
        }

        if(this.checkIsIPV4(server)) {
            if(fullQuery) {
                this.query(server, port, callback, timeout);
            } else {
                this.pingIP(server, port, callback, timeout);
            }
        } else {
            dns.lookup(server, (err, res) => {
                if(err === null) {
                    if(fullQuery) {
                        this.query(res, port, callback, timeout);
                    } else {
                        this.pingIP(res, port, callback, timeout);
                    }
                } else {
                    callback({
                        error: true,
                        description: 'DNS loockup failed'
                    }, null);
                }
            })
        }
    }

    query(server, port, callback, timeout) {
        const client = dgram.createSocket('udp4');
        client.on('message', (msg, rinfo) => {
            const buf = new bytebuffer().append(msg, 'hex').flip();
            const id = buf.buffer[0];
            switch(id) {
                case 0x09:
                    const pong = new ChallengeResponse(buf);
                    pong.decode();
                    const statsRequest = new StatsRequest(pong.challengeToken);
                    statsRequest.encode();
                    client.send(statsRequest.bb.buffer, 0, statsRequest.bb.buffer.length, port, server);
                break;
                case 0x00:
                    const stats = new StatsResponse(buf);
                    const clientData = {
                        rinfo: rinfo,
                        hostname: stats.data.hostname,
                        gametype: stats.data.gametype,
                        game: stats.data.gameId,
                        version: stats.data.version,
                        serverEngine: stats.data['server_engine'],
                        plugins: stats.data.plugins,
                        map: stats.data.map,
                        currentPlayers: stats.data.numplayers,
                        maxPlayers: stats.data.maxplayers,
                        whitelist: stats.data.whitelist === "on",
                        hostIp: stats.data.hostip,
                        hostPort: stats.data.hostport,
                        ackId: new Date().getTime() - this.START_TIME,
                        players: stats.players,
                        connected: true
                    };
                    client.close();
                    callback(null, clientData);
                    break;
                default:
                    callback({
                        error: true,
                        description: 'Bad packet response.'
                    }, null);
                    client.close();
                    break;
            }
        });
        try {
            const challenge = new Challenge();
            challenge.encode();
            client.send(challenge.bb.buffer, 0, challenge.bb.buffer.length, port, server);
        } catch(err) {
            client.close();
            callback({
                error: true,
                description: 'Error sending ping.'
            }, null);
        }
    }

    pingIP(server, port, callback, timeout) {
        const client = dgram.createSocket('udp4');
        const broadcastPing = () => {
            try {
                const ping = new UnconnectedPing(new Date().getTime() - this.START_TIME);
                ping.encode();
                client.send(ping.bb.buffer, 0, ping.bb.buffer.length, port, server);
            } catch(err) {
                clearInterval(broadcastIntervalId);
                clearTimeout(timeoutId);
                client.close();
                callback({
                    error: true,
                    description: 'Error sending ping.'
                }, null);
            }
        };
        broadcastPing();
        const broadcastIntervalId = setInterval(broadcastPing.bind(this), 400);
        const timeoutId = setTimeout(() => {
            clearInterval(broadcastIntervalId);
            client.close();
            callback({ error: true, description: "Ping session timed out." }, null);
        }, timeout);
        client.on("message", (msg, rinfo) => {
            const buf = new bytebuffer().append(msg, "hex").flip();
            const id = buf.buffer[0];
            switch (id) {
                case 0x1c:
                    const pong = new UnconnectedPong(buf);
                    pong.decode();
                    const clientData = {
                        rinfo: rinfo,
                        //advertise: pong.advertiseString,
                        serverId: pong.serverId,
                        pingId: pong.pingId,
                        game: pong.gameId,
                        version: pong.gameVersion,
                        name: pong.name,
                        cleanName: pong.name.replace(/\xA7[0-9A-FK-OR]/ig, ''),
                        currentPlayers: pong.currentPlayers,
                        maxPlayers: pong.maxPlayers,
                        ackId: new Date().getTime() - this.START_TIME,
                        connected: true
                    };
                    clearInterval(broadcastIntervalId);
                    clearTimeout(timeoutId);
                    client.close();
                    callback(null, clientData);
                    break;
                default:
                    console.log(id);
                    break;
            }
        });
    }

    checkIsIPV4(entry) {
        if(typeof entry !== 'string') {
            return false;
        }
        const blocks = entry.split('.');
        if (blocks.length === 4) {
            return blocks.every(
                block => /^\d{1,3}$/.test(block)
                    && parseInt(block, 10) >= 0
                    && parseInt(block, 10) <= 255);
        }
        return false;
    }

    isOnline(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.connected, callback);
    }

    getAckId(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.ackId, callback);
    }

    getMaxOnline(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.maxPlayers, callback);
    }

    getOnline(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.currentPlayers, callback);
    }

    getCleanName(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.cleanName, callback);
    }

    getName(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.name, callback);
    }

    getVersion(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.version, callback);
    }

    getGame(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.game, callback);
    }

    getPingId(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.pingId, callback);
    }

    getServerId(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.serverId, callback);
    }

    getIp(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.rinfo.address, callback);
    }

    getIpFamilly(server, port, callback) {
        performPingOperation.call(this, server, port, res => res.rinfo.family, callback);
    }

}

function performPingOperation(server, port, operation, callback) {
    this.ping(server, port, function(err, res) {
        if(err) {
            callback('Error sending ping.', null);
        } else {
            callback(null, operation(res));
        }
    });
}

module.exports = BedrockAPI;