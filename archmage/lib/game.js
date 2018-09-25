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

var armor = 1
var rip3Check = false

var retrynum = 0

var timeoutmanager={
    timeouts : [],//global timeout id arrays
    setTimeout : function(code,number){
        this.timeouts.push(setTimeout(code,number));
    },
    clearAllTimeout :function(){
        for (var i=0; i<this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]); // clear all the timeouts
        }
        this.timeouts= [];//empty the id array
    }
};
var intervalmanager={
    intervals : [],//global timeout id arrays
    setInterval : function(code,number){
        this.intervals.push(setInterval(code,number));
    },
    clearAllInterval :function(){
        for (var i=0; i<this.intervals.length; i++) {
            clearInterval(this.intervals[i]); // clear all the timeouts
        }
        this.intervals= [];//empty the id array
    }
};

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
  if (playernum > 2.1) {
    playernum = 2
  } else {
    client.emit('playnum', playernum)
  }
  client.on('disconnect', onClientDisconnect)
  client.on('new player', onNewPlayer)
  client.on('move player', onMovePlayer)
  if (playernum === 2) {
    socket.emit('spawn boss')
    timeoutmanager.setTimeout(Phase1MainLoop, 20000)
  }
  client.on('waterfire', waterfire)
  client.on('hitBoss', hitBoss)
  client.on('waterWallOn', waterWallOn)
  client.on('waterWallOff', waterWallOff)
  client.on('spearOn', spearOn)
  client.on('fountainOn', fountainOn)
  client.on('rip3', rip3)
  client.on('gameOver', gameOver)
  client.on('retry', retry)
  client.on('new game', newGame)
}

function newGame () {
  console.log('new Game')
  socket.emit('spawn boss')
  timeoutmanager.setTimeout(Phase1MainLoop, 20000)
}

function gameOver () {
  timeoutmanager.clearAllTimeout()
  intervalmanager.clearAllInterval()
  socket.emit('ripGame')
}

function Phase1MainLoop () {
  for (var i = 0; i < 9; i++) {
    timeoutmanager.setTimeout(spawnTree, i*7000 + 2000)

  }
  for (var i = 1; i < 9; i++) {
    timeoutmanager.setTimeout(forwardFirewall, i*8000)
    timeoutmanager.setTimeout(timebomb, i*8000 - 4000)
  }
  for (var i = 0; i < 9; i++) {
    timeoutmanager.setTimeout(laser, i*7000 - 1500)
  }
  timeoutmanager.setTimeout(splitFireWarning, 70000)
  timeoutmanager.setTimeout(splitFire, 73000)
}

function spawnTree () {
  var treeLoc = Math.random() * -800
  socket.emit('tree', treeLoc)
  timeoutmanager.setTimeout(function(){ tree2(treeLoc); }, 4000)
}

function tree2 (treeLoc) {
  socket.emit('tree2', treeLoc)
  timeoutmanager.setTimeout(function(){ tree3(); }, 1500)
}

function tree3 () {
  socket.emit('tree3')
}

function timebomb () {
  socket.emit('timebomb')
  timeoutmanager.setTimeout(timebomb2, 2000)
}

function timebomb2 () {
  socket.emit('timebomb2')
}

function forwardFirewall () {
  socket.emit('forwardFirewall')
  timeoutmanager.setTimeout(forwardFirewall2, 1000)
  timeoutmanager.setTimeout(forwardFirewall3, 3000)
}

function forwardFirewall2 () {
  socket.emit('forwardFirewall2')
}

function forwardFirewall3 () {
  socket.emit('forwardFirewall3')
}

function laser () {
  socket.emit('laser0')
  timeoutmanager.setTimeout(laser1, 1000)
  //timeoutmanager.setTimeout(laser2, 400)
  timeoutmanager.setTimeout(laser3, 3000)
}

function laser1 () {
  var randplayer = Math.ceil(Math.random() * 2)
  socket.emit('laser', randplayer)
}

function laser2 () {
  //socket.emit('laser2')
}

function laser3 () {
  socket.emit('laser3')
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
  armor = armor * 1.01
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
  timeoutmanager.setTimeout(fountainOff, 2000)
  timeoutmanager.setTimeout(fountainOff2, 7000)
}

function fountainOff () {
  socket.emit('fountainOff')
}

function fountainOff2 () {
  socket.emit('fountainOff2')
}

function spearOn (speardata) {
  socket.emit('spearOn', speardata)
  timeoutmanager.setTimeout(spearOff, 2000)
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

function rip3 () {
  if (rip3Check === false) {
    var randomg = Math.random() * 400 - 600
    socket.emit('rip3', randomg)
    rip3Check = true
  }
}

function retry () {
  armor = 1
  rip3Check = false
  retrynum += 1
  if (retrynum > 1.5) {
    retrynum = 0
    socket.emit('retryready')
  }
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
