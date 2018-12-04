game = new Phaser.Game(800, 600, Phaser.AUTO, '')

var Title = {
  preload: preload,
  create: createTitle,
  update: updateTitle,
  render: render,
};
var game1 = {
  preload: preload,
  create: create,
  update: update,
  render: render,
};
var Over = {
  preload: preload,
  create: create0,
  update: update0,
  render: render,
};
var Tutorial = {
  preload: preload,
  create: createTutorial,
  update: updateTutorial,
  render: render,
};
game.state.add('Title', Title, false)
game.state.add('Tutorial', Tutorial, false)
game.state.add('game1', game1, false)
game.state.add('Over', Over, false)
game.state.start('Title')

var deltaTime
var deltaTime2
var elapsedMS
var fps
var gameStart

var socket // Socket connection

var land

var playernum = 0

var player
var enemies = []
var playerstuff

var cursors

var otherPlayer = []

var gmovr

var retryCheck = false

var setEventHandlers = function () {
  socket.on('connect', onSocketConnected)
  socket.on('disconnect', onSocketDisconnect)
  socket.on('joinedroom', joinedroom)
  socket.on('new player', onNewPlayer)
  socket.on('move player', onMovePlayer)
  socket.on('remove player', onRemovePlayer)
  socket.on('otherWaterfire', otherWaterfire)
  socket.on('spawnboss', bossSpawn1)
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
  socket.on('spearOn', spearOn)
  socket.on('spearOff', spearRemove)
  socket.on('fountainOn', fountainOn)
  socket.on('fountainOff', fountainCool)
  socket.on('fountainOff2', fountainCool2)
  socket.on('rip3', ripFireskull4)
  socket.on('ripGame', gameOver)
  socket.on('laser0', laser0)
  socket.on('laser', laser1)
  socket.on('laser2', laserfunc2)
  socket.on('laser3', laser3)
  socket.on('timebomb', timebomb1)
  socket.on('timebomb2', timebomb2)
  socket.on('retryready', retryready)
  socket.on('bossTP', bossTP)
}

var socket = io.connect()
setEventHandlers()

function preload () {
  game.stage.disableVisibilityChange = true;
  game.time.advancedTiming = true;
  game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
  game.load.image('earth', 'assets/light_sand.png')
  game.load.spritesheet('gameOver', 'assets/gameover.jpg')
  game.load.spritesheet('dude', 'assets/dude.png', 32, 32)
  game.load.spritesheet('enemy', 'assets/meeple.png', 32, 32)
  game.load.spritesheet('q', 'assets/q.png')
  game.load.spritesheet('e', 'assets/e.png')
  game.load.spritesheet('z', 'assets/z.png')
  game.load.spritesheet('c', 'assets/c.png')
  game.load.spritesheet('!', 'assets/!.png')
  game.load.spritesheet('bowser', 'assets/Bowser.png')
  game.load.spritesheet('tree', 'assets/tree.png')
  game.load.spritesheet('waterball', 'assets/waterball.png')
  game.load.spritesheet('armorbar', 'assets/pink.jpg')
  game.load.spritesheet('radial', 'assets/radial.png')
  game.load.spritesheet('fire', 'assets/fire.png')
  game.load.spritesheet('fireball', 'assets/fireball.png')
  game.load.spritesheet('wotorball', 'assets/waterball_big.png')
  game.load.spritesheet('fireskull', 'assets/fireskull.png', 40, 40)
  game.load.spritesheet('greenarea', 'assets/greenarea.png')
  game.load.spritesheet('swipe', 'assets/pink.jpg', 32, 32)
  game.load.spritesheet('bluesquare', 'assets/blue.png', 32, 32)
  game.load.spritesheet('cyansquare', 'assets/cyan.jpg', 32, 32)
  game.load.spritesheet('singleskullbar', 'assets/yellow.jpg', 40, 8)
  game.load.spritesheet('permaspear', 'assets/yellow.jpg', 20, 20)
  game.load.spritesheet('materialspear', 'assets/orange.jpg', 20, 20)
  game.load.spritesheet('yellowdamagebar', 'assets/yellow.jpg', 10, 10)
  game.load.spritesheet('greendamagebar', 'assets/green.png', 30, 90)
  game.load.spritesheet('treeconfirm', 'assets/green.png', 16, 16)
  game.load.spritesheet('pinkdamagebar', 'assets/pink.jpg', 15, 100)
  game.load.spritesheet('laserWarning', 'assets/red.jpg', 3, 1600)
  game.load.spritesheet('reallaser', 'assets/orange.jpg', 25, 1600)
  game.load.spritesheet('redTell', 'assets/red.jpg', 770, 770)
  game.load.spritesheet('redTell2', 'assets/red.jpg', 50, 50)
  game.load.spritesheet('redsquare', 'assets/red.jpg', 32, 32)
  game.load.spritesheet('heart', 'assets/heart.png')
  game.load.spritesheet('log', 'assets/log.png')
  game.load.spritesheet('woodspear', 'assets/woodspear.png')
  game.load.spritesheet('whitecircle', 'assets/whitecircle.png')
  game.load.spritesheet('halfcircle', 'assets/whitecircle.png', 300, 150)

  game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');

  game.load.audio('oof', ['assets/roblox-death-sound_1.mp3', 'roblox-death-sound_1.ogg'])
  //game.load.audio('boss1a', ['assets/boss1a.mp3', 'assets/boss1a.ogg'])
  //game.load.audio('boss1b', ['assets/boss1b.mp3', 'assets/boss1b.ogg'])

  game.load.spritesheet('apple', 'assets/rooms/apple.png')
  game.load.spritesheet('blood', 'assets/rooms/blood.png')
  game.load.spritesheet('chemistry', 'assets/rooms/chemistry.png')
  game.load.spritesheet('cube', 'assets/rooms/cube.png')
  game.load.spritesheet('eyes', 'assets/rooms/eyes.png')
  game.load.spritesheet('fireroom', 'assets/rooms/fire.png')
  game.load.spritesheet('hourglass', 'assets/rooms/hourglass.png')
  game.load.spritesheet('justice', 'assets/rooms/justice.png')
  game.load.spritesheet('magic', 'assets/rooms/magic.png')
  game.load.spritesheet('muscle', 'assets/rooms/muscle.png')
  game.load.spritesheet('rock', 'assets/rooms/rock.png')
  game.load.spritesheet('stars', 'assets/rooms/stars.png')
  game.load.spritesheet('sun', 'assets/rooms/sun.png')
  game.load.spritesheet('thinking', 'assets/rooms/thinking.png')
  game.load.spritesheet('tornado', 'assets/rooms/Tornado.png')
  game.load.spritesheet('waterdrop', 'assets/rooms/water.png')
}

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

function createTitle () {
  game.world.setBounds(-800, -800, 600, 600)
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  window.tutorialStartTxt
  window.tutorialYesTxt
  window.tutorialNoTxt
  window.tutorialSelectCheck = false
  window.characterTxt
  window.character1
  window.character2
  window.charselectCheck = false
  window.roomnumber = 0
  window.tutorial = false

  tutorialStartTxt = game.add.bitmapText(-600, -700, 'carrier_command','Tutorial?', 34);
  tutorialYesTxt = game.add.bitmapText(-600, -400, 'carrier_command','Yes', 34);
  tutorialNoTxt = game.add.bitmapText(-300, -400, 'carrier_command','No', 34);
}

function updateTitle () {
  if (game.input.activePointer.leftButton.isDown && tutorialSelectCheck === false) {
    if (Math.abs(game.input.activePointer.worldX + 550) < 50 && Math.abs(game.input.activePointer.worldY + 350) < 50) {
      game.state.start('Tutorial', true, false)
    }
    if (Math.abs(game.input.activePointer.worldX + 250) < 50 && Math.abs(game.input.activePointer.worldY + 350) < 50) {
      tutorialSelectCheck = true
      tutorialStartTxt.destroy()
      tutorialYesTxt.destroy()
      tutorialNoTxt.destroy()
      characterTxt = game.add.bitmapText(-600, -700, 'carrier_command','Choose your\n\ncharacter.', 34);
      character1 = game.add.sprite(-500, -500, 'bluesquare')
      character2 = game.add.sprite(-300, -500, 'meeple')
      character1.anchor.setTo(.5, .5)
      character2.anchor.setTo(.5, .5)
    }
  }
  if (game.input.activePointer.leftButton.isDown && charselectCheck === false && tutorialSelectCheck === true) {
    if (Math.abs(game.input.activePointer.worldX + 500) < 20 && Math.abs(game.input.activePointer.worldY + 500) < 20) {
      playernum = 1
      roomSelect()
    }
    if (Math.abs(game.input.activePointer.worldX + 300) < 20 && Math.abs(game.input.activePointer.worldY + 500) < 20) {
      playernum = 2
      roomSelect()
    }
  }
  if (charselectCheck === true && game.input.activePointer.leftButton.isDown) {
    var pointx = game.input.activePointer.worldX
    var pointy = game.input.activePointer.worldY
    for(var i=0; i<16; i++) {
      if (Math.abs(pointx + 610 - 140 * (i % 4)) < 50 && Math.abs(pointy + 710 -140 * (Math.floor(i / 4))) < 50) {
        roomnumber = i + 1
        console.log(roomnumber)
        socket.emit('roomSelect', {roomnumber, playernum})
      }
    }
  }
}

