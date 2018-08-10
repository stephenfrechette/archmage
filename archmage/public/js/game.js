game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })

function preload () {
  game.stage.disableVisibilityChange = true;
  game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
  game.load.image('earth', 'assets/light_sand.png')
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
  game.load.audio('oof', ['assets/roblox-death-sound_1.mp3', 'roblox-death-sound_1.ogg'])
  game.load.audio('boss1a', ['assets/boss1a.mp3', 'assets/boss1a.ogg'])
  game.load.audio('boss1b', ['assets/boss1b.mp3', 'assets/boss1b.ogg'])
}

var socket // Socket connection

var land

var player
var enemies
var playerstuff

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

var boss1music = []

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
var fountaindata = []
var spear
var spearCheck = false
var spearxvel
var spearyvel
var speardata = []
var splitFireCheck = false
var skullCircle0
var skullCircle1
var skullCircles = 0
var skullrepeat
var waterSpearCheck
var inSkullCircle = false
var skullfire = []
var skullfireAngle = 0
var skullfireBody
var fireskullRipCheck = false
var whichSkull = 0
var swipe
var swipeCheck = false
var swipeCheck2 = false
var materialGained = false
var craftWarning
var craftCheck = false
var prevCraftCheck = false
var armor = 1
var craftMod = 1
var invulnframesCheck
var oof
var letter
var theLetter
var craftKey
var material = 1
var waterCheck = false

function create () {
  boss1music[0] = game.add.audio('boss1a')
  boss1music[1] = game.add.audio('boss1b')

  playerstuff = game.add.group()

  socket = io.connect()
  oof = game.add.audio('oof')
  game.world.setBounds(-800, -800, 600, 600)
  land = game.add.tileSprite(0, 0, 800, 600, 'earth')
  land.fixedToCamera = true
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
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
  enemies = []

  player.bringToTop()

  game.camera.follow(player)
  game.camera.deadzone = new Phaser.Rectangle(300, 300, 500, 300)
  game.camera.focusOnXY(0, 0)

  cursors = game.input.keyboard.createCursorKeys()
  setEventHandlers()

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
  socket.on('spearOn', spearOn)
  socket.on('spearOff', spearRemove)
  socket.on('fountainOn', fountainOn)
  socket.on('fountainOff', fountainCool)
}

function otherWaterfire (data) {
  if (playernum === 2 && gameStart === true) {
    waterfire.fire(enemies[0].player, data.x, data.y);
  }
}

function ripHealth () {
  if (invulnerable === false) {
    oof.play()
    health -= 1;
    console.log('health: ' + health)
    invulnerable = true
    setTimeout(vulnerable, 1500)
    player.alpha = .2
    invulnframesCheck = setInterval(invulnframes, 300)
  }
}

function invulnframes () {
  player.alpha = 1.2 - player.alpha
}

function vulnerable () {
  invulnerable = false
  player.alpha = 1
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
  boss1music[randmus].play()
  boss1music[randmus].volume = .2
}

function bossSpawn1() {
  player.angle = 0
  setTimeout(print3, 10000)
  setTimeout(print2, 11000)
  setTimeout(print1, 12000)
  setTimeout(bossSpawn2, 13000)
  socket.on('tree', tree)
}

function bossSpawn2() {
  console.log('TIME TO DIE')
  inPlay = true;
  bowser = game.add.sprite(-400, -800, 'bowser')
  bowser.scale.setTo(.1, .1)
  bowser.anchor.setTo(.5, 0)
  game.physics.arcade.enable(bowser, Phaser.Physics.ARCADE);
  armorbar = game.add.sprite(-400, -800, 'armorbar')
  armorbar.scale.setTo(.1, .01)
  gameStart = true
}

function tree(treeLoc) {
  if (playernum === 1) {
    treeWarning = game.add.sprite(treeLoc, -300, 'bowser');
    treeWarning.anchor.setTo(.5)
    treeWarning.scale.setTo(.05);
  }
}

function tree2(treeLoc) {
  if (playernum === 1) {
    treeWarning.destroy()
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
  inPlay = true
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
  if ((enemies[0].player.x < -400 && player.x > -400) || (enemies[0].player.x > -400 && player.x < -400)) {
    enemies[0].player.alpha = 0
  }
  skullrepeat = setInterval(skullCirclefunc, 3500)
}

function inSkullCirclefunc () {
  inSkullCircle = true
}

function skullCirclefunc () {
  if (skullCircles > 0) {
    game.physics.arcade.overlap(skullCircle0, player, inSkullCirclefunc, null, this);
    if (inSkullCircle === false) {
      ripHealth()
    }
    inSkullCircle = false
    skullCircle0.destroy()
  }
  skullCircles += 1
  if (player.x > -400) {
    var randomx = -200
    var randomy = -500
    while (randomx > -250 && randomx < -150 && randomy > -550 && randomy < -450) {
      randomx = Math.random() * 340 - 370
      randomy = Math.random() * 340 - 670
    }
  } else {
    var randomx = -600
    var randomy = -500
    while (randomx > -630 && randomx < -570 && randomy > -530 && randomy < -470) {
      randomx = Math.random() * 340 - 770
      randomy = Math.random() * 340 - 670
    }
  }
  skullCircle0 = game.add.sprite(randomx, randomy, 'greenarea')
  skullCircle0.scale.setTo(.1)
  skullCircle0.alpha = .5
  skullCircle0.anchor.setTo(.5, .5)
  game.physics.arcade.enable(skullCircle0, Phaser.Physics.ARCADE);
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
  waterCheck = false
  player.loadTexture('bluesquare', 0)
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
}

function hitBoss (boss, bullet) {
  if (playernum === 1) {
    socket.emit('hitBoss')
  }
  bullet.kill()
}

function ripbullet (splitFire, bullet) {
  bullet.kill()
}

function ripskullfire (splitFire, bullet) {
  bullet.kill()
}

function updateArmor (newArmor) {
  armor = newArmor
  armorbar.scale.setTo(.1 * armor / 16, .01)
  console.log('Armor: ' + armor)
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
    fireskull[0].alpha -= .1
    fireskullRipCheck = true
    setTimeout(fireskullRipChange, 1000)
  }
  if (fireskull[0].alpha < .05) {
    fireskull[0].destroy()
    for (var i = 0; i < 15; i++) {
      splitFire[i].destroy()
    }
    skullCircle0.destroy()
    clearInterval(skullrepeat)
    splitFireCheck = false
  }
}

