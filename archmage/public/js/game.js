var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })

function preload () {
  game.stage.disableVisibilityChange = true;
  game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
  game.load.image('earth', 'assets/light_sand.png')
  game.load.spritesheet('dude', 'assets/dude.png', 64, 64)
  game.load.spritesheet('enemy', 'assets/meeple.png', 64, 64)
  game.load.spritesheet('!', 'assets/!.png')
  game.load.spritesheet('bowser', 'assets/Bowser.png')
  game.load.spritesheet('tree', 'assets/tree.png')
  game.load.spritesheet('waterball', 'assets/waterball.png')
  game.load.spritesheet('armorbar', 'assets/pink.jpg')
  game.load.spritesheet('radial', 'assets/radial.png')
  game.load.spritesheet('fire', 'assets/fire.png')
  game.load.spritesheet('wotorball', 'assets/waterball_big.png')
  game.load.spritesheet('fireskull', 'assets/fireskull.png')
  game.load.spritesheet('greenarea', 'assets/greenarea.png')
}

var socket // Socket connection

var land

var player
var enemies

var radial
var radialOn = false
var radialx
var radialy
var radialAngle
var weaponE

var health = 3
var invulnerable = false

var currentSpeed = 0
var cursors

var playernum = 0

var inPlay = true
var gameStart = false

var repeatCheck = false

var treeWarning
var tree
var isTree = false
var forwardFire = []
var forwardFirewallCheck = false
var splitFire = []
var fireskull = []
var waterWall = []
var waterWallCheck1 = false
var waterWallCheck2 = false
var greenareaCheck = false
var greenarea
var fountainCheck = false

var armor = 64


function create () {
  socket = io.connect()
  game.world.setBounds(-800, -800, 600, 600)
  land = game.add.tileSprite(0, 0, 800, 600, 'earth')
  land.fixedToCamera = true
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  var startX = Math.round(Math.random() * (1000) - 500)
  var startY = Math.round(Math.random() * (1000) - 500)
  player = game.add.sprite(startX, startY, 'dude')
  player.scale.setTo(.75, .75);
  player.anchor.setTo(0.5, 0.5)
  player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
  player.animations.add('stop', [3], 20, true)
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.maxVelocity.setTo(400, 400)
  player.body.collideWorldBounds = true
  enemies = []

  player.bringToTop()

  game.camera.follow(player)
  game.camera.deadzone = new Phaser.Rectangle(300, 300, 500, 300)
  game.camera.focusOnXY(0, 0)

  cursors = game.input.keyboard.createCursorKeys()
  setEventHandlers()

  waterfire = game.add.weapon(50, 'waterball');
  waterfire.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  waterfire.bulletSpeed = 800;
  waterfire.fireRate = 100;
  waterfire.trackSprite(player, 0, 0, true)
}

var setEventHandlers = function () {
  socket.on('connect', onSocketConnected)
  socket.on('disconnect', onSocketDisconnect)
  socket.on('new player', onNewPlayer)
  socket.on('move player', onMovePlayer)
  socket.on('remove player', onRemovePlayer)
  socket.on('otherWaterfire', otherWaterfire)
  socket.on('spawn boss', bossSpawn1)
  socket.on('tree2', tree2)
  socket.on('tree3', tree3)
  socket.on('updateArmor', updateArmor)
  socket.on('forwardFirewall', forwardFirewall)
  socket.on('forwardFirewall2', forwardFirewall2)
  socket.on('forwardFirewall3', forwardFirewall3)
  socket.on('waterWallOn2', waterWallOn2)
  socket.on('waterWallOff2', waterWallOff2)
  socket.on('splitFire', splitFire1)
  socket.on('splitFireWarning', splitFireWarning)
}

function otherWaterfire (data) {
  if (playernum === 2) {
    waterfire.fire(enemies[0].player, data.x, data.y);
  }
}

function ripHealth () {
  if (invulnerable === false) {
    health -= 1;
    console.log(health)
    invulnerable = true
    setTimeout(vulnerable, 1500)
  }
}

function vulnerable () {
  invulnerable = false
}

function print1() {
  console.log('1')
}

function print2() {
  console.log('2')
}

function print3() {
  console.log('3')
}

function bossSpawn1() {
  inPlay = false
  print3()
  setTimeout(print2, 1000)
  setTimeout(print1, 2000)
  setTimeout(bossSpawn2, 3000)
  socket.on('tree', tree)
}

function bossSpawn2() {
  console.log('TIME TO DIE')
  player.y = -500
  if (playernum === 1) {
    player.x = -500
  }
  if (playernum === 2) {
    player.x = -300
    player.loadTexture('enemy', 0)
  }
  bowser = game.add.sprite(-400, -800, 'bowser')
  bowser.scale.setTo(.1, .1)
  game.physics.enable(bowser, Phaser.Physics.ARCADE);
  armorbar = game.add.sprite(-400, -800, 'armorbar')
  armorbar.scale.setTo(.1, .01)
  gameStart = true
}

