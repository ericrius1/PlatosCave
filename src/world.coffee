
rnd = FW.rnd
FW.World = class World
  constructor : ->
    @textureCounter = 0
    @animDelta = 0
    @animDeltaDir = 1
    @lightVal = .16
    @lightDir = 0
    @clock = new THREE.Clock()
    @updateNoise = true
    @animateTerrain = false
    @mlib = {}
    @MARGIN = 10
    @SCREEN_WIDTH = window.innerWidth
    @SCREEN_HEIGHT = window.innerHeight - 2 * @MARGIN
    @camFar = 200000
    @width = 100000
    @height = 100000
    @startingY = 40

    # CAMERA
    FW.camera = new THREE.PerspectiveCamera(55.0, @SCREEN_WIDTH / @SCREEN_HEIGHT, 3, @camFar)
    FW.camera.position.set  0, @startingY, 0
    FW.camera.lookAt new THREE.Vector3 0, 40, 0
    
    #CONTROLS
    @controls = new THREE.FlyControls(FW.camera)
    @controls.movementSpeed = 1000;
    @controls.rollSpeed =  Math.PI / 4;
    # @controls.pitchEnabled = true
    # @controls.flyEnabled = true

    #STATS
    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';
    document.body.appendChild(@stats.domElement);
    

    # SCENE 
    FW.scene = new THREE.Scene()


    #FUN
    @groundControl = new FW.Rockets()
    @meteor = new FW.Meteor()
    @stars = new FW.Stars()

    
    # RENDERER
    @renderer = new THREE.WebGLRenderer()
    @renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    document.body.appendChild @renderer.domElement
    
    
    # LIGHTS
    directionalLight = new THREE.DirectionalLight 0xff00ff, 4
    directionalLight.position.set( -600, 300, 600 )
    FW.scene.add( directionalLight )

    caveLight = new THREE.SpotLight(0x00ff00, 2)
    caveLight.position.set(0, 300, 10000)
    caveLight.castShadow = true
    FW.scene.add caveLight


    #SCREEN
    screenGeo = new THREE.PlaneGeometry(200, 100, 10, 10)
    screenMat = new THREE.MeshLambertMaterial map: THREE.ImageUtils.loadTexture('assets/sagan.jpg'), side: THREE.DoubleSide
    @screen = new THREE.Mesh(screenGeo, screenMat)
    @screen.position.set(0,  -50, -200)

    FW.scene.add @screen

    #TERRAIN
    @loadTerrain new THREE.Vector3()
    for i in [1..10]
      @loadTerrain new THREE.Vector3(rnd(-@width/5, @width/5), 0, rnd(-@height/5, @height/5)) 

    #WATER
    waterNormals = new THREE.ImageUtils.loadTexture './assets/waternormals.jpg'
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    @water = new THREE.Water @renderer, FW.camera, FW.scene,
      textureWidth: 512
      textureHeight: 512
      waterNormals: waterNormals
      alpha: 0.8
      waterColor: 0x001e0f
      distortionScale: 50

    aMeshMirror = new THREE.Mesh(
      new THREE.PlaneGeometry @width, @height, 50, 50
      @water.material
    )
    aMeshMirror.add @water
    aMeshMirror.rotation.x = -Math.PI * 0.5
    FW.scene.add aMeshMirror

    # @loadSkyBox()
    


    # EVENTS
    window.addEventListener "resize", (=>
      @onWindowResize()
    ), false

  loadSkyBox: ->
    aCubeMap = THREE.ImageUtils.loadTextureCube [
      './assets/px.jpg'
      './assets/nx.jpg'
      './assets/py.jpg'
      './assets/ny.jpg'
      './assets/pz.jpg'
      './assets/nz.jpg'
    ]

    aCubeMap.format = THREE.RGBFormat
    aShader = THREE.ShaderLib['cube']
    aShader.uniforms['tCube'].value = aCubeMap

    aSkyBoxMaterial = new THREE.ShaderMaterial
      fragmentShader: aShader.fragmentShader
      vertexShader: aShader.vertexShader
      uniforms: aShader.uniforms
      depthWrite: false
      side: THREE.BackSide

    aSkyBox = new THREE.Mesh(
      new THREE.CubeGeometry 1000000, 1000000, 1000000
      aSkyBoxMaterial
    )
    FW.scene.add aSkyBox

  loadTerrain: (position)->
    parameters = 
      alea: RAND_MT,
      generator: PN_GENERATOR,
      width: rnd 1000, 2000
      height: rnd 1000, 2000
      widthSegments: 100
      heightSegments: 100
      depth: rnd 1500, 10000
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
    @renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    FW.camera.aspect = @SCREEN_WIDTH / @SCREEN_HEIGHT
    FW.camera.updateProjectionMatrix()

  animate : =>
    requestAnimationFrame @animate
    delta = @clock.getDelta()
    time = Date.now()
    @water.material.uniforms.time.value += 1.0 / 60.0
    @controls.update(delta)
    @render()
  render : ->
    @screen.position.y += .1
    @stats.update()
    FW.camera.position.y = @startingY
    @groundControl.update()
    @meteor.tick()
    @stars.tick()
    @water.render()
    @renderer.render( FW.scene, FW.camera );
     


    
