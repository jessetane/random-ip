var ip = require('ip');

module.exports = randomip;

function randomip(address, prefix, length) {
  address = ip.toBuffer(address);
  var ipv6 = address.length === 16;
  var partsize = ipv6 ? 16 : 8;
  prefix = prefix || 0;

  if (typeof length === 'undefined') {
    length = ipv6 ? 128 : 32;
  }

  // ipv6 parts are 16 bits
  var parts = [];
  for (var i=0; i<address.length; i++) {
    if (ipv6) {
      parts[i>>1] = address[i] << 8 | address[i+1];
      i++;
    }
    else {
      parts[i] = address[i];
    }
  }

  for (var i=0, pos=0; i<parts.length; i++, pos += partsize) {

    // skip out early if not randomizing this part
    if (pos + partsize < prefix || pos >= length) {
      continue;
    }

    var part = parts[i];

    // insert random bits
    for (var n=0; n<partsize; n++) {
      var bit = pos + n;
      if (bit >= prefix && bit < length) {
        var bitpos = partsize - n - 1;
        if (Math.random() < 0.5) {
          part |= 1 << bitpos;
        }
        else {
          part &= ~(1 << bitpos);
        }
      }
    }

    // save randomized part
    parts[i] = part;
  }

  // format ipv6
  if (ipv6) {
    for (var i=0; i<parts.length; i++) {
      parts[i] = parts[i].toString(16);
    }
    return parts.join(':')
  }

  // format ipv4
  return parts.join('.');
}
