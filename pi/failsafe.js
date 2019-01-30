module.exports = class {
  constructor(thrusterHL, thrusterHR, thrusterVL, thrusterVR) {
    this.thrusterHL = thrusterHL
    this.thrusterHR = thrusterHR
    this.thrusterVL = thrusterVL
    this.thrusterVR = thrusterVR

    this.armed = false
    this.failsafe = false
  }

  activate() {
    if (this.armed) {
      this.activated = true
      
      this.thrusterHL.stop()
      this.thrusterHR.stop()

      this.thrusterVL.run(80)
      this.thrusterVR.run(80)
    }
  }
}