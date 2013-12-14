FW.LightTower = class LightTower
  rnd = FW.rnd
  constructor: ()->

    @towerGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 111
    });

    @colorEnd = new THREE.Color()
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    @generateTower()
    FW.scene.add(@towerGroup.mesh)

  generateTower: ->
    colorStart = new THREE.Color()
    colorStart.setRGB .8, .1, .9
    @towerEmitter = new ShaderParticleEmitter
      size: 5000
      position: new THREE.Vector3(-2000, 0, -20000)
      positionSpread: new THREE.Vector3(100, 0, 100)
      colorStart: colorStart
      velocity: new THREE.Vector3(0, 5, 0)
      acceleration: new THREE.Vector3(0, 1.0, 0)
      accelerationSpread: new THREE.Vector3(0, .01, 0)
     
    
    @towerGroup.addEmitter @towerEmitter
  
    
  tick: ->
    @towerGroup.tick(FW.globalTick)
    


