FW.LightTower = class LightTower
  rnd = FW.rnd
  constructor: ()->

    @towerGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png')
      maxAge: 111
    });

    @colorEnd = new THREE.Color()
    @position = new THREE.Vector3 -5000, 100, -30000
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    @generateTower()
    FW.scene.add(@towerGroup.mesh)

  generateTower: ->
    colorStart = new THREE.Color()
    colorStart.setRGB .8, .1, .9
    @towerEmitter = new ShaderParticleEmitter
      size: 10000
      position: @position
      positionSpread: new THREE.Vector3(100, 0, 100)
      colorStart: colorStart
      velocity: new THREE.Vector3(0, 5, 0)
      acceleration: new THREE.Vector3(0, 4.8, 0)
      accelerationSpread: new THREE.Vector3(0, .03, 0)
      particlesPerSecond: 1
     
    
    @towerGroup.addEmitter @towerEmitter
  
    
  tick: ->
    @towerGroup.tick(FW.globalTick)
    


