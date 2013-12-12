#handle rocket stuff
FW.Rockets = class Rockets
  rnd = FW.rnd
  constructor: ()->
    @launching = false
    rnd = FW.rnd
    @rockets = []
    @launchSound = new Audio('./assets/launch.mp3');
    @launchSound.volume = FW.sfxVolume * 0.5

    @color = new THREE.Color()
    @color.setRGB(200, 10, 0)


    @firework = new FW.Firework(@color)

    @projector = new THREE.Projector()
    @launchSpeed = 5
    @explosionDelay = 100
    @shootDirection = new THREE.Vector3()
    @rocketMat = FW.rocketMat



    @rocketGeo = new THREE.CylinderGeometry(.1, 1, 1);

  explode: (rocket)->
    FW.scene.remove(rocket)
    @rockets.splice(@rockets.indexOf(rocket), 1) 
    @firework.createExplosion(rocket.position)



  launchRocket: ()->
    FW.numExplosionsPerRocket = rnd(1, 5)
    if @launching
      return
    @launching = true
    @launchSound.load();
    rocket = new THREE.Mesh(@rocketGeo, @rocketMat)
    rocket.position.set(FW.camera.position.x, FW.camera.position.y, FW.camera.position.z)
    vector = new THREE.Vector3()
    vector.set(0,0,1)
    @projector.unprojectVector(vector, FW.camera)
    ray = new THREE.Ray(FW.camera.position, vector.sub(FW.camera.position).normalize() );
    FW.scene.add(rocket)
    rocket.shootDirection = new THREE.Vector3()
    rocket.shootDirection.x = ray.direction.x;
    rocket.shootDirection.y = ray.direction.y;
    rocket.shootDirection.z = ray.direction.z;
    rocket.launchSpeedY = rnd(2, 5)
    rocket.translateX(rocket.shootDirection.x)
    rocket.translateY(rocket.shootDirection.y)
    rocket.translateZ(rocket.shootDirection.z)
    if soundOn
        @launchSound.play();
    @rockets.push(rocket)
    setTimeout(()=>
      @explode(rocket)
      @launching = false
      @explosionDelay = rnd(1000, 1400)
    @explosionDelay)
  update: ()->
    @updateRocket rocket for rocket in @rockets
    @firework.tick()

  updateRocket: (rocket)->
    rocket.translateX(@launchSpeed * rocket.shootDirection.x)
    rocket.translateY( @launchSpeed * rocket.shootDirection.y)
    rocket.translateZ(@launchSpeed * rocket.shootDirection.z)
    rocket.translateY(rocket.launchSpeedY)
    rocket.launchSpeedY -= .05

