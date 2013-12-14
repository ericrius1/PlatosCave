FW.Stars = class Stars
  rnd = FW.rnd
  constructor: ()->

    @colorStart = new THREE.Color()
    @colorStart.setRGB(Math.random(),Math.random(),Math.random() )

    @starGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: 100
    });

    @colorEnd = new THREE.Color()
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    @generateStars()
    FW.scene.add(@starGroup.mesh)

  generateStars: ->
    @starEmitter = new ShaderParticleEmitter
      type: 'sphere'
      radius: 50000
      speed: .1
      size: 7000
      sizeSpread: 4000
      particlesPerSecond: rnd(500, 1100)
      opacityStart: 0
      opacityMiddle: 1
      opacityEnd: 0
      colorStart: @colorStart
      colorSpread: new THREE.Vector3(rnd(.1, .5), rnd(.1, .5), rnd(.1, .5))
      colorEnd: @colorEnd
    
    @starGroup.addEmitter @starEmitter
  

   
    
  tick: ->
    @starGroup.tick(0.16)
    


