const {QUERY} = require("../../config");
const {readString} = require("../function");

class StatResponse {

    constructor(buf) {
        this.bb = buf;
        this.bb.offset = 16;
    }

    decode() {
        this.data = {};
        this.players = {};
        let key;
        let value;
        while(this.bb.readUint16(this.bb.offset) !== QUERY.KEYVAL_END) {
            key = readString(this.bb);
            value = readString(this.bb);
            this.data[key] = value;
        }
        this.bb.offset += 11;
        let player = readString(this.bb);
        while(player.length >= 1) {
            this.players.push(player);
            player = readString(this.bb);
        }
    }

}

module.exports = StatResponse;