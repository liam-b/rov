const gpio = require('rpi-gpio')
const pwm = require('./pwm.js')

const MAX_SPEED_DIFFERENTIAL = 6

module.exports = class {
  constructor(pwmHat, channel, forwardPin, reversePin) {
    this.pwmDevice = new pwm.Device(pwmHat, channel)
    this.forwardPin = forwardPin
    this.reversePin = reversePin

    this.history = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.lastSpeed = 0

    gpio.setup(this.forwardPin, gpio.DIR_OUT)
    gpio.setup(this.reversePin, gpio.DIR_OUT)
  }

  run(speed) {
    let scaledSpeed = this.scaleSpeed(speed)
    let dutyCycle = Math.max(0, Math.min(Math.abs(scaledSpeed), 100))
    this.pwmDevice.dutyCycle = dutyCycle

    gpio.write(this.forwardPin, scaledSpeed > 0)
    gpio.write(this.reversePin, scaledSpeed < 0)
  }

  stop() {
    this.run(0)
  }

  scaleSpeed(speed) {
    let scaled = Math.round(parseInt(speed))
    if (scaled - this.lastSpeed > MAX_SPEED_DIFFERENTIAL) scaled = this.lastSpeed + MAX_SPEED_DIFFERENTIAL
    if (scaled - this.lastSpeed < -MAX_SPEED_DIFFERENTIAL) scaled = this.lastSpeed - MAX_SPEED_DIFFERENTIAL
    this.lastSpeed = scaled

    return scaled
  }
}