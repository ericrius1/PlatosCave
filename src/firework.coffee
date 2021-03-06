FW.Firework = class Firework
  rnd = FW.rnd
  constructor: ()->
    #create a few different emmitters and add to pool
    @lightIndex = 0
    @fwSpread = 200
    @fwAge = 11
    @lightRange = 10000
    @startLightIntensity = 10
    @lightDimmingFactor = 2/@fwAge

    @explodeSound = new Audio('./assets/explosion.mp3');
    @explodeSound.volume = FW.sfxVolume * 0.6
    @crackleSound = new Audio('./assets/crackle.mp3');
    @crackleSound.volume = FW.sfxVolume * 0.2
    @explodeSound.load()
    @crackleSound.load()
    @lights = []
    
    @particleGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      blending: THREE.AdditiveBlending,
      maxAge: @fwAge
    });

    for i in [1..11]
      @particleGroup.addPool( 1, @generateEmitter(), false )     
    FW.scene.add(@particleGroup.mesh)

  generateEmitter : ->
    colorStart = new THREE.Color()
    colorStart.setRGB(Math.random(), Math.random(),Math.random())
    light = new THREE.PointLight(colorStart, 0.0, @lightRange)
    FW.scene.add(light)
    @lights.push(light)
    emitterSettings = 
      positionSpread: new THREE.Vector3 10, 10, 10
      velocitySpread: new THREE.Vector3 50, 50, 50
      accelerationSpread: new THREE.Vector3 10, 10, 10
      size: 200
      sizeSpread: 100
      colorStart: colorStart,
      colorSpread: new THREE.Vector3(.2, .2, .2)
      particlesPerSecond: 500
      alive: 0,  
      emitterDuration: 1.0

  createExplosion: (origPos, newPos = origPos, count=0)->
  
    emitter = @particleGroup.triggerPoolEmitter(1, newPos)
    light = @lights[@lightIndex++]
    if @lightIndex is @lights.length
      @lightIndex = 0
    light.position.set(newPos.x, newPos.y, newPos.z)
    light.intensity = @startLightIntensity
    if count < FW.numExplosionsPerRocket
      setTimeout =>
        #set timeout for speed of sound delay!
        if soundOn
          setTimeout(()=>
            @explodeSound.load()
            @explodeSound.play()
            setTimeout(()=>
              @crackleSound.load()
              @crackleSound.play()
            100)
          100)
        count++
        newPos = new THREE.Vector3(rnd(origPos.x - @fwSpread, origPos.x+@fwSpread), rnd(origPos.y - @fwSpread, origPos.y+@fwSpread), rnd(origPos.z - @fwSpread, origPos.z+@fwSpread))
        @createExplosion(origPos, newPos, count++)
      ,rnd(10, 300)

    
  tick: ->
    @particleGroup.tick(FW.globalTick)
    for light in @lights
      if light.intensity > 0
        light.intensity -=@lightDimmingFactor


