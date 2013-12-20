FW.LightCity = class LightCity
  rnd = FW.rnd
  constructor: ()->

    @cityGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png')
      maxAge: 111
    });

    @colorEnd = new THREE.Color()
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    for i in [1..100]
      @cityGroup.addPool 1, @generateBuilding(), false
    FW.scene.add(@cityGroup.mesh)

  generateBuilding: ->
    colorStart = new THREE.Color()
    colorStart.setRGB rnd(0, .5), rnd(0.01, .1), rnd(0.01, 0.1)
    colorEnd = new THREE.Color()
    colorEnd.setRGB rnd(0, 0.1), rnd(0.5, 1), rnd(0, 0.1)
    cityEmitter = new ShaderParticleEmitter
      size: 3000
      colorStart: colorStart
      colorEnd: colorEnd
      velocity: new THREE.Vector3(0, 100, 0)
      acceleration: new THREE.Vector3(rnd(-1, 1), 0, rnd(-1, 1))
      particlesPerSecond: 1
      opacityEnd: 1
      alive: 0

  activate: ->
    for i in [1..100]
      @cityGroup.triggerPoolEmitter(1, new THREE.Vector3(rnd(1000, 50000), 0, rnd(1000, 50000)))
   
  
    
  tick: ->
    @cityGroup.tick(FW.globalTick)
    


