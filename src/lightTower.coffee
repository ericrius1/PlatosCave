FW.LightTower = class LightTower
  rnd = FW.rnd
  constructor: ()->

    @towerGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 100
    });

    @colorEnd = new THREE.Color()
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    @generateTower()
    FW.scene.add(@towerGroup.mesh)

  generateTower: ->
    colorStart = new THREE.Color()
    colorStart.setRGB .8, .1, .9
    @towerEmitter = new ShaderParticleEmitter
      colorStart: colorStart
     
    
    @towerGroup.addEmitter @towerEmitter
  
    
  tick: ->
    @towerGroup.tick(FW.globalTick)
    


