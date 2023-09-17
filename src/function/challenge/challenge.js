const ByteBuffer = require('bytebuffer');
const { QUERY } = require('../../config');

class Challenge {

    constructor(buf) {
        this.bb = new ByteBuffer();
    }

    encode() {
        this.bb
            .append(QUERY.MAGIC, 'hex')
            .writeByte(QUERY.HANDSHAKE)
            .writeInt32(1)
            .flip()
            .compact();
    }

}

module.exports = Challenge;