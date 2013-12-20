
window.windowHalfX = window.innerWidth / 2;
window.windowHalfY = window.innerHeight / 2;
rnd = FW.rnd
FW.World = class World
  constructor : ->
    @textureCounter = 0
    @animDelta = 0
    @animDeltaDir = 1
    @lightVal = .16
    @lightDir = 0
    FW.clock = new THREE.Clock()
    @updateNoise = true
    @animateTerrain = false
    @mlib = {}
    @MARGIN = 10
    @SCREEN_WIDTH = window.innerWidth
    @SCREEN_HEIGHT = window.innerHeight - 2 * @MARGIN
    @camFar = 200000
    @width = 150000
    @height = 150000
    @startingY = 40
    @rippleFactor = rnd(60, 300)
    window.mouseX = 10000
    window.mouseY = 10000
    @slowUpdateInterval = 1000
    @noLightCity = true

    # CAMERA
    FW.camera = new THREE.PerspectiveCamera(55.0, @SCREEN_WIDTH / @SCREEN_HEIGHT, 1, @camFar)
    FW.camera.position.set  0, @startingY, 0
    FW.camera.lookAt new THREE.Vector3 0, 40, 0
    
    #CONTROLS
    @controls = new THREE.FlyControls(FW.camera)
    @controls.movementSpeed = 600;
    @controls.rollSpeed =  Math.PI / 8;
    if FW.development is true
      @controls.pitchEnabled = true
      @controls.flyEnabled = true
      # @controls.mouseMove = true

    #STATS
    if FW.development is true
      @stats = new Stats()
      @stats.domElement.style.position = 'absolute';
      @stats.domElement.style.left = '0px';
      @stats.domElement.style.top = '0px';
      document.body.appendChild(@stats.domElement);
    

    # SCENE 
    FW.scene = new THREE.Scene()

    
    # RENDERER
    FW.Renderer = new THREE.WebGLRenderer()
    FW.Renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    document.body.appendChild FW.Renderer.domElement
    
    #FUN
    @groundControl = new FW.Rockets()
    @meteor = new FW.Meteor()
    @stars = new FW.Stars()
    @lightTower = new FW.LightTower()
    @lightCity = new FW.LightCity()
    FW.birds = new FW.Birds()
    
    # LIGHTS
    directionalLight = new THREE.DirectionalLight 0xff0000, rnd(0.5, 1.5)
    randColor = Math.floor(Math.random()*16777215);
    console.log randColor
    directionalLight.color.setHex(randColor)
    directionalLight.position.set( 0, 6000, 0 )
    FW.scene.add( directionalLight )


    #SCREEN
    screenGeo = new THREE.PlaneGeometry(200, 100, 10, 10)
    screenMat = new THREE.MeshBasicMaterial map: THREE.ImageUtils.loadTexture('assets/sagan.jpg'), side: THREE.DoubleSide
    @screen = new THREE.Mesh(screenGeo, screenMat)
    @screen.position.set(0,  -50, -200)

    FW.scene.add @screen

    #TERRAIN
    @loadTerrain new THREE.Vector3()
    for i in [1..4]
      @loadTerrain new THREE.Vector3(rnd(-@width/5, @width/5), 0, rnd(-@height/5, @height/5)) 

    #WATER
    waterNormals = new THREE.ImageUtils.loadTexture './assets/waternormals.jpg'
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    @water = new THREE.Water FW.Renderer, FW.camera, FW.scene,
      textureWidth: 512
      textureHeight: 512
      waterNormals: waterNormals
      alpha: 0.99
      waterColor: 0x001e0f
      distortionScale: 50

    aMeshMirror = new THREE.Mesh(
      new THREE.PlaneGeometry @width, @height, 50, 50
      @water.material
    )
    aMeshMirror.add @water
    aMeshMirror.rotation.x = -Math.PI * 0.5
    FW.scene.add aMeshMirror

    


    # EVENTS
    window.addEventListener "resize", (=>
      @onWindowResize()
    ), false

    @slowUpdate()

  

  loadTerrain: (position)->
    parameters = 
      alea: RAND_MT,
      generator: PN_GENERATOR,
      width: rnd 1000, 2000
      height: rnd 1000, 2000
      widthSegments: 100
      heightSegments: 100
      depth: rnd 500, 3000
      param: 4,
      filterparam: 1
      filter: [ CIRCLE_FILTER ]
      postgen: [ MOUNTAINS_COLORS ]
      effect: [ DESTRUCTURE_EFFECT ]

    terrainGeo = TERRAINGEN.Get(parameters)
    terrainMaterial = new THREE.MeshPhongMaterial vertexColors: THREE.VertexColors, shading: THREE.FlatShading, side: THREE.DoubleSide 
    terrain = new THREE.Mesh terrainGeo, terrainMaterial
    terrain.position = position
    FW.scene.add terrain
  onWindowResize : (event) ->
    @SCREEN_WIDTH = window.innerWidth
    @SCREEN_HEIGHT = window.innerHeight - 2 * @MARGIN
    FW.Renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    FW.camera.aspect = @SCREEN_WIDTH / @SCREEN_HEIGHT
    FW.camera.updateProjectionMatrix()

  animate : =>
    requestAnimationFrame @animate
    delta = FW.clock.getDelta()
    time = Date.now()
    @water.material.uniforms.time.value += 1.0 / 60
    @controls.update(delta)
    # Update Birds
    FW.birds.birdUniforms.time.value = performance.now()
    FW.birds.birdUniforms.delta.value = delta
    simulator.simulate delta
    FW.birds.birdUniforms.texturePosition.value = simulator.currentPosition
    FW.birds.birdUniforms.textureVelocity.value = simulator.currentVelocity
    simulator.velocityUniforms.predator.value.set( 0, 0, 0 );

    @render()
  render : ->
    @screen.position.y += .2
    if FW.development is true
      @stats.update()
    FW.camera.position.y = @startingY
    @groundControl.update()
    @meteor.tick()
    @stars.tick()
    @lightTower.tick()
    @lightCity.tick()
    @water.render()
    FW.Renderer.render( FW.scene, FW.camera );

  #For the things I don't want to run as often.. meteors, birds moving etc
  slowUpdate: ->
    setTimeout(=>
      @meteor.calcPositions()
      if @noLightCity
        distance = FW.camera.position.distanceTo(@lightTower.position)
        if distance < 1000
          @activateLightCity()
          @noLightCity = false
      @slowUpdate()
    @slowUpdateInterval)

  activateLightCity: ->
    @lightCity.activate()





     


    