function fireskullRipChange () {
  fireskullRipCheck = false
}

function endSwipe () {
  swipe.destroy()
  swipeCheck = false
}

function endSwipe2 () {
  swipeCheck2 = false
}

function materialGain () {
  if (materialGained === false) {
    materialGained = true
    craftCheck = true
    setTimeout(materialGain2, 500)
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
    setTimeout(materialGain4, 4000)
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

function update () {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemies[i].update()
      game.physics.arcade.collide(player, enemies[i].player)
    };
  };

  if (invulnerable === false) {
    //game.physics.arcade.overlap(tree, player.body, ripHealth, null, this);
    for (var i = 0; i < 20; i++) {
      game.physics.arcade.overlap(forwardFire[i], player, ripHealth, null, this);
    }
    for (var i = 0; i < 15; i++) {
      game.physics.arcade.overlap(splitFire[i], player, ripHealth, null, this);
    }
  }

  if (gameStart === true) {
    if (splitFireCheck === true) {
      for (var i = 0; i < 15; i++) {
        game.physics.arcade.overlap(waterfire.bullets, splitFire[i], ripbullet, null, this);
      }
      for (var i = 0; i < 4; i++) {
        skullfire[i].fireAngle = i*90 - 90 + skullfireAngle
        if (player.x > -400) {
          skullfire[i].fire(fireskull[0])
        } else {
          skullfire[i].fire(fireskull[1])
        }
        game.physics.arcade.overlap(skullfire[i].bullets, player, ripHealth, null, this);
      }
    }
    if (swipeCheck === true) {
      if (isTree === true) {
        game.physics.arcade.overlap(swipe, tree, materialGain, null, this);
      }
    }
    game.physics.arcade.overlap(waterfire.bullets, bowser, hitBoss, null, this);
    if (waterWallCheck1 === true) {
      for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 3; j++) {
          game.physics.arcade.overlap(waterWall[j], forwardFire[i], function(){ fireWallDestroy(i); }, null, this);
        }
      }
    }
    if (fountainCheck === true) {
      if (splitFireCheck === true) {
        game.physics.arcade.overlap(fountain, fireskull[0], fountainCool, null, this);
        game.physics.arcade.overlap(fountain, fireskull[1], fountainCool, null, this);
      }
    }
    if (waterSpearCheck === true) {
      if (splitFireCheck === true) {
        game.physics.arcade.overlap(spear, fireskull[whichSkull], ripFireskull, null, this);
      }
    }
  }

  if (isTree === true) {
    tree.y -= 12
  }

  if (forwardFirewallCheck === true) {
    for (var i = 0; i < 20; i++) {
      forwardFire[i].y += 10
    }
  }

  if (inPlay === true) {
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        if (playernum === 1) {
          //player.angle = 90;
          player.x -= 3;
        } else {
          //player.angle = -90;
          player.x -= 4;
        };
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      if (playernum === 1) {
        //player.angle = 90;
        player.x += 3;
      } else {
        //player.angle = -90;
        player.x += 4;
      };
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      if (playernum === 1) {
        //player.angle = 90;
        player.y -= 3;
      } else {
        //player.angle = -90;
        player.y -= 4;
      };
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      if (playernum === 1) {
        //player.angle = 90;
        player.y += 3;
      } else {
        //player.angle = -90;
        player.y += 4;
      };
    };

    if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
      if (playernum === 1 && waterCheck === false) {
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
    }

    if (game.input.activePointer.leftButton.isDown) {
      if (playernum === 1) {
        waterfire.fire(player, game.input.activePointer.worldX, game.input.activePointer.worldY);
        socket.emit('waterfire', {x: game.input.activePointer.worldX, y: game.input.activePointer.worldY})
      } else if (playernum === 2 && swipeCheck2 === false) {
        swipe = player.addChild(game.make.sprite(0, 32, 'swipe'))
        swipe.anchor.setTo(.5, .5)
        game.physics.arcade.enable(swipe, Phaser.Physics.ARCADE);
        swipeCheck = true
        swipeCheck2 = true
        setTimeout(endSwipe, 500)
        setTimeout(endSwipe2, 1000)
      }
    }

    if (spearCheck === true) {
      spear.x += spearxvel * 10
      spear.y += spearyvel * 10
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
        setTimeout(waterWallOff, 1000)
        setTimeout(waterWallCool, 6000)
      } else if (playernum === 2 && spearCheck === false) {
        spear = game.add.sprite(player.x, player.y, 'bowser')
        spear.scale.setTo(.025)
        spear.anchor.setTo(.5, .5)
        game.physics.arcade.enable(spear, Phaser.Physics.ARCADE);
        spearCheck = true
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