function roomSelect () {
  charselectCheck = true
  characterTxt.destroy()
  character1.destroy()
  character2.destroy()
  game.add.sprite(-660, -760, 'rock')
  game.add.sprite(-520, -760, 'waterdrop')
  game.add.sprite(-380, -760, 'tornado')
  game.add.sprite(-240, -760, 'fireroom')
  game.add.sprite(-660, -620, 'stars')
  game.add.sprite(-520, -620, 'cube')
  game.add.sprite(-380, -620, 'chemistry')
  game.add.sprite(-240, -620, 'sun')
  game.add.sprite(-660, -480, 'muscle')
  game.add.sprite(-520, -480, 'magic')
  game.add.sprite(-380, -480, 'hourglass')
  game.add.sprite(-240, -480, 'blood')
  game.add.sprite(-660, -340, 'apple')
  game.add.sprite(-520, -340, 'eyes')
  game.add.sprite(-380, -340, 'thinking')
  game.add.sprite(-240, -340, 'justice')
}

function joinedroom () {
  game.state.start('game1', true, false)
}

function restartgame () {
  timeoutmanager.clearAllTimeout()
  intervalmanager.clearAllInterval()
  //boss1music[0].destroy()
  //boss1music[1].destroy()
  oof.destroy()
  inPlay = false
  game.state.start('Title', true, false)
  retryCheck = false
}

function createTutorial () {
  window.land
  window.player
  window.oof
  window.permaspear
  window.swipe
  window.swipe2
  window.swipetTime = 0
  window.swipeCheck = false
  window.swipeCheck2 = false
  window.moveCheck = true
  window.blockCheck = false
  window.blockCheck2 = false
  window.mainPhase = false
  window.tutorialTxt
  window.health = 0
  window.invulnerable = false
  window.correctCounter = 0
  window.tutorialType = 'Orange'
  window.skullCircles = false
  window.skullCircle = []
  window.inSkullCircle = false
  window.skullCircleTime = 0

  tutorial = true

  oof = game.add.audio('oof')
  land = game.add.tileSprite(0, 0, 800, 600, 'earth')
  land.fixedToCamera = true
  tutorialTxt = game.add.bitmapText(-600, -700, 'carrier_command','Orange means\n\nblock\n\nBlock with\n\nSPACEBAR', 34);
  var startX = -400
  var startY = -400
  player = game.add.sprite(startX, startY, 'bluesquare')
  player.anchor.setTo(0.5, 0.5)
  player.game.physics.arcade.enableBody(player)
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
  player.body.maxVelocity.setTo(400, 400)
  player.body.collideWorldBounds = true
  player.body.setSize(24, 24, 4, 4)
  player.bringToTop()
  cursors = game.input.keyboard.createCursorKeys()

  permaspear = game.add.sprite(player.x, player.y, 'permaspear')
  permaspear.anchor.setTo(.5, .5)
  game.physics.arcade.enable(permaspear, Phaser.Physics.ARCADE);
}

function updateTutorial () {
  var prevdeltaTime = deltaTime
  deltaTime = game.time.elapsedMS * 60 / 1000
  if (deltaTime < 1) {
    deltaTime = 1
    deltaTime2 = 1000 / 60
  } else {
    deltaTime2 = game.time.elapsedMS
  }

  permaspear.rotation = game.physics.arcade.angleBetween(permaspear, player) + Math.PI * .5
  if (Phaser.Math.distance(player.x, player.y, permaspear.x, permaspear.y) > 35 && swipeCheck === false) {
    game.physics.arcade.moveToObject(permaspear, player, 100 * deltaTime)
  } else {
    permaspear.body.velocity.setTo(0, 0)
    if (swipeCheck2 === false) {
      swipeTime = 0
      swipeCheck = true
      swipeCheck2 = true
      swipe = permaspear.addChild(game.make.sprite(0, -16, 'halfcircle'))
      swipe.scale.setTo(.2)
      swipe.anchor.setTo(.5, 1)
      swipe.alpha = .25
      swipe2 = permaspear.addChild(game.make.sprite(0, -16, 'halfcircle'))
      swipe2.scale.setTo(.000002)
      swipe2.anchor.setTo(.5, 1)
      swipe2.alpha = .5
      swipe.tint = 0xFF8C00
      swipe2.tint = 0xFF8C00
      if (tutorialType === 'Red') {
        swipe.tint = 0xFF0000
        swipe2.tint = 0xFF0000
      }
      game.physics.arcade.enable(swipe, Phaser.Physics.ARCADE);
      timeoutmanager.setTimeout(endSwipe, 500)
      timeoutmanager.setTimeout(endSwipe2, 2000)
    }
  }

  if (moveCheck === true) {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && blockCheck2 === false) {
      moveCheck = false;
      blockCheck = true;
      blockCheck2 = true;
      player.loadTexture('redsquare', 0)
      timeoutmanager.setTimeout(blockReset, 400)
      timeoutmanager.setTimeout(blockReset2, 1000)
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        player.x -= 4 * deltaTime
        if (mainPhase === false) {
          player.angle = 90
        }
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      player.x += 4 * deltaTime
      if (mainPhase === false) {
        player.angle = -90
      }
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      player.y -= 4 * deltaTime
      if (mainPhase === false) {
        player.angle = 180
      }
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      player.y += 4 * deltaTime
      if (mainPhase === false) {
        player.angle = 0
      }
    };
  }

  if (swipeCheck === true) {
    swipeTime += deltaTime2
    swipe2.scale.setTo(swipeTime * .2 / 500)
  }

  if (skullCircles === true) {
    skullCircleTime += deltaTime2
    skullCircle[1].scale.setTo(skullCircleTime * .1 / 3500)
  }
}

function correct () {
  correctCounter = correctCounter + 1
  if (correctCounter > 2.9) {
    correctCounter = 0
    if (tutorialType === 'Orange') {
      tutorialType = 'Red'
      tutorialTxt.destroy()
      tutorialTxt = game.add.bitmapText(-600, -700, 'carrier_command','Red cannot\n\nbe blocked', 34);
    } else if (tutorialType === 'Red') {
      tutorialTxt.destroy()
      tutorialTxt = game.add.bitmapText(-600, -700, 'carrier_command','Green is\n\nsafe', 34);
      intervalmanager.setInterval(skullCirclefunc, 3500)
      tutorialType = 'Green'
    } else if (tutorialType === 'Green') {
      timeoutmanager.clearAllTimeout()
      intervalmanager.clearAllInterval()
      game.state.start('Title')
    }
  }
}

