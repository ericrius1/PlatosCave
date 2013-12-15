WIDTH = 32
HEIGHT = WIDTH
window.PARTICLES = WIDTH * WIDTH;
window.BOUNDS = 800
window.BOUNDS_HALF = BOUNDS / 2
window.BIRDS = 1024
THREE.BirdGeometry = ->
  THREE.Geometry.call @
  BIRDS = WIDTH * WIDTH
  verts = @vertices
  faces = @faces
  uvs = @faceVertexUvs[0]
  fi = 0
  f = 0
  @t = 0;
  @last = performance.now()

  while f < BIRDS
    verts.push new THREE.Vector3(0, -0, -20), new THREE.Vector3(0, 4, -20), new THREE.Vector3(0, 0, 30)
    faces.push new THREE.Face3(fi++, fi++, fi++)
    uvs.push [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]
    wingsSpan = 20
    verts.push new THREE.Vector3(0, 0, -15), new THREE.Vector3(-wingsSpan, 0, 0), new THREE.Vector3(0, 0, 15)
    verts.push new THREE.Vector3(0, 0, 15), new THREE.Vector3(wingsSpan, 0, 0), new THREE.Vector3(0, 0, -15)
    faces.push new THREE.Face3(fi++, fi++, fi++)
    faces.push new THREE.Face3(fi++, fi++, fi++)
    uvs.push [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]
    uvs.push [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]
    f++
  @applyMatrix new THREE.Matrix4().makeScale(0.2, 0.2, 0.2)
  @computeCentroids()
  @computeFaceNormals()
  @computeVertexNormals()

THREE.BirdGeometry:: = Object.create(THREE.Geometry::)

FW.Birds = class Birds
  constructor: () ->
    window.simulator = new SimulatorRenderer(WIDTH, FW.Renderer)
    simulator.init()
    @flockingBehavior = 
      separtion: 20.0
      alignment: 20.0
      cohesion: 20.0
      freedom: 0.75
    simulator.velocityUniforms.seperationDistance.value = @flockingBehavior.separation
    simulator.velocityUniforms.alignmentDistance.value = @flockingBehavior.alignment
    simulator.velocityUniforms.cohesionDistance.value = @flockingBehavior.cohesion
    simulator.velocityUniforms.freedomFactor.value = @flockingBehavior.freedom
    @initBirds()

  initBirds: ->
    geometry = new THREE.BirdGeometry()
    #For Vertex Shader
    birdAttributes = 
      index: {type: 'i', value: []},
      birdColor: {type: 'c', value: []},
      reference: {type: 'v2', value: []},
      birdVertex: {type: 'f', value: []}
    #For vertex and fragment
    @birdUniforms =
      color: type: 'c', value: new THREE.Color(0xff2200)
      texturePosition: type: "t", value: null
      textureVelocity: type: "t", value: null
      time: type: "f", value: 1.0
      delta: type: "f", value: 0.0

    shaderMaterial = new THREE.ShaderMaterial
      uniforms: @birdUniforms,
      attributes: birdAttributes,
      vertexShader: document.getElementById('birdVS').textContent
      fragmentShader: document.getElementById('birdFS').textContent,
      side: THREE.DoubleSide

    vertices = geometry.vertices
    birdColors = birdAttributes.birdColor.value
    references = birdAttributes.reference.value
    birdVertex = birdAttributes.birdVertex.value

    v = 0

    while v < vertices.length
      i = ~~(v / 3)
      x = (i % WIDTH) / WIDTH
      y = ~~(i / WIDTH) / WIDTH
      birdColors[v] = new THREE.Color(0x444444 + ~~(v / 9) / BIRDS * 0x666666)
      references[v] = new THREE.Vector2(x, y)
      birdVertex[v] = v % 9
      v++

    birdMesh = new THREE.Mesh geometry, shaderMaterial
    birdMesh.rotation.y = Math.PI / 2
    birdMesh.sortObjects = false
    birdMesh.matrixAutoUpdate = false
    birdMesh.updateMatrix()
    FW.scene.add birdMesh

  update: ->
    @now = performance.now()
    @delta = (@now - @last) / 1000
    delta = 1 if delta > 1
    @birdUniforms.time.value = @now
    @birdUniforms.delta.value = @delta

    simulator.simulate @delta
    @birdUniforms.texturePosition.value = simulator.currentPosition
    @birdUniforms.textureVelocity.value = simulator.currentVelocity

    mouseX = 10000
    mouseY = 10000


