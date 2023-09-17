'use strict';

const ByteBuffer = require('bytebuffer');
const {RAKNET} = require("../config");

class UnconnectedPing {

    constructor(pingId) {
        this.bb = new ByteBuffer();
        this.bb.buffer[0] = RAKNET.UNCONNECTED_PING;
        this.bb.offset = 1;
        this.pingId = pingId;
    }

    encode() {
        this.bb
            .writeLong(this.pingId)
            .append(RAKNET.MAGIC, 'hex')
            .writeLong(0)
            .flip()
            .compact();
    }

}

module.exports = UnconnectedPing;