function create () {
  window.pokemon = true

  window.radial
  window.radialOn = false
  window.radialx
  window.radialy
  window.radialAngle
  window.weaponE

  window.health = 3
  window.invulnerable = false

  window.currentSpeed = 0

  window.boss1music = []

  window.inPlay = true
  window.gameStart = false

  window.waterfire

  window.repeatCheck = false

  window.treeWarning
  window.tree
  window.isTree = false
  window.forwardFire = []
  window.forwardFirewallCheck = false
  window.splitFire = []
  window.fireskull = []
  window.skullHealth = 150
  window.skullHealth2 = 3
  window.waterWall = []
  window.waterWallCheck1 = false
  window.waterWallCheck2 = false
  window.greenareaCheck = false
  window.redareaCheck = false
  window.greenarea
  window.greenarea2
  window.fountainCheck = false
  window.fountaindata = []
  window.spear
  window.spearCheck = false
  window.spearxvel
  window.spearyvel
  window.speardata = []
  window.splitFireCheck = false
  window.skullCircle = []
  window.skullCircles = false
  window.skullrepeat
  window.skullrepeat2
  window.waterSpearCheck = false
  window.inSkullCircle = false
  window.skullfire = []
  window.skullfireAngle = 0
  window.skullfireBody
  window.fireskullRipCheck = false
  window.whichSkull = 0
  window.swipe
  window.swipe2
  window.swipeCheck = false
  window.swipeCheck2 = false
  window.materialGained = false
  window.materialSpearCheck = false
  window.craftWarningEventHandlers
  window.craftCheck = false
  window.prevCraftCheck = false
  window.armor = 1
  window.craftMod = 1
  window.invulnframesCheck
  window.oof
  window.player
  window.enemies = []
  window.letter
  window.theLetter
  window.craftKey
  window.material = 0
  window.waterCheck = false
  window.singleSkullCheck = false
  window.splitFire2 = []
  window.singleskullbar
  window.singleskullbar2
  window.singleskullComboCheck = false
  window.singleskullComboCheck2 = 0
  window.updateSingleskullBar
  window.updateskullbarnum = 1
  window.skulldir = 'down'
  window.mainPhase = false
  window.damageTime = false
  window.yellowdamagebar
  window.greendamagebar
  window.pinkdamagebar
  window.damagebarCheck
  window.realityPower = 0
  window.realityCheck = false
  window.laser
  window.laser2
  window.laserTime = 0
  window.laserCheck0 = false
  window.laserCheck = false
  window.laserCheck2 = false
  window.laserCheck3 = false
  window.laserline
  window.lasernum = 0
  window.laserTell
  window.timebomb = []
  window.timebombCheck = false
  window.timebombTime = 0
  window.skullCircleTime = 0
  window.treeUI
  window.waterUI
  window.fireUI
  window.craftcounter = 0
  window.spearCounter = 0
  window.TPtell = []
  window.TPCheck = false
  window.TPTime = 0
  window.blockCheck = false
  window.blockCheck2 = false
  window.materialCollectedCheck = false
  window.heart = []
  window.log = []
  window.woodspear = []
  window.permaspear

  window.moveCheck = true

  playerstuff = game.add.group()
  bossstuff = game.add.group()

  //boss1music[0] = game.add.audio('boss1a')
  //boss1music[1] = game.add.audio('boss1b')
  oof = game.add.audio('oof')
  enemies = []

  land = game.add.tileSprite(0, 0, 800, 600, 'earth')
  land.fixedToCamera = true

  var startX = Math.round(Math.random() * (1000) - 500)
  var startY = Math.round(Math.random() * (1000) - 500)
  player = game.add.sprite(startX, startY, 'bluesquare')
  player.anchor.setTo(0.5, 0.5)
  player.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true)
  player.animations.add('stop', [3], 20, true)
  player.game.physics.arcade.enableBody(player)
  game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
  player.body.maxVelocity.setTo(400, 400)
  player.body.collideWorldBounds = true
  player.body.setSize(24, 24, 4, 4)

  player.bringToTop()

  if (retryCheck === true) {
    enemies.push(new RemotePlayer(otherPlayer[0], game, player, otherPlayer[1], otherPlayer[2], otherPlayer[3], playernum))
    if (playernum === 1) {
      socket.emit('new game')
    }
  } else {
    socket.emit('new player', { playerType: 'player', x: player.x, y: player.y, angle: player.angle, room: roomnumber })
  }

  //game.camera.follow(player)
  //game.camera.deadzone = new Phaser.Rectangle(300, 300, 500, 300)
  //game.camera.focusOnXY(0, 0)

  cursors = game.input.keyboard.createCursorKeys()

  for (i = 0; i < 4; i++) {
    skullfire[i] = game.add.weapon(500, 'fireball')
    skullfire[i].bulletKillType = Phaser.Weapon.KILL_WORD_BOUNDS;
    skullfire[i].bulletSpeed = 150;
    skullfire[i].fireRate = 800;
    skullfire[i].setBulletBodyOffset(4, 4, 3, 3)
  }
  skullfire[3].onFire.add(skullfireAngleSet)

  waterfire = game.add.weapon(50, 'waterball');
  waterfire.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  waterfire.bulletSpeed = 800
  waterfire.fireRate = 100;

  if (playernum === 2) {
      permaspear = game.add.sprite(player.x, player.y, 'permaspear')
      permaspear.anchor.setTo(.5, .5)
      game.physics.arcade.enable(permaspear, Phaser.Physics.ARCADE);
      socket.emit('new player', { playerType: 'permaspear', x: permaspear.x, y: permaspear.y, angle: permaspear.angle, room: roomnumber })
  }
}

function gameOver () {
  game.state.start('Over', true, false)
}

function otherWaterfire (data) {
  if (playernum === 2 && gameStart === true) {
    waterfire.fire(enemies[0].player, data.x, data.y);
  }
}

function ripHealth () {
  if (invulnerable === false) {
    for (var i=0; i<health; i++) {
      heart[i].alpha = 1
    }
    oof.play()
    console.log('health: ' + health)
    invulnerable = true
    timeoutmanager.setTimeout(vulnerable, 1500)
    player.alpha = .2
    invulnframesCheck = setInterval(invulnframes, 100)
    if (health === 3) {
      health = 2
      heart[health].destroy()
    } else if (health === 2) {
      health = 1
      heart[health].destroy()
    } else if (health === 1) {
      //socket.emit('gameOver')
    }
  }
}

function invulnframes () {
  player.alpha = 1.2 - player.alpha
}

function vulnerable () {
  invulnerable = false
  player.alpha = 1
  for (var i=0; i<health; i++) {
    heart[i].alpha = 0
  }
  clearInterval(invulnframesCheck)
}

function print1() {
  console.log('1')
}

function print2() {
  console.log('2')
}

function print3() {
  inPlay = false
  console.log('3')
  player.y = -500
  if (playernum === 1) {
    player.x = -500
    player.loadTexture('bluesquare', 0)
  }
  if (playernum === 2) {
    player.x = -300
    player.loadTexture('enemy', 0)
    player.body.setSize(24, 24, 4, 4)
  }
  var randmus1 = Math.random() * 2
  var randmus = Math.floor(randmus1)
  heart[0] = player.addChild(game.make.sprite(-15, -25, 'heart'))
  heart[1] = player.addChild(game.make.sprite(0, -25, 'heart'))
  heart[2] = player.addChild(game.make.sprite(15, -25, 'heart'))
  log[0] = player.addChild(game.make.sprite(-20, 25, 'log'))
  log[1] = player.addChild(game.make.sprite(-10, 25, 'log'))
  log[2] = player.addChild(game.make.sprite(0, 25, 'log'))
  log[3] = player.addChild(game.make.sprite(10, 25, 'log'))
  log[4] = player.addChild(game.make.sprite(20, 25, 'log'))
  woodspear[0] = player.addChild(game.make.sprite(-20, 35, 'woodspear'))
  woodspear[1] = player.addChild(game.make.sprite(-10, 35, 'woodspear'))
  woodspear[2] = player.addChild(game.make.sprite(0, 35, 'woodspear'))
  woodspear[3] = player.addChild(game.make.sprite(10, 35, 'woodspear'))
  woodspear[4] = player.addChild(game.make.sprite(20, 35, 'woodspear'))
  for (var i=0; i<3; i++) {
    heart[i].scale.setTo(.1)
    heart[i].anchor.setTo(.5, .5)
  }
  for (var i=0; i<5; i++) {
    log[i].scale.setTo(.1)
    log[i].anchor.setTo(.5, .5)
    log[i].alpha = 0
  }for (var i=0; i<5; i++) {
    woodspear[i].scale.setTo(.1)
    woodspear[i].anchor.setTo(.5, .5)
    woodspear[i].alpha = 0
  }
  //boss1music[randmus].play()
  //boss1music[randmus].volume = .2
}

function bossSpawn1() {
  timeoutmanager.setTimeout(print3, 10000)
  timeoutmanager.setTimeout(print2, 11000)
  timeoutmanager.setTimeout(print1, 12000)
  timeoutmanager.setTimeout(bossSpawn2, 13000)
  console.log('spawning boss')
  socket.on('tree', tree)
}

function bossSpawn2() {
  console.log('TIME TO DIE')
  player.angle = 0
  inPlay = true;
  bowser = game.add.sprite(-400, -800, 'bowser')
  bowser.scale.setTo(.1, .1)
  bowser.anchor.setTo(.5, .5)
  game.physics.arcade.enable(bowser, Phaser.Physics.ARCADE);
  //armorbar = game.add.sprite(-400, -800, 'armorbar')
  //armorbar.scale.setTo(.1, .01)
  gameStart = true
  mainPhase = true
  for (var i=0; i<3; i++) {
    heart[i].alpha = 0
  }
}

