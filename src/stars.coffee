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
    @createStars()
    FW.scene.add(@starGroup.mesh)

  createStars: ->
    @starEmitter = new ShaderParticleEmitter
      type: 'sphere'
      radius: 100000
      speed: .1
      position: new THREE.Vector3().copy FW.camera.position
      size: 30000
      sizeSpread: 300
      particlesPerSecond: 300
      opacityStart: 0
      opacityMiddle: 1
      opacityEnd: 0
      colorStart: @colorStart
      colorSpread: new THREE.Vector3(.2, .2, .2)
      colorEnd: @colorEnd
    
    @starGroup.addEmitter @starEmitter
 
    
  tick: ->
    # @starGroup.tick(0.16)
    


