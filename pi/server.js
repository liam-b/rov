const server = require('http').createServer()
const io = require('socket.io')(server)
server.listen(8080, () => {
  console.log('server listening on 8080')
})

const pwm = require('./pwm.js')
const Thruster = require('./thruster.js')
const Servo = require('./servo.js')
const Light = require('./light.js')
const Failsafe = require('./failsafe.js')

const hat = new pwm.Hat(60)
const thrusterHL = new Thruster(hat, 0, 7, 11)
const thrusterHR = new Thruster(hat, 1, 12, 13)

const thrusterVL = new Thruster(hat, 2, 15, 16)
const thrusterVR = new Thruster(hat, 3, 18, 22)

const cameraServoH = new Servo(hat, 4)
const cameraServoV = new Servo(hat, 5)

const light = new Light(19)
const failsafe = new Failsafe(thrusterHL, thrusterHR, thrusterVL, thrusterVR)

io.on('connection', socket => {
  console.log('mac connected', socket.id)

  socket.on('control', control => {
    thrusterHL.run(control.drive.horizontal.left)
    thrusterHR.run(control.drive.horizontal.right)

    if (control.pan.reset) {
      cameraServoH.rotateTo(0)
      cameraServoV.rotateTo(0)
    } else {
      cameraServoH.rotateBy(control.pan.horizontal)
      cameraServoV.rotateBy(control.pan.vertical)
    }

    light.set(control.light)
    failsafe.armed = control.failsafe.armed
    if (control.failsafe.activated || failsafe.activated) failsafe.activate()

    const sensors = {
      voltage: 14.2,
      current: 3.6
    }
    socket.emit('sensors', sensors)
  })

  socket.on('disconnect', () => {
    console.log('mac disconnected', socket.id)
    failsafe.activate()
  })
})
