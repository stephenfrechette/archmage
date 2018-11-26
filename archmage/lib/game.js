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

var clients = []
var rooms = []
for (var i = 1; i < 17; i++) {
  rooms[i] = []
}

var timeoutmanagers = []
var intervalmanagers = []

for (var i=1; i < 17; i++) {
  timeoutmanagers[i] = {
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
}
for (var i=1; i < 17; i++) {
  intervalmanagers[i] = {
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
}

//setInterval(roomclear, 60000)

function roomclear () {
  console.log('Room Clear')
  for (var i=1; i < 17; i++) {
    if (clients[rooms[i][1]] === undefined) {
      rooms[i] = []
      console.log('Room ' + i + ' Reset')
    }
  }
}

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
  client.on('disconnect', onClientDisconnect)
  client.on('new player', onNewPlayer)
  client.on('move player', onMovePlayer)
  clients[client.id] = client
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
  client.on('roomSelect', roomSelect)
}

function roomSelect (data) {
  if (rooms[data.roomnumber][data.playernum] === undefined) {
    rooms[data.roomnumber][data.playernum] = this.id
    clients[this.id].room = data.roomnumber
    if (rooms[data.roomnumber][1] !== undefined && rooms[data.roomnumber][2] !== undefined) {
      clients[rooms[data.roomnumber][1]].emit('spawnboss')
      clients[rooms[data.roomnumber][2]].emit('spawnboss')
      timeoutmanagers[data.roomnumber].setTimeout(function(){ Phase1MainLoop(data.roomnumber); }, 20000)
    }
    clients[this.id].emit('joinedroom')
  } else {
    clients[this.id].emit('roomfull')
  }
}

function newGame () {
  console.log('new Game')
  roomnumber = clients[this.id].room
  clients[rooms[clients[this.id].room][1]].emit('spawnboss')
  clients[rooms[clients[this.id].room][2]].emit('spawnboss')
  timeoutmanagers[roomnumber].setTimeout(function(){ Phase1MainLoop(roomnumber); }, 20000)
}

function gameOver () {
  roomnumber = clients[this.id].room
  timeoutmanagers[roomnumber].clearAllTimeout()
  intervalmanagers[roomnumber].clearAllInterval()
  clients[rooms[clients[this.id].room][1]].emit('ripGame')
  clients[rooms[clients[this.id].room][2]].emit('ripGame')
}

function Phase1MainLoop (roomnumber) {
  for (var i = 0; i < 34; i++) {
    timeoutmanagers[roomnumber].setTimeout(function(){ spawnTree(roomnumber); }, i*4000 - 1000)

  }
  for (var i = 0; i < 70; i++) {
    timeoutmanagers[roomnumber].setTimeout(function(){ bossTP(roomnumber); }, i*2000 - 400)
  }
  for (var i = 1; i < 18; i++) {
    timeoutmanagers[roomnumber].setTimeout(function(){ forwardFirewall(roomnumber); }, i*8000)
    timeoutmanagers[roomnumber].setTimeout(function(){ timebomb(roomnumber); }, i*8000 - 4000)
  }
  for (var i = 0; i < 35; i++) {
    timeoutmanagers[roomnumber].setTimeout(function(){ laser(roomnumber); }, i*4000 + 2000)
  }
  timeoutmanagers[roomnumber].setTimeout(function(){ splitFireWarning(roomnumber); }, 140000)
  timeoutmanagers[roomnumber].setTimeout(function(){ splitFire(roomnumber); }, 143000)
}

function spawnTree (roomnumber) {
  var treeLoc = Math.random() * -800
  clients[rooms[roomnumber][1]].emit('tree', treeLoc)
  clients[rooms[roomnumber][2]].emit('tree', treeLoc)
  timeoutmanagers[roomnumber].setTimeout(function(){ tree2(roomnumber, treeLoc); }, 2000)
}

function bossTP (roomnumber) {
  var bossangle = Math.random() * 2 * Math.PI
  clients[rooms[roomnumber][1]].emit('bossTP', bossangle)
  clients[rooms[roomnumber][2]].emit('bossTP', bossangle)
}

function tree2 (roomnumber, treeLoc) {
  clients[rooms[roomnumber][1]].emit('tree2', treeLoc)
  clients[rooms[roomnumber][2]].emit('tree2', treeLoc)
  timeoutmanagers[roomnumber].setTimeout(function(){ tree3(roomnumber); }, 1500)
}

function tree3 (roomnumber) {
  clients[rooms[roomnumber][1]].emit('tree3')
  clients[rooms[roomnumber][2]].emit('tree3')
}

function timebomb (roomnumber) {
  clients[rooms[roomnumber][1]].emit('timebomb')
  clients[rooms[roomnumber][2]].emit('timebomb')
  timeoutmanagers[roomnumber].setTimeout(function(){ timebomb2(roomnumber); }, 1300)
}

function timebomb2 (roomnumber) {
  clients[rooms[roomnumber][1]].emit('timebomb2')
  clients[rooms[roomnumber][2]].emit('timebomb2')
}

function forwardFirewall (roomnumber) {
  clients[rooms[roomnumber][1]].emit('forwardFirewall')
  clients[rooms[roomnumber][2]].emit('forwardFirewall')
  timeoutmanagers[roomnumber].setTimeout(function(){ forwardFirewall2(roomnumber); }, 1000)
  timeoutmanagers[roomnumber].setTimeout(function(){ forwardFirewall3(roomnumber); }, 3000)
}

function forwardFirewall2 (roomnumber) {
  clients[rooms[roomnumber][1]].emit('forwardFirewall2')
  clients[rooms[roomnumber][2]].emit('forwardFirewall2')
}

function forwardFirewall3 (roomnumber) {
  clients[rooms[roomnumber][1]].emit('forwardFirewall3')
  clients[rooms[roomnumber][2]].emit('forwardFirewall3')
}

function laser (roomnumber) {
  clients[rooms[roomnumber][1]].emit('laser0')
  clients[rooms[roomnumber][2]].emit('laser0')
  timeoutmanagers[roomnumber].setTimeout(function(){ laser1(roomnumber); }, 0)
  //timeoutmanagers[roomnumber].setTimeout(laser2, 400)
  timeoutmanagers[roomnumber].setTimeout(function(){ laser3(roomnumber); }, 1000)
}

function laser1 (roomnumber) {
  var randplayer = Math.ceil(Math.random() * 2)
  clients[rooms[roomnumber][1]].emit('laser', randplayer)
  clients[rooms[roomnumber][2]].emit('laser', randplayer)
}

function laser2 () {
  //socket.emit('laser2')
}

function laser3 (roomnumber) {
  clients[rooms[roomnumber][1]].emit('laser3')
  clients[rooms[roomnumber][2]].emit('laser3')
}

/*
function splitFireOffset () {
  setTimeout(splitFireOffset2, 2000)
  setInterval(splitFireWarning, 16000)
}

function splitFireOffset2 () {
  setInterval(splitFire, 16000)
}*/

function splitFire (roomnumber) {
  clients[rooms[roomnumber][1]].emit('splitFire')
  clients[rooms[roomnumber][2]].emit('splitFire')
}

function splitFireWarning (roomnumber) {
  clients[rooms[roomnumber][1]].emit('splitFireWarning')
  clients[rooms[roomnumber][2]].emit('splitFireWarning')
}

function hitBoss () {
  armor = armor * 1.01
  clients[rooms[clients[this.id].room][1]].emit('updateArmor', armor)
  clients[rooms[clients[this.id].room][2]].emit('updateArmor', armor)
}

function waterWallOn (waterWallx, waterWally) {
  clients[rooms[clients[this.id].room][1]].emit('waterWallOn2', waterWallx, waterWally)
  clients[rooms[clients[this.id].room][2]].emit('waterWallOn2', waterWallx, waterWally)
}

function waterWallOff () {
  clients[rooms[clients[this.id].room][1]].emit('waterWallOff2')
  clients[rooms[clients[this.id].room][2]].emit('waterWallOff2')
}

function fountainOn (fountaindata) {
  roomnumber = clients[this.id].room
  clients[rooms[clients[this.id].room][1]].emit('fountainOn', fountaindata)
  clients[rooms[clients[this.id].room][2]].emit('fountainOn', fountaindata)
  timeoutmanagers[roomnumber].setTimeout(function(){ fountainOff(roomnumber); }, 2000)
  timeoutmanagers[roomnumber].setTimeout(function(){ fountainOff2(roomnumber); }, 7000)
}

function fountainOff (roomnumber) {
  clients[rooms[roomnumber][1]].emit('fountainOff')
  clients[rooms[roomnumber][2]].emit('fountainOff')
}

function fountainOff2 (roomnumber) {
  clients[rooms[roomnumber][1]].emit('fountainOff2')
  clients[rooms[roomnumber][2]].emit('fountainOff2')
}

function spearOn (speardata) {
  roomnumber = clients[this.id].room
  clients[rooms[clients[this.id].room][1]].emit('spearOn', speardata)
  clients[rooms[clients[this.id].room][2]].emit('spearOn', speardata)
  timeoutmanagers[roomnumber].setTimeout(function(){ spearOff(roomnumber); }, 2000)
}

function spearOff (roomnumber) {
  clients[rooms[roomnumber][1]].emit('spearOff')
  clients[rooms[roomnumber][2]].emit('spearOff')
}

function onClientDisconnect () {
  util.log('Player has disconnected: ' + this.id)
  var removePlayer = playerById(this.id)
  if (!removePlayer) {
    util.log('Player not found: ' + this.id)
    return
  }
  roomnumber = clients[this.id].room
  timeoutmanagers[roomnumber].clearAllTimeout()
  intervalmanagers[roomnumber].clearAllInterval()
  rooms[roomnumber] = []
  console.log('Room ' + roomnumber + ' Reset')
  clients[this.id] = undefined
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
  clients[rooms[clients[this.id].room][1]].emit('otherWaterfire', {x: data.x, y: data.y})
  clients[rooms[clients[this.id].room][2]].emit('otherWaterfire', {x: data.x, y: data.y})
}

function rip3 () {
  if (rip3Check === false) {
    var randomg = Math.random() * 400 - 600
    clients[rooms[clients[this.id].room][1]].emit('rip3', randomg)
    clients[rooms[clients[this.id].room][2]].emit('rip3', randomg)
    rip3Check = true
  }
}

function retry () {
  armor = 1
  rip3Check = false
  retrynum += 1
  if (retrynum > 1.5) {
    retrynum = 0
    clients[rooms[clients[this.id].room][1]].emit('retryready')
    clients[rooms[clients[this.id].room][2]].emit('retryready')
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
