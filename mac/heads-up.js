const display = require('./display.js')
const chalk = require('chalk')

const WIDTH = process.stdout.columns
const HEIGHT = process.stdout.rows

module.exports = class {
  constructor(controller) {
    this.controller = controller
    this.control = {}
    this.data = {}
    this.sensors = {}
  }

  render() {
    display.reset()

    display.text(
      chalk.bold(this.data.time.minutes.toString().padStart(2, '0') + ':' + this.data.time.seconds.toString().padStart(2, '0')), 
      { x: 2, y: 1 }
    )

    display.text(
      chalk.bold(this.sensors.voltage.toFixed(1) + 'v'),
      { x: 2, y: 3 }
    )

    display.text(
      chalk.bold(this.sensors.current.toFixed(1) + 'A'),
      { x: 2, y: 4 }
    )

    display.text(
      chalk.bold(this.data.charge.toString() + 'mAh'),
      { x: 2, y: 5 }
    )

    display.text(
      chalk.bold('LIGHTS ' + (this.control.light ? 'ENABLED' : 'DISABLED')), 
      { x: 2, y: display.HEIGHT - 4 }
    )

    display.text(
      chalk.bold('DRIVE ' + (this.control.drive.locked ? 'LOCKED' : 'UNLOCKED')), 
      { x: 2, y: display.HEIGHT - 2 }
    )

    if (this.control.failsafe.activated) {
      display.text(
        chalk.bold.red('FAILSAFE ACTIVATED'),
        { x: WIDTH / 2 - 9, y: HEIGHT - 4 }
      )
    } else {
      display.text(
        chalk.bold('FAILSAFE ' + (this.control.failsafe.armed ? 'ARMED' : 'DISARMED')),
        { x: WIDTH / 2 - 8, y: HEIGHT - 4 }
      )
    }

    // const thrusterTitleX = WIDTH / 2
    // const thrusterTitleY = HEIGHT - HEIGHT / 4

    // display.text(
    //   chalk.bold('THRUSTERS'),
    //   { x: thrusterTitleX, y: thrusterTitleY }
    // )

    // display.text(
    //   chalk.bold('LIGHTS ') +
    //   chalk.red.bold(this.client.light ? 'ENABLED' : 'DISABLED'), 
    //   { x: 3, y: 1 }
    // )
  }
}