function tree(treeLoc) {
  if (playernum === 1) {
    console.log('WATCH OUT FOR THAT TREE');
    treeWarning = game.add.sprite(treeLoc, -300, 'bowser');
    treeWarning.anchor.setTo(.5)
    treeWarning.scale.setTo(.05);
  }
  inPlay = true;
}

function tree2(treeLoc) {
  console.log(treeLoc)
  if (playernum === 1) {
    treeWarning.destroy()
  }
  tree = game.add.sprite(treeLoc, -300, 'tree')
  tree.anchor.setTo(.5)
  tree.scale.setTo(.2)
  game.physics.enable(tree, Phaser.Physics.ARCADE);
  isTree = true
}

function tree3() {
  isTree = false
  tree.destroy()
}

function forwardFirewall () {
  for (var i = 0; i < 20; i++) {
    forwardFire[i] = game.add.sprite(i*40 - 800, -800, 'fire')
    forwardFire[i].scale.setTo(.1)
    game.physics.enable(forwardFire[i], Phaser.Physics.ARCADE);
  }
}

function forwardFirewall2 () {
  forwardFirewallCheck = true
}

function forwardFirewall3 () {
  for (var i = 0; i < 20; i++) {
    forwardFire[i].destroy()
  }
  forwardFirewallCheck = false
}

function splitFireWarning () {
  bowser.y = -700
}

function splitFire1 () {
  bowser.y = -800
  for (var i = 0; i < 15; i++) {
    splitFire[i] = game.add.sprite(-400, i*40 - 800, 'fire')
    splitFire[i].scale.setTo(.1)
    game.physics.enable(splitFire[i], Phaser.Physics.ARCADE);
    splitFireCheck = true
  }
  for (var i = 0; i < 2; i++) {
    fireskull[i] = game.add.sprite(-400*i - 200, -500, 'fireskull')
    fireskull[i].scale.setTo(.2)
    fireskull[i].anchor.setTo(.5)
    game.physics.enable(splitFire[i], Phaser.Physics.ARCADE);
  }
}

function waterWallOn2 (waterWallPosx, waterWallPosy) {
  if (playernum === 2) {
    for (var i = 0; i < 3; i++) {
      waterWall[i] = game.add.sprite(waterWallPosx[i], waterWallPosy[i], 'wotorball')
      waterWall[i].scale.setTo(.15)
      waterWall[i].anchor.setTo(.5, .5)
      game.physics.enable(waterWall[i], Phaser.Physics.ARCADE);
    }
    waterWallCheck1 = true
  }
}

function waterWallOff2 () {
  if (playernum === 2) {
    for (var i = 0; i < 3; i++) {
      waterWall[i].destroy()
    }
    waterWallCheck1 = false
  }
}

function fountainCool () {
  console.log('fountainCool')
  fountain.destroy()
  fountainCheck = false
}

function onSocketConnected () {
  console.log('Connected to socket server')
  socket.on('playnum', playnum)
  enemies.forEach(function (enemy) {
    enemy.player.kill()
  })
  enemies = []
  socket.emit('new player', { x: player.x, y: player.y, angle: player.angle })
}

function playnum (data) {
  playernum = data
}

function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}

function onNewPlayer (data) {
  console.log('New player connected:', data.id)
  var duplicate = playerById(data.id)
  if (duplicate) {
    console.log('Duplicate player!')
    return
  }
  enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y, data.angle, playernum))
}

