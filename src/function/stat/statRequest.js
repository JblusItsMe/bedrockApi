const ByteBuffer = require('bytebuffer');
const {QUERY} = require("../../config");

class StatRequest {

    constructor(challengeToken) {
        this.bb = new ByteBuffer();
        this.challengeToken = challengeToken;
    }

    encode() {
        this.bb
            .append(QUERY.MAGIC, 'hex')
            .writeByte(QUERY.STATISTIC)
            .writeInt32(1)
            .writeInt32(this.challengeToken)
            .writeInt32(0)
            .flip()
            .compact();
    }

}

module.exports = StatRequest;