
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
    @camFar = 300000
    @width = 2000
    @height = 2000

    # CAMERA
    FW.camera = new THREE.PerspectiveCamera(40.0, @SCREEN_WIDTH / @SCREEN_HEIGHT, 0.5, @camFar)
    FW.camera.position.set  0, (@width * 1.5) /8, -@height
    FW.camera.lookAt new THREE.Vector3 0, 0, 0
    
    #CONTROLS
    @controls = new THREE.FlyControls(FW.camera)
    @controls.movementSpeed = 2000;
    @controls.rollSpeed =  Math.PI / 4;
    @controls.pitchEnabled = true

    #STATS
    @stats = new Stats()
    @stats.domElement.style.position = 'absolute';
    @stats.domElement.style.left = '0px';
    @stats.domElement.style.top = '0px';
    document.body.appendChild(@stats.domElement);
    

    
    
    # SCENE 
    FW.scene = new THREE.Scene()


    #FUN
    @firework = new FW.Firework()
    @groundControl = new FW.Rockets()
    # @meteor = new FW.Meteor()
    @stars = new FW.Stars()

    
    # RENDERER
    @renderer = new THREE.WebGLRenderer()
    @renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    @renderer.domElement.style.position = "absolute"
    @renderer.domElement.style.top = @MARGIN + "px"
    @renderer.domElement.style.left = "0px"
    document.body.appendChild @renderer.domElement
    
    
    # LIGHTS
    directionalLight = new THREE.DirectionalLight( 0xff0000, 1000 );
    directionalLight.position.set( -600, 300, 600 );
    FW.scene.add( directionalLight );

    #WATER
    waterNormals = new THREE.ImageUtils.loadTexture './assets/waternormals.jpg'
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    @water = new THREE.Water @renderer, FW.camera, FW.scene,
      textureWidth: 512
      textureHeight: 512
      waterNormals: waterNormals
      alpha: 1.0
      sunDirection: directionalLight.position.normalize()
      sunColor: 0xffffff
      waterColor: 0x001e0f
      distortionScale: 50.0

    aMeshMirror = new THREE.Mesh(
      new THREE.PlaneGeometry @width * 500, @height * 500, 50, 50
      @water.material
    )
    aMeshMirror.add @water
    aMeshMirror.rotation.x = -Math.PI * 0.5
    FW.scene.add aMeshMirror

    @loadSkyBox()
    


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


  onWindowResize : (event) ->
    @SCREEN_WIDTH = window.innerWidth
    @SCREEN_HEIGHT = window.innerHeight - 2 * @MARGIN
    @renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    FW.camera.aspect = @SCREEN_WIDTH / @SCREEN_HEIGHT
    FW.camera.updateProjectionMatrix()



  animate : =>
    requestAnimationFrame @animate
    delta = @clock.getDelta()
    @water.material.uniforms.time.value += 1.0 / 60.0
    @controls.update(delta)
    @render()
  render : ->
    @stats.update()
    @groundControl.update()
    # @meteor.tick()
    @stars.tick()
    @water.render()
    @renderer.render( FW.scene, FW.camera );
     


    
