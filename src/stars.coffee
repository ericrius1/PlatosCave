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
    @changeColor()

  generateStars: ->
    @starEmitter = new ShaderParticleEmitter
      type: 'sphere'
      radius: 90000
      speed: .1
      size: 10000
      sizeSpread: 5000
      particlesPerSecond: 2000
      opacityStart: 0
      opacityMiddle: 1
      opacityEnd: 0
      colorStart: @colorStart
      colorSpread: new THREE.Vector3(rnd(.1, .5), rnd(.1, .5), rnd(.1, .5))
      colorEnd: @colorEnd
    
    @starGroup.addEmitter @starEmitter
  
  changeColor: =>
    setTimeout(=>
      console.log(_this)
    5000)
   
    
  tick: ->
    @starGroup.tick(0.16)
    @starEmitter.size += 100
    


