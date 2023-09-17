function readString(bb) {
    const start = bb.offset;
    let b = bb.readUint8();
    while(b !== 0x0) {
        b = bb.readUint8();
    }
    return bb.toString('utf8', start, bb.offset - 1);
}

module.exports = {
    readString
}