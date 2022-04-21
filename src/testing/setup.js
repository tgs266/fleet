const nodeCrypto = require('crypto');

window.crypto = {
  getRandomValues (buffer) {
    return nodeCrypto.randomFillSync(buffer);
  }
};