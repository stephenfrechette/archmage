game = new Phaser.Game(800, 600, Phaser.AUTO, '')
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
game.state.add('game1', game1, false)
game.state.add('Over', Over, false)
game.state.start('game1')

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
  game.load.spritesheet('yellowdamagebar', 'assets/yellow.jpg', 10, 10)
  game.load.spritesheet('greendamagebar', 'assets/green.png', 30, 90)
  game.load.spritesheet('pinkdamagebar', 'assets/pink.jpg', 15, 100)
  game.load.spritesheet('laserWarning', 'assets/red.jpg', 3, 1600)
  game.load.spritesheet('reallaser', 'assets/orange.jpg', 25, 1600)
  game.load.spritesheet('redTell', 'assets/red.jpg', 770, 770)
  game.load.spritesheet('orangecircle', 'assets/orangecircle.png')
  game.load.audio('oof', ['assets/roblox-death-sound_1.mp3', 'roblox-death-sound_1.ogg'])
  game.load.audio('boss1a', ['assets/boss1a.mp3', 'assets/boss1a.ogg'])
  game.load.audio('boss1b', ['assets/boss1b.mp3', 'assets/boss1b.ogg'])
}

var pokemon = true


var deltaTime
var elapsedMS
var fps

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

var waterfire

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
var redareaCheck = false
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
var skullCircles = false
var skullrepeat
var skullrepeat2
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
var singleSkullCheck = false
var splitFire2 = []
var singleskullbar
var singleskullComboCheck = false
var singleskullComboCheck2 = 0
var updateSingleskullBar
var updateskullbarnum = 1
var skulldir = 'down'
var mainPhase = false
var damageTime = false
var yellowdamagebar
var greendamagebar
var pinkdamagebar
var damagebarCheck
var realityPower = 0
var realityCheck = false
var laser = []
var laserCheck = [false, false, false, false, false]
var laserCheck2 = false
var laserline = []
var lasernum = 0
var laserTell
var timebomb = []
var timebombCheck = false
var timebombTime = 0

var otherPlayer = []

var gmovr

var retryCheck = false

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

function create () {
  health = 3
  invulnerable = false

  currentSpeed = 0

  boss1music = []

  inPlay = true
  gameStart = false

  repeatCheck = false

  isTree = false
  forwardFire = []
  forwardFirewallCheck = false
  splitFire = []
  fireskull = []
  waterWall = []
  waterWallCheck1 = false
  waterWallCheck2 = false
  greenareaCheck = false
  redareaCheck = false
  fountainCheck = false
  fountaindata = []
  spearCheck = false
  speardata = []
  splitFireCheck = false
  skullCircles = false
  inSkullCircle = false
  skullfire = []
  skullfireAngle = 0
  fireskullRipCheck = false
  whichSkull = 0
  swipeCheck = false
  swipeCheck2 = false
  materialGained = false
  craftCheck = false
  prevCraftCheck = false
  armor = 1
  craftMod = 1
  material = 1
  waterCheck = false
  singleSkullCheck = false
  singleskullComboCheck = false
  singleskullComboCheck2 = 0
  updateskullbarnum = 1
  skulldir = 'down'
  mainPhase = false
  damageTime = false
  realityPower = 0
  realityCheck = false
  laser = []
  laserCheck = [false, false, false, false, false]
  laserCheck2 = false
  laserline = []
  lasernum = 0
  timebomb = []
  timebombCheck = false
  timebombTime = 0

  playerstuff = game.add.group()
  bossstuff = game.add.group()

  boss1music[0] = game.add.audio('boss1a')
  boss1music[1] = game.add.audio('boss1b')
  oof = game.add.audio('oof')
  enemies = []

  land = game.add.tileSprite(0, 0, 800, 600, 'earth')
  land.fixedToCamera = true

  if (retryCheck === false) {
    game.world.setBounds(-800, -800, 600, 600)
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    socket = io.connect()
    setEventHandlers()
  } else {
    enemies.push(new RemotePlayer(otherPlayer[0], game, player, otherPlayer[1], otherPlayer[2], otherPlayer[3], playernum))
    if (playernum === 1) {
      socket.emit('new game')
    }
  }

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
  socket.on('fountainOff2', fountainCool2)
  socket.on('rip3', ripFireskull4)
  socket.on('ripGame', gameOver)
  socket.on('laser0', laser0)
  socket.on('laser', laser1)
  socket.on('laser2', laser2)
  socket.on('laser3', laser3)
  socket.on('timebomb', timebomb1)
  socket.on('timebomb2', timebomb2)
  socket.on('retryready', retryready)
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
  console.log('ripHealth')
  if (invulnerable === false) {
    health -= 1;
    if (health > 3.1) {
      socket.emit('gameOver')
    } else {
      oof.play()
      console.log('health: ' + health)
      invulnerable = true
      timeoutmanager.setTimeout(vulnerable, 1500)
      player.alpha = .2
      invulnframesCheck = setInterval(invulnframes, 300)
    }
  }
}

