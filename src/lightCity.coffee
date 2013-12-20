FW.LightCity = class LightCity
  rnd = FW.rnd
  constructor: ()->

    @cityGroup = new ShaderParticleGroup({
      texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png')
      maxAge: 111
    });

    @colorEnd = new THREE.Color()
    @colorEnd.setRGB(Math.random(),Math.random(),Math.random() )
    for i in [1..1000]
      @cityGroup.addPool 1, @generateBuilding(), false
    FW.scene.add(@cityGroup.mesh)

  generateBuilding: ->
    colorStart = new THREE.Color()
    colorStart.setRGB Math.random(), Math.random(), Math.random()
    colorEnd = new THREE.Color()
    colorEnd.setRGB Math.random(), Math.random(), Math.random()
    cityEmitter = new ShaderParticleEmitter
      size: rnd(2500, 6000)
      colorStart: colorStart
      colorEnd: colorEnd
      velocity: new THREE.Vector3(0, 111, 0)
      acceleration: new THREE.Vector3(rnd(-0.8, 0.8), 0, rnd(-0.8, 0.8))
      particlesPerSecond: 1
      alive: 0

  activate: ->
    for i in [1..100]
      @cityGroup.triggerPoolEmitter(1, new THREE.Vector3(rnd(-100000, 20000), rnd(-300, -10), rnd(-40000, -100000)))
   
  
    
  tick: ->
    @cityGroup.tick(FW.globalTick)
    


