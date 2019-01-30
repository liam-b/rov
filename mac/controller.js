const dualshock = require('./dualshock.js')

const CAMERA_PAN_SPEED = 4
const CAMERA_PAN_DEADBAND = 0.15
const DIFFERENTIAL_DRIVE_DEADBAND = 0.10
const FAILSAFE_THRESHOLD = 40

const OFF = 0
const RISING = 1
const ON = 2
const FALLING = 3

module.exports = class {
  constructor() {
    this.physical = dualshock.controller
    this.lastDrive = {}
    this.failsafeTriggerCount = 0

    this.driveLockToggle = OFF
    this.lightEnableToggle = OFF
    this.failsafeArmToggle = OFF
  }

  drive() {
    const driveLocked = this.updateDriveLock()
    const horizontal = this.horizontalDrive()
    const vertical = this.verticalDrive()

    if (!driveLocked) this.lastDrive = { horizontal, vertical }
    this.lastDrive.locked = driveLocked
    return this.lastDrive
  }

  updateDriveLock() {
    this.driveLockToggle = this.updateToggle(this.driveLockToggle, this.physical.button.joystick.left)
    return this.driveLockToggle == ON
  }

  horizontalDrive() {
    const x = 1 - this.physical.joystick.left.x / 255 * 2
    const y = 1 - this.physical.joystick.left.y / 255 * 2
  
    let r = Math.hypot(x, y)
    let t = Math.atan2(y, x)
    t -= Math.PI / 4
  
    let left = r * Math.cos(t) * Math.sqrt(2)
    let right = r * Math.sin(t) * Math.sqrt(2)
  
    left = Math.max(-100, Math.min(parseInt(left * 100), 100))
    right = Math.max(-100, Math.min(parseInt(right * 100), 100))

    const deadband = DIFFERENTIAL_DRIVE_DEADBAND * 100
    if (left <= deadband && left >= -deadband) left = 0
    if (right <= deadband && right >= -deadband) right = 0

    return { left, right }
  }

  verticalDrive() {
    let speed = 0
    if (this.physical.trigger.left) speed = -this.physical.trigger.left
    else speed = this.physical.trigger.right
    speed = Math.round(speed / 255 * 100)

    return { left: speed, right: speed }
  }

  pan() {
    let horizontal = (1 - this.physical.joystick.right.x / 255 * 2)
    let vertical = -(1 - this.physical.joystick.right.y / 255 * 2)

    horizontal = Math.round(horizontal * 100 / 100 * CAMERA_PAN_SPEED)
    vertical = Math.round(vertical * 100 / 100 * CAMERA_PAN_SPEED)
  
    const deadband = CAMERA_PAN_DEADBAND * CAMERA_PAN_SPEED
    if (horizontal <= deadband && horizontal >= -deadband) horizontal = 0
    if (vertical <= deadband && vertical >= -deadband) vertical = 0
  
    return { horizontal, vertical, reset: this.physical.button.joystick.right }
  }

  light() {
    this.lightEnableToggle = this.updateToggle(this.lightEnableToggle, this.physical.button.touchpad)
    return this.lightEnableToggle == ON || this.lightEnableToggle == RISING
  }

  failsafe() {
    const failsafeButton = this.physical.button.options && this.physical.button.share

    this.failsafeArmToggle = this.updateToggle(this.failsafeArmToggle, failsafeButton)
    this.failsafeTriggerCount = failsafeButton ? (this.failsafeTriggerCount + 1) : 0

    const activated = this.failsafeTriggerCount >= FAILSAFE_THRESHOLD
    const armed = this.failsafeArmToggle == ON || this.failsafeArmToggle == FALLING || activated

    return { armed, activated }
  }

  updateToggle(value, condition) {
    if (condition) {
      if (value == ON) return FALLING
      if (value == OFF) return RISING
    } else {
      if (value == RISING) return ON
      if (value == FALLING) return OFF
    }
    return value
  }
}