function invulnframes () {
  player.alpha = 1.2 - player.alpha
}

function vulnerable () {
  console.log('vulnerable')
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
  timeoutmanager.setTimeout(print3, 10000)
  timeoutmanager.setTimeout(print2, 11000)
  timeoutmanager.setTimeout(print1, 12000)
  timeoutmanager.setTimeout(bossSpawn2, 13000)
  socket.on('tree', tree)
}

function bossSpawn2() {
  console.log('TIME TO DIE')
  player.angle = 0
  inPlay = true;
  bowser = game.add.sprite(-400, -800, 'bowser')
  bowser.scale.setTo(.1, .1)
  bowser.anchor.setTo(.5, 0)
  game.physics.arcade.enable(bowser, Phaser.Physics.ARCADE);
  armorbar = game.add.sprite(-400, -800, 'armorbar')
  armorbar.scale.setTo(.1, .01)
  gameStart = true
  mainPhase = true
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

function laser0 () {
  laserTell = bowser.addChild(game.make.sprite(0, 170, 'redTell'))
  laserTell.anchor.setTo(.5, .5)
}

function laser1 (data) {
  if (playernum === data) {
    laserline[lasernum] = new Phaser.Line(bowser.x, bowser.y, player.x, player.y)
    laserx = bowser.x - player.x
    lasery = bowser.y - player.y
    laserAngle = Math.atan(laserx / lasery)
  } else {
    laserline[lasernum] = new Phaser.Line(bowser.x, bowser.y, enemies[0].player.x, enemies[0].player.y)
    laserx = bowser.x - enemies[0].player.x
    lasery = bowser.y - enemies[0].player.y
    laserAngle = Math.atan(laserx / lasery)
  }
  laser[lasernum] = game.add.sprite(bowser.x, bowser.y, 'laserWarning')
  laser[lasernum].anchor.setTo(.5, .5)
  laser[lasernum].angle = 180 - (laserAngle * 180 / Math.PI)
  var lasernum2 = lasernum
  lasernum += 1
  timeoutmanager.setTimeout(function(){ laser2(lasernum2); }, 400)
  if (lasernum < 5) {
    timeoutmanager.setTimeout(function(){ laser1(data); }, 200)
  }
}

function laser2 (i) {
  if (inPlay === true) {
    laser[i].loadTexture('reallaser')
    laserCheck[i] = true
  }
}

function laser3 () {
  for (var i = 0; i < 5; i++) {
    laserCheck[i] = false
    laser[i].destroy()
    laserCheck2 = false
  }
  lasernum = 0
  laserTell.destroy()
}

function timebomb1 () {
  timebomb[0] = player.addChild(game.make.sprite(0, 0, 'orangecircle'))
  timebomb[1] = enemies[0].player.addChild(game.make.sprite(0, 0, 'orangecircle'))
  timebomb[2] = player.addChild(game.make.sprite(0, 0, 'orangecircle'))
  timebomb[3] = enemies[0].player.addChild(game.make.sprite(0, 0, 'orangecircle'))
  for (var i = 0; i < 2; i++) {
    timebomb[i].scale.setTo(2)
    timebomb[i].alpha = .25
    timebomb[i].anchor.setTo(.5, .5)
  }
  for (var i = 2; i < 4; i++) {
    timebomb[i].scale.setTo(.0001)
    timebomb[i].alpha = .5
    timebomb[i].anchor.setTo(.5, .5)
  }
  timebombCheck = true
}

function timebomb2 () {
  for (var i = 0; i < 4; i++) {
    timebomb[i].destroy()
  }
  timebombCheck = false
  timebombTime = 0
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
  skullrepeat = setInterval(skullCirclefunc, 3500)
  timeoutmanager.setTimeout(realityAct, 3500)
}

function inSkullCirclefunc () {
  inSkullCircle = true
}

function skullCirclefunc () {
  if (skullCircles === true) {
    game.physics.arcade.overlap(skullCircle0, player, inSkullCirclefunc, null, this);
    if (inSkullCircle === false) {
      ripHealth()
    }
    inSkullCircle = false
    skullCircle0.destroy()
  }
  skullCircles = true
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
  skullCircle0 = game.add.sprite(randomx, randomy, 'greenarea')
  skullCircle0.scale.setTo(.1)
  skullCircle0.alpha = .5
  skullCircle0.anchor.setTo(.5, .5)
  game.physics.arcade.enable(skullCircle0, Phaser.Physics.ARCADE);
}

function skullCirclefunc2 () {
  if (playernum === 2) {
    if (skullCircles === true) {
      game.physics.arcade.overlap(skullCircle0, player, inSkullCirclefunc, null, this);
      if (inSkullCircle === false) {
        ripHealth()
      }
      inSkullCircle = false
      skullCircle0.destroy()
    }
    skullCircles = true
    var randomx = 0
    var randomy = 0
    while ((randomx + 400) * (randomx + 400) + (randomy + 500) * (randomy + 500) > 180 * 180)  {
      randomx = Math.random() * 400 - 600
      randomy = Math.random() * 400 - 700
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
  otherPlayer[0] = data.id
  otherPlayer[1] = data.x
  otherPlayer[2] = data.y
  otherPlayer[3] = data.angle
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
    fireskull[0].alpha -= .2
    fireskullRipCheck = true
    timeoutmanager.setTimeout(fireskullRipChange, 1000)
  }
  if (fireskull[0].alpha < .05) {
    timeoutmanager.setTimeout(ripFireskull1, 3000)
    fireskull[0].destroy()
    for (var i = 0; i < 15; i++) {
      splitFire[i].destroy()
    }
    skullCircle0.destroy()
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
    fireskull[1].x = -100
    fireskull[1].y = -500
    if (playernum === 2) {
      fireskull[1].alpha = 0
    }
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
    updateSingleskullBar = intervalmanager.setInterval(updateSkullBar, 1000)
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
  skullCircle0.destroy()
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
  greenarea.tint = 0xff00ff;
}

function update () {
  var prevdeltaTime = deltaTime
  deltaTime = game.time.elapsed * 60 / 1000

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
      if (laserCheck[i] === true) {
        if (laserCheck2 === false) {
          laserCheck2 = Phaser.Line.intersectsRectangle(laserline[i], player)
          if (laserCheck2 === true && invulnerable === false) {
            console.log('rip')
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
    if (splitFireCheck === true) {
      for (var i = 0; i < 15; i++) {
        game.physics.arcade.overlap(waterfire.bullets, splitFire[i], ripbullet, null, this);
      }
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
    if (damagebarCheck === true) {
      pinkdamagebar.x += 10
      if (game.input.activePointer.leftButton.isDown) {
        damagebarCheck = false
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
    if (waterSpearCheck === true) {
      if (splitFireCheck === true) {
        game.physics.arcade.overlap(spear, fireskull[whichSkull], ripFireskull, null, this);
      }
    }
  }

  if (isTree === true) {
    tree.y -= 14 * deltaTime;
  }

  if (timebombCheck === true) {
    timebombTime += game.time.elapsed
    for (var i = 2; i < 4; i++) {
      timebomb[i].scale.setTo(timebombTime / 1000)
    }
  }

  if (forwardFirewallCheck === true) {
    for (var i = 0; i < 20; i++) {
      forwardFire[i].y += 10 * deltaTime;
    }
  }

  if (inPlay === true) {
    if (greenareaCheck === true) {
      redareaCheck = false
      greenarea.tint = 0xFFFFFF
      game.physics.arcade.overlap(enemies[0].player, greenarea, changeredarea, null, this);
      if (splitFireCheck === true) {
        game.physics.arcade.overlap(fireskull[0], greenarea, changeredarea, null, this);
        game.physics.arcade.overlap(fireskull[1], greenarea, changeredarea, null, this);
      }
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

    if (game.input.activePointer.leftButton.isDown) {
      if (realityCheck === true && Math.abs(game.input.activePointer.worldX - realityPoint.x) < 6 && Math.abs(game.input.activePointer.worldY - realityPoint.y) < 6) {
        realityPoint.destroy()
        realityPower += 1
        if (realityPower < 9.5) {
          realityAct()
        }
      } else if (playernum === 1) {
        waterfire.fire(player, game.input.activePointer.worldX, game.input.activePointer.worldY);
        socket.emit('waterfire', {x: game.input.activePointer.worldX, y: game.input.activePointer.worldY})
      } else if (playernum === 2 && swipeCheck2 === false) {
        swipe = player.addChild(game.make.sprite(0, 32, 'swipe'))
        swipe.anchor.setTo(.5, .5)
        game.physics.arcade.enable(swipe, Phaser.Physics.ARCADE);
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
      if (playernum === 2 && spearCheck === false && realityPower > 9.5) {
        spear = game.add.sprite(player.x, player.y, 'bowser')
        spear.scale.setTo(.025)
        spear.anchor.setTo(.5, .5)
        game.physics.arcade.enable(spear, Phaser.Physics.ARCADE);
        spearCheck = true
        realityPower = 0
        realityAct()
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
      if (playernum === 1 && waterCheck === false && realityPower > 9.5) {
        if (greenareaCheck === false) {
          greenarea = game.add.sprite(game.input.activePointer.worldX, game.input.activePointer.worldY, 'greenarea')
          greenarea.scale.setTo(.1)
          greenarea.alpha = .2
          greenarea.anchor.setTo(.5)
          player.body.setSize(24, 24, 14, 14)
          game.physics.arcade.enable(greenarea, Phaser.Physics.ARCADE);
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
      realityPower = 0
      realityAct()
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

  land.tilePosition.x = -game.camera.x
  land.tilePosition.y = -game.camera.y

  socket.emit('move player', { x: player.x, y: player.y, angle: player.angle })
}

function render () {
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
  boss1music[0].destroy()
  boss1music[1].destroy()
  oof.destroy()
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
