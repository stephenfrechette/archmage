var Player = function (startPlayerType, startX, startY, startAngle, startroom) {
  var playerType = startPlayerType
  var x = startX
  var y = startY
  var angle = startAngle
  var room = startroom
  var id = id

  var getPlayerType = function () {
    return playerType
  }

  var getX = function () {
    return x
  }

  var getY = function () {
    return y
  }

  var getAngle = function () {
    return angle
  }

  var getRoom = function () {
    return room
  }

  var setX = function (newX) {
    x = newX
  }

  var setY = function (newY) {
    y = newY
  }

  var setAngle = function (newAngle) {
    angle = newAngle
  }

  return {
    getPlayerType: getPlayerType,
    getX: getX,
    getY: getY,
    getAngle: getAngle,
    getRoom: getRoom,
    setX: setX,
    setY: setY,
    setAngle: setAngle,
    id: id
  }
}

module.exports = Player