function blockReset () {
  moveCheck = true
  blockCheck = false
  if (playernum === 2) {
    player.loadTexture('enemy')
  } else {
    player.loadTexture('bluesquare')
  }
}

function blockReset2 () {
  blockCheck2 = false
}

function bossAngleGet(bossangle) {
  var xdis = Math.sin(bossangle) * 200
  var ydis = Math.cos(bossangle) * 200
  if (playernum === 1) {
    var newbossx = player.x + xdis
    var newbossy = player.y + ydis
  } else {
    var newbossx = enemies[0].player.x + xdis
    var newbossy = enemies[0].player.y + ydis
  }
  return [newbossx, newbossy]
}

function bossTP(bossangle) {
  var newbosspos = bossAngleGet(bossangle)
  TPtell[0] = game.add.sprite(newbosspos[0], newbosspos[1], 'whitecircle')
  TPtell[0].anchor.setTo(.5,.5)
  TPtell[0].alpha = .25
  TPtell[0].scale.setTo(.25)
  TPtell[0].tint = 0xFF0000
  TPtell[1] = game.add.sprite(newbosspos[0], newbosspos[1], 'whitecircle')
  TPtell[1].anchor.setTo(.5,.5)
  TPtell[1].alpha = .5
  TPtell[1].scale.setTo(.00001)
  TPtell[1].tint = 0xFF0000
  timeoutmanager.setTimeout(function(){ bossTP2(newbosspos); }, 1000)
  TPCheck = true
}

function bossTP2(newbosspos) {
  TPCheck = false
  TPTime = 0
  bowser.x = newbosspos[0]
  bowser.y = newbosspos[1]
  TPtell[0].destroy()
  TPtell[1].destroy()
}

function tree(treeLoc) {
  if (playernum === 2) {
    treeWarning = game.add.sprite(treeLoc, -300, 'bowser');
    console.log('tree1')
    treeWarning.anchor.setTo(.5)
    treeWarning.scale.setTo(.05);
  }
}

function tree2(treeLoc) {
  if (playernum === 2) {
    treeWarning.destroy()
    console.log('tree2')
  }
  tree = game.add.sprite(treeLoc, 0, 'tree')
  tree.anchor.setTo(.5, .5)
  tree.scale.setTo(.1)
  game.physics.arcade.enable(tree, Phaser.Physics.ARCADE);
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
    game.physics.arcade.enable(forwardFire[i], Phaser.Physics.ARCADE);
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

function laser0 () {
  //laserTell = bowser.addChild(game.make.sprite(0, 170, 'redTell'))
  //laserTell.anchor.setTo(.5, .5)
}

function laser1 (data) {
  laserCheck0 = data
  laserTime = 0
  if (playernum === data) {
    laserline = new Phaser.Line(bowser.x, bowser.y, player.x, player.y)
    laserx = bowser.x - player.x
    lasery = bowser.y - player.y
    laserAngle = Math.atan(laserx / lasery)
  } else {
    laserline = new Phaser.Line(bowser.x, bowser.y, enemies[0].player.x, enemies[0].player.y)
    laserx = bowser.x - enemies[0].player.x
    lasery = bowser.y - enemies[0].player.y
    laserAngle = Math.atan(laserx / lasery)
  }
  laser = game.add.sprite(bowser.x, bowser.y, 'reallaser')
  laser.anchor.setTo(.5, 1)
  laser.alpha = .25
  laser2 = game.add.sprite(bowser.x, bowser.y, 'reallaser')
  laser2.anchor.setTo(.5, 1)
  laser2.alpha = .5
  laser2.scale.setTo(.00001, 1)
  if (lasery < 0) {
    laser.angle = 180 - (laserAngle * 180 / Math.PI)
    laser2.angle = 180 - (laserAngle * 180 / Math.PI)
  } else {
    laser.angle = 360 - (laserAngle * 180 / Math.PI)
    laser2.angle = 360 - (laserAngle * 180 / Math.PI)
  }
  timeoutmanager.setTimeout(function(){ laserfunc2(data); }, 700)
}

function laserfunc2 (data) {
  laserCheck0 = false
  laser2.destroy()
  if (inPlay === true) {
    laser.destroy()
    if (playernum === data) {
      laserline = new Phaser.Line(bowser.x, bowser.y, player.x, player.y)
      laserx = bowser.x - player.x
      lasery = bowser.y - player.y
      laserAngle = Math.atan(laserx / lasery)
    } else {
      laserline = new Phaser.Line(bowser.x, bowser.y, enemies[0].player.x, enemies[0].player.y)
      laserx = bowser.x - enemies[0].player.x
      lasery = bowser.y - enemies[0].player.y
      laserAngle = Math.atan(laserx / lasery)
    }
    laser = game.add.sprite(bowser.x, bowser.y, 'laserWarning')
    laser.anchor.setTo(.5, 1)
    if (lasery < 0) {
      laser.angle = 180 - (laserAngle * 180 / Math.PI)
    } else {
      laser.angle = 360 - (laserAngle * 180 / Math.PI)
    }
    laserCheck = true
  }
}

function laser3 () {
  laserCheck = false
  laser.destroy()
  laserCheck2 = false
  //laserTell.destroy()
}

function timebomb1 () {
  timebomb[0] = player.addChild(game.make.sprite(0, 0, 'whitecircle'))
  timebomb[1] = enemies[0].player.addChild(game.make.sprite(0, 0, 'whitecircle'))
  timebomb[2] = player.addChild(game.make.sprite(0, 0, 'whitecircle'))
  timebomb[3] = enemies[0].player.addChild(game.make.sprite(0, 0, 'whitecircle'))
  timebomb[0].tint = 0xFF8C00
  timebomb[2].tint = 0xFF8C00
  timebomb[1].tint = 0xFF0000
  timebomb[3].tint = 0xFF0000
  for (var i = 0; i < 3; i++) {
    timebomb[i].scale.setTo(2)
    timebomb[i].alpha = .25
    timebomb[i].anchor.setTo(.5, .5)
  }
  for (var i = 3; i < 4; i++) {
    timebomb[i].scale.setTo(.0001)
    timebomb[i].alpha = .5
    timebomb[i].anchor.setTo(.5, .5)
  }
  timebombCheck = true
}

function timebomb2 () {
  timebombCheck = false
  timebombTime = 0
  if (Phaser.Math.distance(player.x, player.y, enemies[0].player.x, enemies[0].player.y) < 300) {
    ripHealth()
  }
  if (blockCheck === false) {
    ripHealth()
  }
  for (var i = 0; i < 4; i++) {
    timebomb[i].destroy()
  }
}

function splitFireWarning () {
  bowser.y = -700
  inPlay = false
  if (playernum === 1) {
    player.x = -600
    player.y = -300
  } else {
    player.x = -200
    player.y = -300
  }
}

function splitFire1 () {
  if (playernum === 2) {
      //permaspear.destroy()
  }
  inPlay = true
  mainPhase = false
  bowser.y = -1000
  for (var i = 0; i < 15; i++) {
    splitFire[i] = game.add.sprite(-400, i*40 - 800, 'fire')
    splitFire[i].scale.setTo(.1)
    splitFire[i].anchor.setTo(.5, 0)
    game.physics.arcade.enable(splitFire[i], Phaser.Physics.ARCADE);
    splitFireCheck = true
  }
  for (var i = 0; i < 2; i++) {
    fireskull[i] = game.add.sprite(-400*i - 200, -500, 'fireskull')
    fireskull[i].anchor.setTo(.5, .5)
    game.physics.arcade.enable(fireskull[i], Phaser.Physics.ARCADE);
    fireskull[i].body.setSize(20, 20, 10, 10)
  }
  singleskullbar = fireskull[1].addChild(game.make.sprite(20, 20, 'singleskullbar'))
  singleskullbar.anchor.setTo(0, 1)
  skullrepeat = setInterval(skullCirclefunc, 3500)
}

function damageSkull () {
  skullHealth = skullHealth - 1
  console.log('skullHealth: ' + skullHealth)
  singleskullbar.scale.setTo(skullHealth / 150, 1)
}

function inSkullCirclefunc () {
  inSkullCircle = true
}

function skullCirclefunc () {
  if (skullCircles === true) {
    game.physics.arcade.overlap(skullCircle[0], player, inSkullCirclefunc, null, this);
    if (inSkullCircle === false) {
      ripHealth()
      if (tutorial === true && correctCounter > 0) {
        correctCounter = correctCounter - 1
      }
    } else if (tutorial === true) {
      correct()
    }
    inSkullCircle = false
    skullCircle[0].destroy()
    skullCircle[1].destroy()
    skullCircleTime = 0
  }
  skullCircles = true
  if (playernum === 1) {
    var randomx = -600
    var randomy = -500
    while (randomx > -630 && randomx < -570 && randomy > -530 && randomy < -470) {
      randomx = Math.random() * 340 - 770
      randomy = Math.random() * 340 - 670
    }
  } else {
    var randomx = -200
    var randomy = -500
    while (randomx > -250 && randomx < -150 && randomy > -550 && randomy < -450) {
      randomx = Math.random() * 340 - 370
      randomy = Math.random() * 340 - 670
    }
  }
  skullCircle[0] = game.add.sprite(randomx, randomy, 'greenarea')
  skullCircle[0].scale.setTo(.1)
  skullCircle[0].alpha = .25
  skullCircle[0].anchor.setTo(.5, .5)
  game.physics.arcade.enable(skullCircle[0], Phaser.Physics.ARCADE);
  skullCircle[1] = game.add.sprite(randomx, randomy, 'greenarea')
  skullCircle[1].scale.setTo(.000001)
  skullCircle[1].alpha = .5
  skullCircle[1].anchor.setTo(.5, .5)
}

function skullCirclefunc2 () {
  if (playernum === 2) {
    if (skullCircles === true) {
      game.physics.arcade.overlap(skullCircle[0], player, inSkullCirclefunc, null, this);
      if (inSkullCircle === false) {
        ripHealth()
      }
      inSkullCircle = false
      skullCircle[0].destroy()
      skullCircle[1].destroy()
      skullCircleTime = 0
    }
    skullCircles = true
    var randomx = 0
    var randomy = 0
    while ((randomx + 400) * (randomx + 400) + (randomy + 500) * (randomy + 500) > 180 * 180)  {
      randomx = Math.random() * 400 - 600
      randomy = Math.random() * 400 - 700
    }
  }
  skullCircle[0] = game.add.sprite(randomx, randomy, 'greenarea')
  skullCircle[0].scale.setTo(.1)
  skullCircle[0].alpha = .25
  skullCircle[0].anchor.setTo(.5, .5)
  game.physics.arcade.enable(skullCircle[0], Phaser.Physics.ARCADE);
  skullCircle[1] = game.add.sprite(randomx, randomy, 'greenarea')
  skullCircle[1].scale.setTo(.000001)
  skullCircle[1].alpha = .5
  skullCircle[1].anchor.setTo(.5, .5)
}

function waterWallOn2 (waterWallPosx, waterWallPosy) {
  if (playernum === 2) {
    for (var i = 0; i < 3; i++) {
      waterWall[i] = game.add.sprite(waterWallPosx[i], waterWallPosy[i], 'wotorball')
      waterWall[i].scale.setTo(.15)
      waterWall[i].anchor.setTo(.5, .5)
      game.physics.arcade.enable(waterWall[i], Phaser.Physics.ARCADE);
    }
    waterWallCheck1 = true
  }
}

function waterWallOff () {
  waterWallCheck2 = false
  waterWall[0].destroy()
  waterWall[1].destroy()
  waterWall[2].destroy()
  socket.emit('waterWallOff')
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
  fountain.destroy()
  fountainCheck = false
}

function fountainCool2 () {
  waterCheck = false
  if (playernum === 1) {
    player.loadTexture('bluesquare', 0)
  }
}

function fountainOn (fountainPos) {
  if (playernum === 2) {
    fountain = game.add.sprite(fountainPos[0], fountainPos[1], 'wotorball')
    fountain.anchor.setTo(.5)
    fountain.scale.setTo(.15)
    game.physics.arcade.enable(fountain, Phaser.Physics.ARCADE);
    fountainCheck = true
  }
}

function spearOn (spearPos) {
  if (playernum === 1) {
    spear = game.add.sprite(spearPos[0], spearPos[1], 'bowser')
    spear.scale.setTo(.025)
    spear.anchor.setTo(.5, .5)
    game.physics.arcade.enable(spear, Phaser.Physics.ARCADE);
    spearCheck = true
    spearxvel = spearPos[2]
    spearyvel = spearPos[3]
  }
}

function onSocketConnected () {
  console.log('Connected to socket server')
  socket.on('playnum', playnum)
  enemies.forEach(function (enemy) {
    enemy.player.kill()
  })
  enemies = []
  //socket.emit('new player', { x: player.x, y: player.y, angle: player.angle })
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
  if (enemies[0] !== undefined && data.id !== 'permaspear') {
    console.log(enemies[0])
    enemies[0].player.destroy()
    enemies = []
  }
  otherPlayer[0] = data.id
  otherPlayer[1] = data.x
  otherPlayer[2] = data.y
  otherPlayer[3] = data.angle
  enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y, data.angle, playernum))
  console.log('new enemy' + enemies)
  if (data.id === 'permaspear') {
    enemies[1].player.loadTexture('permaspear')
  }
}

