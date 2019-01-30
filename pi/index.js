const pwm = require('./pwm.js')
const Thruster = require('./thruster.js')
const server = require('./server.js')

var pwmHat = new pwm.Hat(60)
var thruster = new Thruster(pwmHat, 0, 7, 11)

setInterval(() => {
  if (server.joystick.rightTrigger || server.joystick.rightTrigger == 0) {
    console.log(server.joystick.rightTrigger / 255 * 100)
    thruster.run(server.joystick.rightTrigger / 255 * 100)
  }
}, 80)