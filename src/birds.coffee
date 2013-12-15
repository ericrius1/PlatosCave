WIDTH = 32
THREE.BirdGeometry = ->
  THREE.Geometry.call this
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

FW.Birds = class Birds
  constructor: () ->
    simulator = new SimulatorRenderer()