function onMovePlayer (data) {
  var movePlayer = playerById(data.id)

  if (!movePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  movePlayer.player.x = data.x
  movePlayer.player.y = data.y
  //movePlayer.player.angle = data.angle
}

function onRemovePlayer (data) {
  var removePlayer = playerById(data.id)

  if (!removePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  removePlayer.player.kill()

  enemies.splice(enemies.indexOf(removePlayer), 1)

  if (skullrepeat !== undefined) {
    clearInterval(skullrepeat)
  }
  if (skullrepeat2 !== undefined) {
    clearInterval(skullrepeat2)
  }
  timeoutmanager.clearAllTimeout()
  intervalmanager.clearAllInterval()
  game.state.start('Title')
}

function hitBoss (boss, bullet) {
  if (playernum === 1) {
    socket.emit('hitBoss')
  }
  bullet.kill()
}

function hitCraft (player, bullet) {
  //waterUI.destroy()
  //fireUI.destroy()
  material += 1
  console.log('material: ' + material)
  bullet.kill()
  if (material > 50) {
    craftcounter = craftcounter - 4
    materialCollectedCheck = false
    if (craftcounter === 0) {
      for (var i=0; i<5; i++) {
        log[i].alpha = 0
      }
    } else {
      for (var i=1; i<5; i++) {
        log[i].alpha = 0
      }
    }
    woodspear[spearCounter].alpha = 1
    spearCounter = spearCounter + 1
    material = 0
  }
}

function ripbullet (splitFire, bullet) {
  bullet.kill()
}

function ripskullfire (splitFire, bullet) {
  bullet.kill()
}

function updateArmor (newArmor) {
  armor = newArmor
  //armorbar.scale.setTo(.1 * armor / 16, .01)
  //console.log('Armor: ' + armor)
}

function waterWallCool () {
  waterWallCheck1 = false
  waterCheck = false
  player.loadTexture('bluesquare')
}

function fireWallDestroy (i) {
  forwardFire[i].destroy()
}

function spearRemove () {
  spear.destroy()
  spearCheck = false
  waterSpearCheck = false
}

function spearRemove2 () {
  spear.x = -100000
}

function waterSpear () {
  spear.loadTexture('wotorball')
  spear.scale.setTo(.2)
  waterSpearCheck = true
}

function skullfireAngleSet () {
  skullfireAngle += 15
  if (skullfireAngle === 90) {
    skullfireAngle = 0
  }
}

function ripFireskull () {
  if (fireskullRipCheck === false) {
    fireskull[1].alpha -= .33333
    fireskullRipCheck = true
    timeoutmanager.setTimeout(fireskullRipChange, 1000)
    skullHealth = 150
    skullHealth2 = skullHealth2 - 1
  }
  if (skullHealth2 < .05) {
    timeoutmanager.setTimeout(ripFireskull1, 3000)
    fireskull[1].destroy()
    for (var i = 0; i < 15; i++) {
      splitFire[i].destroy()
    }
    skullCircle[0].destroy()
    skullCircle[1].destroy()
    skullCircleTime = 0
    clearInterval(skullrepeat)
    splitFireCheck = false
    skullCircles = false
    inPlay = false
    if (playernum === 2) {
      player.x = -400
      player.y = -500
    } else if (playernum === 1) {
      player.x = -700
      player.y = -500
    }
    fireskull[0].x = -100
    fireskull[0].y = -500
  }
}

function ripFireskull1 () {
  skullrepeat2 = setInterval(skullCirclefunc2, 2000)
  singleSkullCheck = true
  inPlay = true
  for (var i = 0; i < 30; i++) {
    var splitfirex = Math.sin(i * Math.PI / 15) * 200 - 400
    var splitfirey = Math.cos(i * Math.PI / 15) * 200 - 500
    splitFire2[i] = game.add.sprite(splitfirex, splitfirey, 'fire')
    splitFire2[i].scale.setTo(.1)
    splitFire2[i].anchor.setTo(.5, .5)
    game.physics.arcade.enable(splitFire2[i], Phaser.Physics.ARCADE);
  }
}

function ripFireskull2 () {
  if (singleskullComboCheck === false) {
    singleskullComboCheck = true
    singleskullComboCheck2 += 1
    if (singleskullComboCheck2 > 1.9) {
      singleskullbar.destroy()
      clearInterval(updateSingleskullBar)
      updateskullbarnum = 1;
    }
    singleskullbar = fireskull[1].addChild(game.make.sprite(20, 20, 'singleskullbar'))
    singleskullbar.anchor.setTo(0, 1)
    timeoutmanager.setTimeout(singleskullComboReset, 1000)
    updateSingleskullBar = setInterval(updateSkullBar, 1000)
    var randomskullpos = Math.random() * 2200
    if (randomskullpos < 500) {
      fireskull[1].x = -100
      fireskull[1].y = randomskullpos - 750
      skulldir = 'down'
    } else if (randomskullpos < 1100) {
      fireskull[1].x = randomskullpos - 1200
      fireskull[1].y = -250
      skulldir = 'left'
    } else if (randomskullpos < 1600) {
      fireskull[1].x = -700
      fireskull[1].y = randomskullpos - 1850
      skulldir = 'up'
    } else if (randomskullpos < 2200) {
      fireskull[1].x = randomskullpos - 2300
      fireskull[1].y = -750
      skulldir = 'right'
    }
  }
}

function ripFireskull3 () {
  socket.emit('rip3')
}

function ripFireskull4 (randomg) {
  inPlay = false
  damageTime = true
  singleskullCheck = false
  singleskullComboCheck = false
  singleskullComboCheck2 = 0
  skulldir = 'down'
  fireskull[1].destroy()
  if (playernum === 1) {
    singleskullbar.destroy()
    clearInterval(updateSingleskullBar)
  }
  updateskullbarnum = 1;
  for (var i = 0; i < 30; i++) {
    splitFire2[i].destroy()
  }
  skullCircle[0].destroy()
  skullCircle[1].destroy()
  skullCircleTime = 0
  clearInterval(skullrepeat2)
  player.y = -300
  if (playernum === 1) {
    player.x = -450
  } else if (playernum === 2) {
    player.x = -400
  }

  yellowdamagebar = game.add.sprite(-400, -500, 'yellowdamagebar')
  yellowdamagebar.anchor.setTo(.5, .5)
  if (playernum === 2) {
    greendamagebar = game.add.sprite(randomg, -500, 'greendamagebar')
    greendamagebar.anchor.setTo(.5, .5)
    timeoutmanager.setTimeout(damage1, 3000)
  } else if (playernum === 1) {
    timeoutmanager.setTimeout(damage1, 2000)
  }
}

function updateSkullBar () {
  updateskullbarnum -= .125;
  singleskullbar.scale.setTo(updateskullbarnum, 1)
  if (updateskullbarnum < .05) {
    singleskullbar.destroy()
    updateskullbarnum = 1;
    singleskullComboCheck2 = 0
    clearInterval(updateSingleskullBar)
  }
}

function singleskullComboReset () {
  singleskullComboCheck = false
}

function fireskullRipChange () {
  fireskullRipCheck = false
}

function endSwipe () {
  if (tutorial === true) {
    if (blockCheck === false) {
      game.physics.arcade.overlap(swipe, player, ripHealth, null, this);
      if (correctCounter > 0 && tutorialType === 'Orange') {
        correctCounter = correctCounter - 1
      } else if (tutorialType === 'Red') {
        correct()
      }
    } else {
      if (tutorialType === 'Red') {
        game.physics.arcade.overlap(swipe, player, ripHealth, null, this);
      } else if (tutorialType === 'Orange') {
        game.physics.arcade.overlap(swipe, player, correct, null, this);
      }
    }
  }
  swipe.destroy()
  swipe2.destroy()
  swipeCheck = false
}

function endSwipe2 () {
  swipeCheck2 = false
}

function materialSpear () {
  materialSpearCheck = 'tree'
  permaspear.loadTexture('materialspear')
}

function permafire () {
  materialSpearCheck = 'fire'
  permaspear.loadTexture('materialspear')
}

function permawater () {
    materialSpearCheck = 'water'
    permaspear.loadTexture('materialspear')
}

function materialSpearReset () {
  permaspear.loadTexture('permaspear')
  if (craftcounter < 5) {
    log[craftcounter].alpha = 1
    craftcounter += 1
  }
  console.log('craftcounter: ' + craftcounter)
  if (materialSpearCheck === 'tree') {
    //treeUI = player.addChild(game.make.sprite(-16, -16, 'treeconfirm'))
    //treeUI.anchor.setTo(.5, .5)
    materialSpearCheck = false
  } else if (materialSpearCheck === 'fire' && fireUI === undefined) {
    fireUI = player.addChild(game.make.sprite(0, 16, 'treeconfirm'))
    fireUI.anchor.setTo(.5, .5)
  } else if (materialSpearCheck === 'water' && waterUI === undefined) {
    waterUI = player.addChild(game.make.sprite(16, -16, 'treeconfirm'))
    waterUI.anchor.setTo(.5, .5)
  }
  /*
  if (treeUI !== undefined) {
    materialSpearCheck = true
  } else {
    materialSpearCheck = false
  } */
}

function materialGain () {
  if (materialGained === false) {
    materialGained = true
    craftCheck = true
    timeoutmanager.setTimeout(materialGain2, 500)
    materialGain3()
  }
}

function materialGain2 () {
  materialGained = false
}

function materialGain3 () {
  if (prevCraftCheck === true) {
    letter.destroy()
  } else {
    timeoutmanager.setTimeout(materialGain4, 4000)
  }
  var prevLetter = theLetter
  prevCraftCheck = true
  var randLetters = ['q', 'e', 'z', 'c']
  var randLetterx = [-16, 16, -16, 16]
  var randLettery = [-16, -16, 16, 16]
  while (theLetter === prevLetter) {
    var randLetter1 = Math.random() * 4
    var randLetter = Math.floor(randLetter1)
    theLetter = randLetters[randLetter]
  }
  var letterx = randLetterx[randLetter]
  var lettery = randLettery[randLetter]
  letter = player.addChild(game.make.sprite(letterx, lettery, theLetter))
  letter.anchor.setTo(.5, .5)
}

function materialGain4 () {
  letter.destroy()
  craftCheck = false
  prevCraftCheck = false
  console.log('materialGain4')
}

function qEvent () {
  craftKey = 'q'
  crafted()
}
function eEvent () {
  craftKey = 'e'
  crafted()
}
function zEvent () {
  craftKey = 'z'
  crafted()
}
function cEvent () {
  craftKey = 'c'
  crafted()
}

function crafted () {
  if (craftKey === theLetter && craftCheck === true) {
    materialGain3()
    material = material * 1.1
  } else if (craftKey !== theLetter && craftKey !== 'none' && craftCheck === true) {
    material = material * .6
  }
  console.log('material: ' + material)
}

function realityAct () {
  realityCheck = true
  if (playernum === 2) {
    var randomx = -200
    var randomy = -500
    while (randomx > -250 && randomx < -150 && randomy > -550 && randomy < -450) {
      randomx = Math.random() * 340 - 370
      randomy = Math.random() * 340 - 670
    }
  } else if (playernum === 1) {
    var randomx = -600
    var randomy = -500
    while (randomx > -630 && randomx < -570 && randomy > -530 && randomy < -470) {
      randomx = Math.random() * 340 - 770
      randomy = Math.random() * 340 - 670
    }
  }
  realityPoint = game.add.sprite(randomx, randomy, 'yellowdamagebar')
  realityPoint.alpha = .5
  realityPoint.anchor.setTo(.5, .5)
}

function damage1 () {
  pinkdamagebar = game.add.sprite(-650, -500, 'pinkdamagebar')
  pinkdamagebar.anchor.setTo(.5, .5)
  damagebarCheck = true
}

function changeredarea () {
  redareaCheck = true
  greenarea.tint = 0xFF0000;
}

function update () {
  var prevdeltaTime = deltaTime
  deltaTime = game.time.elapsedMS * 60 / 1000
  if (deltaTime < 1) {
    deltaTime = 1
    deltaTime2 = 1000 / 60
  } else {
    deltaTime2 = game.time.elapsedMS
  }

  if (deltaTime > 0) {
    for (var i = 0; i < 4; i++) {
      skullfire[i].bullets.forEach(b => b.body.velocity.setTo(b.body.velocity.x / prevdeltaTime * deltaTime, b.body.velocity.y / prevdeltaTime * deltaTime));
      skullfire[i].bulletSpeed = 150 * deltaTime
    }
    waterfire.bullets.forEach(b => b.body.velocity.setTo(b.body.velocity.x / prevdeltaTime * deltaTime, b.body.velocity.y / prevdeltaTime * deltaTime));
    waterfire.bulletSpeed = 800 * deltaTime
  } else {
    console.log('deltaTime = 0')
  }

  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemies[i].update()
      game.physics.arcade.collide(player, enemies[i].player)
    };
  };

  if (invulnerable === false) {
    for (var i = 0; i < 5; i++) {
      if (laserCheck === true) {
        if (laserCheck2 === false) {
          laserCheck2 = Phaser.Line.intersectsRectangle(laserline, player)
          if (playernum === 2 && swipeCheck === true) {
            laserCheck3 = Phaser.Line.intersectsRectangle(laserline, permaspear)
            if (laserCheck3 === true && materialSpearCheck !== true) {
              //permafire()
            }
          }
          if (laserCheck2 === true && invulnerable === false && blockCheck === false) {
            ripHealth()
          }
        }
      }
    }
    //game.physics.arcade.overlap(tree, player.body, ripHealth, null, this);
    for (var i = 0; i < 20; i++) {
      game.physics.arcade.overlap(forwardFire[i], player, ripHealth, null, this);
    }
    for (var i = 0; i < 15; i++) {
      game.physics.arcade.overlap(splitFire[i], player, ripHealth, null, this);
    }
  }

  if (gameStart === true) {
    if (laserCheck0 !== false) {
      if (playernum === laserCheck0) {
        laserline = new Phaser.Line(bowser.x, bowser.y, player.x, player.y)
        laserx = bowser.x - player.x
        lasery = bowser.y - player.y
        laserAngle = Math.atan(laserx / lasery)
      } else {
        laserline = new Phaser.Line(bowser.x, bowser.y, enemies[0].player.x, enemies[0].player.y)
        laserx = bowser.x - enemies[0].player.x
        lasery = bowser.y - enemies[0].player.y
        laserAngle = Math.atan(laserx / lasery)
      }
      if (lasery < 0) {
        laser.angle = 180 - (laserAngle * 180 / Math.PI)
        laser2.angle = 180 - (laserAngle * 180 / Math.PI)
      } else {
        laser.angle = 360 - (laserAngle * 180 / Math.PI)
        laser2.angle = 360 - (laserAngle * 180 / Math.PI)
      }
    }
    if (splitFireCheck === true) {
      for (var i = 0; i < 15; i++) {
        game.physics.arcade.overlap(waterfire.bullets, splitFire[i], ripbullet, null, this);
      }
      game.physics.arcade.overlap(waterfire.bullets, fireskull[1], damageSkull, null, this);
      for (var i = 0; i < 4; i++) {
        skullfire[i].fireAngle = i*90 - 90 + skullfireAngle
        if (playernum === 2) {
          skullfire[i].fire(fireskull[0])
        } else {
          skullfire[i].fire(fireskull[1])
        }
        game.physics.arcade.overlap(skullfire[i].bullets, player, ripHealth, null, this);
      }
    }
    if (singleSkullCheck === true) {
      if (skulldir === 'down') {
        fireskull[1].y += 1.5
        if (fireskull[1].y > -250) {
          skulldir = 'left'
        }
      } else if (skulldir === 'left') {
        fireskull[1].x -= 1.5
        if (fireskull[1].x < -700) {
          skulldir = 'up'
        }
      } else if (skulldir === 'up') {
        fireskull[1].y -= 1.5
        if (fireskull[1].y < -750) {
          skulldir = 'right'
        }
      } else if (skulldir === 'right') {
        fireskull[1].x += 1.5
        if (fireskull[1].x > -100) {
          skulldir = 'down'
        }
      }
      for (var i = 0; i < 30; i++) {
        game.physics.arcade.overlap(player, splitFire2[i], ripHealth, null, this);
        game.physics.arcade.overlap(waterfire.bullets, splitFire2[i], ripbullet, null, this);
        if (waterSpearCheck === false) {
          game.physics.arcade.overlap(spear, splitFire2[i], spearRemove2, null, this);
        } else {
          if (singleskullComboCheck2 < 1.1) {
            game.physics.arcade.overlap(spear, fireskull[1], ripFireskull2, null, this);
          } else if (singleskullComboCheck2 > 1.9 && singleskullComboCheck === false) {
            game.physics.arcade.overlap(spear, fireskull[1], ripFireskull3, null, this);
          }
        }
      }
    }
    /*if (damagebarCheck === true) {
      pinkdamagebar.x += 10
      if (game.input.activePointer.leftButton.isDown) {
        damagebarCheck = false
      }
    }*/
    if (swipeCheck === true) {
    }
    game.physics.arcade.overlap(waterfire.bullets, bowser, hitBoss, null, this);
    if (waterWallCheck1 === true) {
      for (var j = 0; j < 3; j++) {
        if (playernum === 2 && materialSpearCheck !== true && swipeCheck === true) {
          //game.physics.arcade.overlap(waterWall[j], permaspear, permawater, null, this);
        }
      }
      for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 3; j++) {
          game.physics.arcade.overlap(waterWall[j], forwardFire[i], function(){ fireWallDestroy(i); }, null, this);
        }
      }
    }
    if (waterSpearCheck === true) {
      if (splitFireCheck === true) {
        game.physics.arcade.overlap(spear, fireskull[1], ripFireskull, null, this);
      }
    }
  }

  if (inPlay === true) {
    if (playernum === 2) {
      var distance = game.physics.arcade.distanceToPointer(permaspear)
      if (distance > 20) {
        game.physics.arcade.moveToPointer(permaspear, 450 * deltaTime)
        permaspear.rotation = game.physics.arcade.angleToPointer(permaspear) + Math.PI * .5
      } else {
        permaspear.body.velocity.setTo(0, 0)
      }
      //if (materialSpearCheck === true)  {
        //craftcounter += 1
        //treeUI.destroy()
        //treeUI = undefined
      //}
      if (craftcounter > 3) {
        materialCollectedCheck = true
        //craftcounter = 0
      }
      if (materialCollectedCheck === true) {
        game.physics.arcade.overlap(waterfire.bullets, player, hitCraft, null, this);
      }
      if (isTree === true && swipeCheck === true && materialSpearCheck !== true) {
        game.physics.arcade.overlap(permaspear, tree, materialSpear, null, this);
      }
      if (materialSpearCheck === 'tree') {
        game.physics.arcade.overlap(permaspear, player, materialSpearReset, null, this);
      }
    }
  }

  if (isTree === true) {
    tree.y -= 10 * deltaTime;
  }

  if (timebombCheck === true) {
    timebombTime += deltaTime2
    timebomb[2].scale.setTo((1300 -timebombTime) * 2 / 1300)
    timebomb[3].scale.setTo(timebombTime * 2 / 1300)
  }

  if (laserCheck0 !== false) {
    laserTime += deltaTime2
    laser2.scale.setTo(laserTime / 700)
  }

  if (skullCircles === true) {
    skullCircleTime += deltaTime2
    skullCircle[1].scale.setTo(skullCircleTime * .1 / 3500)
  }

  if (TPCheck === true) {
    TPTime += deltaTime2
    TPtell[1].scale.setTo(TPTime * .25 / 1000)
  }

  if (forwardFirewallCheck === true) {
    if (playernum === 2) {
      for (var i = 0; i < 20; i++) {
        if (swipeCheck === true && materialSpearCheck !== true) {
          //game.physics.arcade.overlap(permaspear, forwardFire[i], permafire, null, this);
        }
      }
    }
    for (var i = 0; i < 20; i++) {
      forwardFire[i].y += 10 * deltaTime;
    }
  }

  if (inPlay === true) {
    if (greenareaCheck === true) {
      redareaCheck = false
      greenarea.tint = 0xFFFFFF
      //game.physics.arcade.overlap(enemies[0].player, greenarea, changeredarea, null, this);
      if (splitFireCheck === true) {
        game.physics.arcade.overlap(fireskull[0], greenarea, changeredarea, null, this);
        game.physics.arcade.overlap(fireskull[1], greenarea, changeredarea, null, this);
      }
    }
    if (moveCheck === true) {
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && blockCheck2 === false) {
        moveCheck = false;
        blockCheck = true;
        blockCheck2 = true;
        player.loadTexture('redsquare', 0)
        timeoutmanager.setTimeout(blockReset, 400)
        timeoutmanager.setTimeout(blockReset2, 1000)
      }

      if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
          player.x -= 4 * deltaTime
          if (mainPhase === false) {
            player.angle = 90
          }
      };

      if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        player.x += 4 * deltaTime
        if (mainPhase === false) {
          player.angle = -90
        }
      };

      if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        player.y -= 4 * deltaTime
        if (mainPhase === false) {
          player.angle = 180
        }
      };

      if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        player.y += 4 * deltaTime
        if (mainPhase === false) {
          player.angle = 0
        }
      };

      if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
        if (playernum === 1 && waterCheck === false) {
          waterWallCheck1 = true
          waterWallCheck2 = true
          waterCheck = true
          player.loadTexture('cyansquare', 0)
          var waterWallx = []
          var waterWally = []
          for (var i = 0; i < 3; i++) {
            waterWall[i] = game.add.sprite(player.x + 40*i - 40, player.y - 40, 'wotorball')
            waterWall[i].scale.setTo(.15)
            waterWall[i].anchor.setTo(.5, .5)
            waterWallx[i] = waterWall[i].x
            waterWally[i] = waterWall[i].y
            game.physics.arcade.enable(waterWall[i], Phaser.Physics.ARCADE);
          }
          socket.emit('waterWallOn', waterWallx, waterWally)
          timeoutmanager.setTimeout(waterWallOff, 1000)
          timeoutmanager.setTimeout(waterWallCool, 6000)
        }
      }
    }

    if (game.input.activePointer.leftButton.isDown) {
      if (realityCheck === true && Math.abs(game.input.activePointer.worldX - realityPoint.x) < 6 && Math.abs(game.input.activePointer.worldY - realityPoint.y) < 6) {
        realityPoint.destroy()
        realityPower += 1
        if (realityPower < 9.5) {
          realityAct()
        }
      } else if (playernum === 1) {
        if (fountainCheck === false) {
          waterfire.fire(player, game.input.activePointer.worldX, game.input.activePointer.worldY);
        }
        socket.emit('waterfire', {x: game.input.activePointer.worldX, y: game.input.activePointer.worldY})
      } else if (playernum === 2 && swipeCheck2 === false) {
        swipe = player.addChild(game.make.sprite(0, 16, 'halfcircle'))
        swipe.angle = swipe.angle - 180
        swipe.scale.setTo(.2)
        swipe.anchor.setTo(.5, 1)
        swipe.alpha = .5
        swipe.tint = 0xFF1493
        game.physics.arcade.enable(swipe, Phaser.Physics.ARCADE);
        swipe2 = permaspear.addChild(game.make.sprite(0, -16, 'halfcircle'))
        swipe2.angle = swipe.angle - 180
        swipe2.scale.setTo(.2)
        swipe2.anchor.setTo(.5, 1)
        swipe2.alpha = .5
        swipe2.tint = 0xFF1493
        game.physics.arcade.enable(swipe2, Phaser.Physics.ARCADE);
        swipeCheck = true
        swipeCheck2 = true
        timeoutmanager.setTimeout(endSwipe, 500)
        timeoutmanager.setTimeout(endSwipe2, 1000)
      }
    }

    if (spearCheck === true) {
      spear.x += spearxvel * 10 * deltaTime;
      spear.y += spearyvel * 10 * deltaTime;
      if (fountainCheck === true) {
        game.physics.arcade.overlap(spear, fountain, waterSpear, null, this);
      }
    }

    if (craftCheck === true) {
      craftKey = 'none'
      var qPress = game.input.keyboard.addKey(Phaser.Keyboard.Q)
      qPress.onDown.add(qEvent, this)
      var ePress = game.input.keyboard.addKey(Phaser.Keyboard.E)
      ePress.onDown.add(eEvent, this)
      var zPress = game.input.keyboard.addKey(Phaser.Keyboard.Z)
      zPress.onDown.add(zEvent, this)
      var cPress = game.input.keyboard.addKey(Phaser.Keyboard.C)
      cPress.onDown.add(cEvent, this)
    }
    /*
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
    }*/

    if (game.input.activePointer.rightButton.isDown) {
      if (playernum === 2 && spearCheck === false && spearCounter > .9) {
        spearCounter = spearCounter - 1
        woodspear[spearCounter].alpha = 0
        spear = game.add.sprite(player.x, player.y, 'bowser')
        spear.scale.setTo(.025)
        spear.anchor.setTo(.5, .5)
        game.physics.arcade.enable(spear, Phaser.Physics.ARCADE);
        spearCheck = true
        realityPower = 0
        //realityAct()
        var spearxdis = game.input.activePointer.worldX - player.x
        var spearydis = game.input.activePointer.worldY - player.y
        spearxvel = spearxdis / Math.sqrt(spearxdis * spearxdis + spearydis * spearydis)
        spearyvel = spearydis / Math.sqrt(spearxdis * spearxdis + spearydis * spearydis)
        speardata[0] = spear.x
        speardata[1] = spear.y
        speardata[2] = spearxvel
        speardata[3] = spearyvel
        socket.emit('spearOn', speardata)
      }
      if (playernum === 1 && waterCheck === false/* && realityPower > 9.5*/) {
        if (greenareaCheck === false) {
          greenarea = game.add.sprite(game.input.activePointer.worldX, game.input.activePointer.worldY, 'greenarea')
          greenarea.scale.setTo(.1)
          greenarea.alpha = .2
          greenarea.anchor.setTo(.5, .5)
          game.physics.arcade.enable(greenarea, Phaser.Physics.ARCADE);
          greenarea2 = game.add.sprite(game.input.activePointer.worldX, game.input.activePointer.worldY, 'greenarea')
          greenarea2.scale.setTo(.0000001)
          greenarea2.alpha = .4
          greenarea2.anchor.setTo(.5, .5)
          greenareaCheck = true
        } else {
          greenarea.x = game.input.activePointer.worldX
          greenarea.y = game.input.activePointer.worldY
        }
      }
    } else if (greenareaCheck === true && redareaCheck === false) {
      fountain = game.add.sprite(greenarea.x, greenarea.y, 'wotorball')
      fountain.anchor.setTo(.5, .5)
      fountain.scale.setTo(.15)
      game.physics.arcade.enable(fountain, Phaser.Physics.ARCADE);
      greenarea.destroy()
      fountainCheck = true
      waterCheck = true
      player.loadTexture('cyansquare', 0)
      greenareaCheck = false
      fountaindata[0] = fountain.x
      fountaindata[1] = fountain.y
      socket.emit('fountainOn', fountaindata)
    } else if (greenareaCheck === true) {
      greenarea.destroy()
      greenareaCheck = false
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

  //land.tilePosition.x = -game.camera.x
  //land.tilePosition.y = -game.camera.y

  socket.emit('move player', { playerType: 'player', x: player.x, y: player.y, angle: player.angle })
  if (playernum === 2) {
    socket.emit('move player', { playerType: 'permaspear', x: permaspear.x, y: permaspear.y, angle: permaspear.angle })
  }
}

function render () {
  if (gameStart === true) {
    game.debug.bodyInfo(player, 32, 32);
    game.debug.body(player);
  }
  game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
}

function playerById (id) {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].player.name === id) {
      return enemies[i]
    }
  }

  return false
}

function create0 () {
  timeoutmanager.clearAllTimeout()
  intervalmanager.clearAllInterval()
  //boss1music[0].destroy()
  //boss1music[1].destroy()
  //oof.destroy()
  inPlay = false
  gmovr = game.add.sprite(-400, -500, 'gameOver')
  gmovr.anchor.setTo(.5, .5)
  retryCheck = false
}

function update0 () {
  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && retryCheck === false) {
    socket.emit('retry')
    retryCheck = true
  }
}

function retryready () {
  game.state.start('game1')
}
