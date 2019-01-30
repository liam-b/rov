const pwm = require('./pwm.js')

const MIN_DUTY_CYCLE = 4
const MAX_DUTY_CYCLE = 13

module.exports = class {
  constructor(pwmHat, channel) {
    this.pwmDevice = new pwm.Device(pwmHat, channel)
    this.position = 0
    this.lastPosition = 1

    this.updatePosition(this.position)
  }

  rotateTo(position) {
    this.updatePosition(position)
  }

  rotateBy(position) {
    this.updatePosition(this.position + position)
  }

  updatePosition(newPosition) {
    this.position = newPosition

    if (this.position != this.lastPosition) {
      let position = newPosition * ((MAX_DUTY_CYCLE - MIN_DUTY_CYCLE) / 2 / 100)
      position += (MIN_DUTY_CYCLE + MAX_DUTY_CYCLE) / 2

      var dutyCycle = Math.max(MIN_DUTY_CYCLE, Math.min(Math.abs(position), MAX_DUTY_CYCLE))
      this.pwmDevice.dutyCycle = dutyCycle
    }
    if (dutyCycle == MIN_DUTY_CYCLE || dutyCycle == MAX_DUTY_CYCLE) this.position = this.lastPosition
    else this.lastPosition = this.position
  }
}