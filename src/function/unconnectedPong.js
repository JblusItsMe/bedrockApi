class UnconnectedPong {

    constructor(buf) {
        this.bb = buf;
        this.bb.offset = 1;
    }

    decode() {
        this.pingId = this.bb.readLong();
        this.serverId = this.bb.readLong();
        this.bb.offset += 16;
        this.nameLength = this.bb.readShort();
        try {
            this.advertiseString = this.bb.readUTF8String(this.nameLength);
        } catch(err) {
            this.advertiseString = this.bb.readUTF8String(parseInt(err.message.substr(err.message.indexOf(',') + 2, 3)));
        }
        const splitString = this.advertiseString.split(/;/g);
        this.gameId = splitString[0];
        this.name = splitString[1];
        this.unknownId = splitString[2];
        this.gameVersion = splitString[3];
        this.currentPlayers = splitString[4];
        this.maxPlayers = splitString[5];
    }

}

module.exports = UnconnectedPong;