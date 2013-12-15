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
    @initBirds()

  initBirds: ->
    geometry = new THREE.BirdGeometry()
    #For Vertex Shader
    birdAttributes = 
      index: {type: 'i', value: []},
      birdColor: {type: 'c', value: []},
      reference: {type: 'c', value: []},
      birdVertex: {type: 'f', value: []}
    #For vertex and fragment
    birdUniforms =
      color: type: 'c', value: new THREE.Color(0xff2200)
      texturePosition: type: "t", value: null
      textureVelocity: type: "t", value: null
      time: type: "f", value: 1.0
      delta: type: "f", value: 0.0

    shaderMaterial = new THREE.ShaderMaterial
      uniforms: birdUniforms,
      attributes: birdAttributes,
      vertexShader: document.getElementById 'birdVS'
      fragmentShader: document.getElementById 'birdFS'.textContent,
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


