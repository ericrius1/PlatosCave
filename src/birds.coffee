window.WIDTH = 32
window.BIRDS = WIDTH * WIDTH
window.HEIGHT = WIDTH
window.BOUNDS = 800
window.BOUNDS_HALF = BOUNDS / 2
rnd = FW.rnd


THREE.BirdGeometry = ->
  THREE.Geometry.call this
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

last = performance.now()


FW.Birds = class Birds
  constructor : ->
    @birdsPosition = new THREE.Vector3(0, 0, 0)
    window.simulator = new SimulatorRenderer(WIDTH, FW.Renderer, @birdsPosition)
    simulator.init()
    @flockingFactors =
      seperation: 100.0
      alignment: 20.0
      cohesion: 5.0
      freedom: 0.75
    simulator.velocityUniforms.seperationDistance.value = @flockingFactors.seperation
    simulator.velocityUniforms.alignmentDistance.value = @flockingFactors.alignment
    simulator.velocityUniforms.cohesionDistance.value = @flockingFactors.cohesion
    simulator.velocityUniforms.freedomFactor.value = @flockingFactors.freedom
    @initBirds()

  scatter: ->
    simulator.velocityUniforms.seperationDistance.value = @flockingFactors.seperation * 100
    setTimeout(()=>
      @reunite()
    20)
  reunite: ->
    console.log @flockingFactors.seperation
    simulator.velocityUniforms.seperationDistance.value = @flockingFactors.seperation




  initBirds : ->
    geometry = new THREE.BirdGeometry()
    
    # For Vertex Shaders
    birdAttributes =
      index:
        type: "i"
        value: []

      birdColor:
        type: "c"
        value: []

      reference:
        type: "v2"
        value: []

      birdVertex:
        type: "f"
        value: []

    
    # For Vertex and Fragment
    @birdUniforms =
      color:
        type: "c"
        value: new THREE.Color(0xff2200)

      texturePosition:
        type: "t"
        value: null

      textureVelocity:
        type: "t"
        value: null

      time:
        type: "f"
        value: 1.0

      delta:
        type: "f"
        value: 0.0

    
    # ShaderMaterial
    shaderMaterial = new THREE.ShaderMaterial(
      uniforms: @birdUniforms
      attributes: birdAttributes
      vertexShader: document.getElementById("birdVS").textContent
      fragmentShader: document.getElementById("birdFS").textContent
      side: THREE.DoubleSide
    )
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
    
    @birdMesh = new THREE.Mesh(geometry, shaderMaterial)
    @birdMesh.rotation.y = Math.PI / 2
    @birdMesh.sortObjects = false
    @birdMesh.matrixAutoUpdate = false
    @birdMesh.updateMatrix()
    @birdMesh.position =new THREE.Vector3().copy(@birdsPosition)
    FW.scene.add @birdMesh
    
 