function onMovePlayer (data) {
  var movePlayer = playerById(data.id)

  if (!movePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  movePlayer.player.x = data.x
  movePlayer.player.y = data.y
  movePlayer.player.angle = data.angle
}

function onRemovePlayer (data) {
  var removePlayer = playerById(data.id)

  if (!removePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  removePlayer.player.kill()

  enemies.splice(enemies.indexOf(removePlayer), 1)
}

function hitBoss (boss, bullet) {
  if (playernum === 1) {
    socket.emit('hitBoss')
  }
  bullet.kill()
}

function updateArmor (newArmor) {
  armor = newArmor
  armorbar.scale.setTo(.1 * armor / 16, .01)
  console.log(armor)
}

function waterWallCool () {
  waterWallCheck1 = false
}

function fireWallDestroy (i) {
  forwardFire[i].destroy()
}

function update () {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemies[i].update()
      game.physics.arcade.collide(player, enemies[i].player)
    };
  };

  if (invulnerable === false) {
    game.physics.arcade.overlap(tree, player, ripHealth, null, this);
    for (var i = 0; i < 20; i++) {
      game.physics.arcade.overlap(forwardFire[i], player, ripHealth, null, this);
    }
    for (var i = 0; i < 15; i++) {
      game.physics.arcade.overlap(splitFire[i], player, ripHealth, null, this);
    }
  }

  if (gameStart === true) {
    game.physics.arcade.overlap(waterfire.bullets, bowser, hitBoss, null, this);
    if (waterWallCheck1 === true) {
      for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 3; j++) {
          game.physics.arcade.overlap(waterWall[j], forwardFire[i], function(){ fireWallDestroy(i); }, null, this);
        }
      }
    }
  }

  if (isTree === true) {
    tree.y -= 30
  }

  if (forwardFirewallCheck === true) {
    for (var i = 0; i < 20; i++) {
      forwardFire[i].y += 10
    }
  }

  if (inPlay === true) {
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        if (playernum === 1) {
          player.angle = 90;
          player.x -= 3;
        } else {
          player.angle = -90;
          player.x -= 4;
        };
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      if (playernum === 1) {
        player.angle = 90;
        player.x += 3;
      } else {
        player.angle = -90;
        player.x += 4;
      };
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      if (playernum === 1) {
        player.angle = 90;
        player.y -= 3;
      } else {
        player.angle = -90;
        player.y -= 4;
      };
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      if (playernum === 1) {
        player.angle = 90;
        player.y += 3;
      } else {
        player.angle = -90;
        player.y += 4;
      };
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
      if (playernum === 1 && fountainCheck === false) {
        if (greenareaCheck === false) {
          greenarea = game.add.sprite(game.input.activePointer.worldX, game.input.activePointer.worldY, 'greenarea')
          greenarea.scale.setTo(.1)
          greenarea.alpha = .2
          greenarea.anchor.setTo(.5)
          greenareaCheck = true
        } else {
          greenarea.x = game.input.activePointer.worldX
          greenarea.y = game.input.activePointer.worldY
        }
      }
    } else if (greenareaCheck === true) {
      fountain = game.add.sprite(greenarea.x, greenarea.y, 'wotorball')
      fountain.anchor.setTo(.5)
      fountain.scale.setTo(.4)
      game.physics.enable(fountain, Phaser.Physics.ARCADE);
      greenarea.destroy()
      fountainCheck = true
      greenareaCheck = false
      setTimeout(fountainCool, 3000)
    }

    if (game.input.activePointer.leftButton.isDown) {
      if (playernum === 1) {
        console.log('FORE')
        waterfire.fire(player, game.input.activePointer.worldX, game.input.activePointer.worldY);
        socket.emit('waterfire', {x: game.input.activePointer.worldX, y: game.input.activePointer.worldY})
      }
    }

    if (game.input.activePointer.rightButton.isDown && radialOn === false && playernum === 2) {
      radial = game.add.sprite(game.input.activePointer.worldX, game.input.activePointer.worldY, 'radial')
      radial.scale.setTo(.1)
      radial.anchor.setTo(.5, .5)
      radialOn = true
      console.log('RADICAL RADIAL')
      radialx = game.input.activePointer.worldX
      radialy = game.input.activePointer.worldY
    } else if (radialOn === true && game.input.activePointer.rightButton.isDown !== true){
      radialAngle = Math.atan2(game.input.activePointer.worldY - radialy, game.input.activePointer.worldX - radialx) * 180 / Math.PI;
      if (radialAngle < -22.5 && radialAngle > -67.5) {
        weaponE = 'waterWall'
      }
      radial.destroy()
      radialOn = false
    }

    if (game.input.activePointer.rightButton.isDown && waterWallCheck1 === false && playernum === 1) {
      waterWallCheck1 = true
      waterWallCheck2 = true
      var waterWallx = []
      var waterWally = []
      for (var i = 0; i < 3; i++) {
        waterWall[i] = game.add.sprite(player.x + 40*i - 40, player.y - 40, 'wotorball')
        waterWall[i].scale.setTo(.15)
        waterWall[i].anchor.setTo(.5, .5)
        waterWallx[i] = waterWall[i].x
        waterWally[i] = waterWall[i].y
        game.physics.enable(waterWall[i], Phaser.Physics.ARCADE);
      }
      socket.emit('waterWallOn', waterWallx, waterWally)
    } else if (waterWallCheck2 === true && (game.input.activePointer.rightButton.isDown !== true || waterWall[1].x !== player.x || waterWall[1].y !== player.y - 40)) {
      waterWallCheck2 = false
      waterWall[0].destroy()
      waterWall[1].destroy()
      waterWall[2].destroy()
      socket.emit('waterWallOff')
      setTimeout(waterWallCool, 5000)
    }
  }


  if (cursors.left.isDown) {
    player.angle -= 0
  } else if (cursors.right.isDown) {
    player.angle += 0
  }

  if (cursors.up.isDown) {
    currentSpeed = 0
  } else {
    if (currentSpeed > 0) {
      currentSpeed -= 4
  }

  }

  game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity)

  if (currentSpeed > 0) {
    player.animations.play('move')
  } else {
    player.animations.play('stop')
  }

  land.tilePosition.x = -game.camera.x
  land.tilePosition.y = -game.camera.y

  socket.emit('move player', { x: player.x, y: player.y, angle: player.angle })
}

function render () {

}

function playerById (id) {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].player.name === id) {
      return enemies[i]
    }
  }

  return false
}
