
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
    @render()
  render : ->
    delta = @clock.getDelta()
    @stats.update()
    @groundControl.update()
    @meteor.tick()
    @stars.tick()
    @controls.update(delta)
    @renderer.render( FW.scene, FW.camera );
     


    
