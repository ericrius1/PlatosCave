FW.Meteor = class Meteor
  rnd = FW.rnd
  constructor: ()->

    @meteors = []
    @meteorGroup = new ShaderParticleGroup
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    @meteorVisibleDistance = 3000
    for i in [1..5]
      @newMeteor()
    FW.scene.add(@meteorGroup.mesh)
    @calcPositions()
    

  generateSpeed: (meteor)->
    meteor.speedX = rnd(0.01, 1)
    meteor.speedY = .005
    meteor.speedZ = rnd(0.01, 1)
    meteor.accelX = .01
    meteor.accelY = 0
    meteor.accelZ = .1
    meteor.dirX = rnd(-1, 1)
    meteor.dirY = -1
    meteor.dirZ = rnd(1, -1)


  newMeteor: ->
    colorStart = new THREE.Color()
    colorStart.setRGB(Math.random(),Math.random(),Math.random() )
    meteor = new THREE.Object3D()
    @generateSpeed meteor
    meteor.position = new THREE.Vector3(0, 2000, 0)
    colorEnd = new THREE.Color()
    colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    meteor.light = new THREE.PointLight(colorStart, 2, 1000)
    FW.scene.add(meteor.light)
    meteor.tailEmitter = new ShaderParticleEmitter
      position: meteor.position
      positionSpread: new THREE.Vector3(20, 20, 2)
      size: 200
      sizeSpread: 100
      acceleration: new THREE.Vector3(meteor.dirX, meteor.dirY, meteor.dirZ),
      accelerationSpread: new THREE.Vector3(.7, .7, .7),
      particlesPerSecond: 100
      colorStart: colorStart
      colorEnd: colorEnd
    @meteorGroup.addEmitter meteor.tailEmitter
    @meteors.push meteor
    
  calcPositions: ->
    for meteor in @meteors
      distance =  FW.camera.position.distanceTo(meteor.position)
      #meteor is off screen, respawn it somewhere
      if distance > @meteorVisibleDistance
        @generateSpeed meteor
        meteor.position = new THREE.Vector3(0, 1000, 0)

    setTimeout(=>
      @calcPositions()
    10000)
    

  tick: ->
    for meteor in @meteors
      meteor.speedX +=meteor.accelX
      meteor.speedY +=meteor.accelY
      meteor.speedZ +=meteor.accelZ
      meteor.translateX(meteor.speedX * meteor.dirX)
      meteor.translateY( meteor.speedY * meteor.dirY)
      meteor.translateZ(meteor.speedZ * meteor.dirZ)
      meteor.light.position = new THREE.Vector3().copy(meteor.position)
      meteor.tailEmitter.position = new THREE.Vector3().copy(meteor.position)
    @meteorGroup.tick(FW.globalTick)
    


