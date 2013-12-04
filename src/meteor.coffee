FW.Meteor = class Meteor
  rnd = FW.rnd
  constructor: ()->
    @speed = 1
    @acceleration = 0.01
    @dirX = rnd(-1, 1)
    @dirY = rnd(-1, 1)
    @dirZ = rnd(-1, 1)
    @startingPos = new THREE.Vector3(-992, 820, 1165)
    #create a few different emmitters and add to pool

    

    @meteorTail = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 15
    });

    sphereGeo = new THREE.SphereGeometry(5, 5, 5 )
    @meteorHead = new THREE.Mesh(sphereGeo, FW.rocketMat)
    @meteorHead.position.copy @startingPos
    @newMeteor()
    FW.scene.add(@meteorHead)
    FW.scene.add(@meteorTail.mesh)

    @light = new THREE.PointLight(0xefefef, 2, 2000)
    FW.scene.add(@light)

  newMeteor: ->
    @emitter = new ShaderParticleEmitter
      position: @meteorHead.position
      size: rnd(0.01, 1.3),
      sizeSpread: rnd(0.1, 1.0),
      acceleration: new THREE.Vector3(-@dirX, -@dirY, -@dirZ),
      accelerationSpread: new THREE.Vector3(.2, .2, .2),
      particlesPerSecond: 1000
      opacityEnd: 0.5
    
    @meteorTail.addEmitter @emitter
    @calcDistance()
    
  calcDistance: ->
    setInterval(=>
      distance =  FW.camera.position.distanceTo(@meteorHead.position)
      #meteor is off screen, respawn it somewhere
      if distance > FW.camera.far/4
        @speed = 1
        @meteorHead.position.copy @startingPos
    1000)
    

    
  tick: ->
    @speed += @acceleration
    @meteorHead.translateX(@speed * @dirZ)
    @meteorHead.translateY(@speed * @dirY)
    @emitter.position = new THREE.Vector3().copy(@meteorHead.position)
    @light.position = new THREE.Vector3().copy(@meteorHead.position)
    @meteorTail.tick(0.16)
    


