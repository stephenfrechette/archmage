var util = require('util')
var http = require('http')
var path = require('path')
var ecstatic = require('ecstatic')
var io = require('socket.io')

var Player = require('./Player')

var port = process.env.PORT || 8080

var socket	// Socket controller
var players	// Array of connected players

var playernum = 0

var treeLoc = 0

var isTree = true
var armor = 16

// Create and start the http server
var server = http.createServer(
  ecstatic({ root: path.resolve(__dirname, '../public') })
).listen(port, function (err) {
  if (err) {
    throw err
  }

  init()
})

function init () {
  players = []
  socket = io.listen(server)
  setEventHandlers()
}

var setEventHandlers = function () {
  socket.sockets.on('connection', onSocketConnection)

}

function onSocketConnection (client) {
  util.log('New player has connected: ' + client.id)
  playernum += 1
  client.emit('playnum', playernum)
  client.on('disconnect', onClientDisconnect)
  client.on('new player', onNewPlayer)
  client.on('move player', onMovePlayer)
  if (playernum === 2) {
    socket.emit('spawn boss')
    setTimeout(splitFire, 5000)
  }
  client.on('waterfire', waterfire)
  client.on('hitBoss', hitBoss)
  client.on('waterWallOn', waterWallOn)
  client.on('waterWallOff', waterWallOff)
  client.on('spearOn', spearOn)
  client.on('fountainOn', fountainOn)
}

function Phase1MainLoop () {
  setTimeout(spawnTree, 5000)
  setTimeout(spawnTree, 10000)
  setTimeout(spawnTree, 15000)
  setTimeout(spawnTree, 20000)
  setTimeout(spawnTree, 25000)
  setTimeout(spawnTree, 30000)
  setTimeout(forwardFirewall, 8000)
  setTimeout(forwardFirewall, 16000)
  setTimeout(forwardFirewall, 24000)
  setTimeout(splitFireWarning, 30000)
  setTimeout(splitFire, 31000)
}

function spawnTree () {
  treeLoc = Math.random() * -800
  socket.emit('tree', treeLoc)
  setTimeout(function(){ tree2(treeLoc); }, 4000)
}

function tree2 (treeLoc) {
  socket.emit('tree2', treeLoc)
  setTimeout(function(){ tree3(); }, 1000)
}

function tree3 () {
  socket.emit('tree3')
}

function forwardFirewall () {
  socket.emit('forwardFirewall')
  setTimeout(forwardFirewall2, 1000)
  setTimeout(forwardFirewall3, 3000)
}

function forwardFirewall2 () {
  socket.emit('forwardFirewall2')
}

function forwardFirewall3 () {
  socket.emit('forwardFirewall3')
}
/*
function splitFireOffset () {
  setTimeout(splitFireOffset2, 2000)
  setInterval(splitFireWarning, 16000)
}

function splitFireOffset2 () {
  setInterval(splitFire, 16000)
}*/

function splitFire () {
  socket.emit('splitFire')
}

function splitFireWarning () {
  socket.emit('splitFireWarning')
}

function hitBoss () {
  armor = armor - 1 / armor
  socket.emit('updateArmor', armor)
}

function waterWallOn (waterWallx, waterWally) {
  socket.emit('waterWallOn2', waterWallx, waterWally)
}

function waterWallOff () {
  socket.emit('waterWallOff2')
}

function fountainOn (fountaindata) {
  socket.emit('fountainOn', fountaindata)
  setTimeout(fountainOff, 3000)
}

function fountainOff () {
  socket.emit('fountainOff')
}

function spearOn (speardata) {
  socket.emit('spearOn', speardata)
  setTimeout(spearOff, 2000)
}

function spearOff () {
  socket.emit('spearOff')
}

function onClientDisconnect () {
  util.log('Player has disconnected: ' + this.id)
  var removePlayer = playerById(this.id)
  if (!removePlayer) {
    util.log('Player not found: ' + this.id)
    return
  }
  players.splice(players.indexOf(removePlayer), 1)
  this.broadcast.emit('remove player', {id: this.id})
}

function onNewPlayer (data) {
  var newPlayer = new Player(data.x, data.y, data.angle)
  newPlayer.id = this.id

  this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), angle: newPlayer.getAngle()})

  var i, existingPlayer
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i]
    this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), angle: existingPlayer.getAngle()})
  }
  players.push(newPlayer)
}

function waterfire (data) {
  socket.emit('otherWaterfire', {x: data.x, y: data.y})
}

function onMovePlayer (data) {
  var movePlayer = playerById(this.id)

  if (!movePlayer) {
    util.log('Player not found: ' + this.id)
    return
  }

  movePlayer.setX(data.x)
  movePlayer.setY(data.y)
  movePlayer.setAngle(data.angle)

  this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), angle: movePlayer.getAngle()})
}

function playerById (id) {
  var i
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i]
    }
  }

  return false
}
