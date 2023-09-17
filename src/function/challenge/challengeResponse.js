class ChallengeResponse {

    constructor(buf) {
        this.bb = buf;
        this.bb.offset = 1;
    }

    decode() {
        this.clientId = this.bb.readInt32();
        const bb = this.bb.slice(5);
        this.challengeToken = parseInt(bb.toString('utf8'), 10);
    }

}

module.exports = ChallengeResponse;