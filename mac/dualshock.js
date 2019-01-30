const HID = require('node-hid')
const devices = HID.devices()
const found = devices.find(d => d.vendorId == 1356 && d.productId == 1476)

const controller = {
  joystick: {
    left: {
      x: 0,
      y: 0
    },
    right: {
      x: 0,
      y: 0
    }
  },
  trigger: {
    left: 0,
    right: 0
  },
  button: {
    triangle: false,
    circle: false,
    cross: false,
    square: false,
    pad: {
      up: false,
      right: false,
      down: false,
      left: false
    },
    joystick: {
      right: false,
      left: false
    },
    options: false,
    share: false,
    trigger: {
      left: false,
      right: false
    },
    bumper: {
      left: false,
      right: false
    },
    touchpad: false,
    playstation: false
  }
}

const axisMap = [
  null, 
  'joystick.left.x', 'joystick.left.y', 
  'joystick.right.x', 'joystick.right.y', 
  null, null, null,
  'trigger.left', 'trigger.right'
]

const buttonMap = [
  'triangle', 'circle', 'cross', 'square', 
  null, null, null, null, 
  'joystick.right', 'joystick.left', 
  'options', 'share', 
  'trigger.right', 'trigger.left', 
  'bumper.right', 'bumper.left',
  null, null, null, null, null, null,
  'touchpad', 'playstation'
]

const padMap = {
  '0000': [true, false, false, false],
  '0001': [true, true, false, false],
  '0010': [false, true, false, false],
  '0011': [false, true, true, false],
  '0100': [false, false, true, false],
  '0101': [false, false, true, true],
  '0110': [false, false, false, true],
  '0111': [true, false, false, true],
  '1000': [false, false, false, false],
}
if (found) {
  const device = new HID.HID(1356, 1476)
  device.on('data', data => {
    for (const i in axisMap) {
      if (axisMap[i]) index(controller, axisMap[i], data.readUInt8(parseInt(i)))
    }

    const buttons = data.readUIntBE(5, 3).toString(2).padStart(24, '0')
    for (const i in buttonMap) {
      if (buttonMap[i]) index(controller.button, buttonMap[i], buttons.charAt(i) == '1')
    }

    const pad = padMap[buttons.slice(4, 8)]
    controller.button.pad.up = pad[0]
    controller.button.pad.right = pad[1]
    controller.button.pad.down = pad[2]
    controller.button.pad.left = pad[3]
  })
}

function index(obj, is, value) {
  if (typeof is == 'string')
    return index(obj, is.split('.'), value)
  else if (is.length == 1 && value !== undefined)
    return obj[is[0]] = value
  else if (is.length == 0)
    return obj
  else
    return index(obj[is[0]], is.slice(1), value)
}

module.exports.controller = controller