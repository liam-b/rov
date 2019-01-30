const i2c = require('i2c-bus')

const bus = i2c.openSync(1)

module.exports.Device = class {
  constructor(address) {
    this.address = address
  }

  write(register, data) {
    bus.writeByteSync(this.address, register, data)
  }

  read(register) {
    return bus.readByteSync(this.address, register)
  }
}