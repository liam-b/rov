const jetty = new (require('jetty'))(process.stdout)

module.exports.X_OFFSET = 0
module.exports.Y_OFFSET = 2

module.exports.WIDTH = process.stdout.columns - module.exports.X_OFFSET
module.exports.HEIGHT = process.stdout.rows - module.exports.Y_OFFSET

module.exports.reset = () => {
  jetty.clear()
}

module.exports.destroy = () => {
  jetty.moveTo([module.exports.HEIGHT, 0])
}

module.exports.text = (value, position) => {
  jetty.moveTo([Math.round(position.y + module.exports.Y_OFFSET), Math.round(position.x + module.exports.X_OFFSET)]).text(value)
}

module.exports.number = (value, position) => {
  module.exports.text(Math.round(value).toString(), position)
}