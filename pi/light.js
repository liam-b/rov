const gpio = require('rpi-gpio')

module.exports = class {
  constructor(pin) {
    this.enabled = false
    this.pin = pin

    gpio.setup(this.pin, gpio.DIR_OUT)
  }

  set(enabled) {
    this.enabled = enabled
    gpio.write(this.pin, !enabled)
  }
}