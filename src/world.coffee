
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
    @camFar = 8000

    # CAMERA
    FW.camera = new THREE.PerspectiveCamera(40, @SCREEN_WIDTH / @SCREEN_HEIGHT, 2, @camFar)
    FW.camera.position.set  0, 570, 0
    
    #CONTROLS
    @controls = new THREE.FlyControls(FW.camera)
    @controls.movementSpeed = 600;
    @controls.rollSpeed =  Math.PI / 6;
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
    @meteor = new FW.Meteor()
    @stars = new FW.Stars()

    
    # LIGHTS
    directionalLight = new THREE.DirectionalLight( 0xffff55, 1 );
    directionalLight.position.set( -600, 300, 600 );
    FW.scene.add( directionalLight );
    
    
    
    # RENDERER
    @renderer = new THREE.WebGLRenderer()
    @renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    @renderer.domElement.style.position = "absolute"
    @renderer.domElement.style.top = @MARGIN + "px"
    @renderer.domElement.style.left = "0px"
    document.body.appendChild @renderer.domElement
    

    #WATER
    waterNormals = new THREE.ImageUtils.loadTexture './assets/waternormals.jpg'
    @water = new THREE.Water @renderer, FW.camera, FW.scene,
      textureWidth: 512
      textureHeight: 512
      waterNormals: waterNormals
      alpha: 1.0
      sunDirection: directionalLight.position.normalize()
      sunColor: 0xffffff
      waterColor: 0x001e0f

    aMeshMirror = new THREE.Mesh(
      new THREE.PlaneGeometry 2000, 2000, 10, 10
      @water.material
    )
    aMeshMirror.add @water
    aMeshMirror.rotation.x = -Math.PI * 0.5
    FW.scene.add aMeshMirror
    


    # EVENTS
    @onWindowResize()


    window.addEventListener "resize", (=>
      @onWindowResize()
    ), false
    document.addEventListener "keydown", (=>
      @onKeyDown(event)
    ), false


  onWindowResize : (event) ->
    @SCREEN_WIDTH = window.innerWidth
    @SCREEN_HEIGHT = window.innerHeight - 2 * @MARGIN
    @renderer.setSize @SCREEN_WIDTH, @SCREEN_HEIGHT
    FW.camera.aspect = @SCREEN_WIDTH / @SCREEN_HEIGHT
    FW.camera.updateProjectionMatrix()

  onKeyDown : (event) =>
    switch event.keyCode
      when 78
        @lightDir *= -1 #N
      when 77
        @animDeltaDir *= -1 #M

  


  animate : =>
    requestAnimationFrame @animate
    @water.material.uniforms.time.value += 1.0 / 60.0
    @render()
  render : ->
    delta = @clock.getDelta()
    @stats.update()
    @groundControl.update()
    @meteor.tick()
    @stars.tick()
    @controls.update(delta)
    @water.render()
    @renderer.render( FW.scene, FW.camera );
     


    
