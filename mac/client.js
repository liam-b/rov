const io = require('socket.io-client')
const socket = io.connect('http://192.168.1.162:8080')
const Controller = require('./controller.js')
const HeadsUpDisplay = require('./heads-up.js')

const controller = new Controller()
const HUD = new HeadsUpDisplay(controller)

const FREQUENCY = 50
const DELTA = 1 / FREQUENCY

HUD.server = {
  voltage: 14.0,
  current: 3.0
}

socket.on('connect', () => {
  console.log('connected to pi')
  
  setInterval(() => {
    const control = {
      drive: controller.drive(),
      pan: controller.pan(),
      light: controller.light(),
      failsafe: controller.failsafe()
    }
    socket.emit('control', control)
    HUD.control = control
  }, FREQUENCY)
})

socket.on('sensors', sensors => {
  HUD.sensors = sensors
  HUD.data = interpretSensors(HUD.control, HUD.sensors)
  HUD.render()
})

socket.on('disconnect', () => {
  console.log('disconnected from pi')
})

let charge = 0
const startTime = process.hrtime()

function interpretSensors(control, sensors) {
  let seconds = process.hrtime(startTime)[0]
  let minutes = Math.floor(seconds / 60)

  charge += sensors.current * DELTA / 3.6

  return {
    charge: Math.round(charge),
    time: {
      minutes: Math.floor(seconds / 60),
      seconds: seconds % 60
    }
  }
}