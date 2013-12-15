(function() {
  var Birds, HEIGHT, WIDTH;

  WIDTH = 32;

  HEIGHT = WIDTH;

  window.PARTICLES = WIDTH * WIDTH;

  window.BOUNDS = 800;

  window.BOUNDS_HALF = BOUNDS / 2;

  window.BIRDS = 1024;

  THREE.BirdGeometry = function() {
    var BIRDS, f, faces, fi, uvs, verts, wingsSpan;
    THREE.Geometry.call(this);
    BIRDS = WIDTH * WIDTH;
    verts = this.vertices;
    faces = this.faces;
    uvs = this.faceVertexUvs[0];
    fi = 0;
    f = 0;
    while (f < BIRDS) {
      verts.push(new THREE.Vector3(0, -0, -20), new THREE.Vector3(0, 4, -20), new THREE.Vector3(0, 0, 30));
      faces.push(new THREE.Face3(fi++, fi++, fi++));
      uvs.push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]);
      wingsSpan = 20;
      verts.push(new THREE.Vector3(0, 0, -15), new THREE.Vector3(-wingsSpan, 0, 0), new THREE.Vector3(0, 0, 15));
      verts.push(new THREE.Vector3(0, 0, 15), new THREE.Vector3(wingsSpan, 0, 0), new THREE.Vector3(0, 0, -15));
      faces.push(new THREE.Face3(fi++, fi++, fi++));
      faces.push(new THREE.Face3(fi++, fi++, fi++));
      uvs.push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]);
      uvs.push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]);
      f++;
    }
    this.applyMatrix(new THREE.Matrix4().makeScale(0.2, 0.2, 0.2));
    this.computeCentroids();
    this.computeFaceNormals();
    return this.computeVertexNormals();
  };

  THREE.BirdGeometry.prototype = Object.create(THREE.Geometry.prototype);

  FW.Birds = Birds = (function() {
    function Birds() {
      window.simulator = new SimulatorRenderer(WIDTH, FW.Renderer);
      simulator.init();
      this.initBirds();
    }

    Birds.prototype.initBirds = function() {
      var birdAttributes, birdColors, birdUniforms, birdVertex, geometry, i, references, shaderMaterial, v, vertices, x, y, _results;
      geometry = new THREE.BirdGeometry();
      birdAttributes = {
        index: {
          type: 'i',
          value: []
        },
        birdColor: {
          type: 'c',
          value: []
        },
        reference: {
          type: 'c',
          value: []
        },
        birdVertex: {
          type: 'f',
          value: []
        }
      };
      birdUniforms = {
        color: {
          type: 'c',
          value: new THREE.Color(0xff2200)
        },
        texturePosition: {
          type: "t",
          value: null
        },
        textureVelocity: {
          type: "t",
          value: null
        },
        time: {
          type: "f",
          value: 1.0
        },
        delta: {
          type: "f",
          value: 0.0
        }
      };
      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: birdUniforms,
        attributes: birdAttributes,
        vertexShader: document.getElementById('birdVS'),
        fragmentShader: document.getElementById('birdFS'.textContent, {
          side: THREE.DoubleSide
        })
      });
      vertices = geometry.vertices;
      birdColors = birdAttributes.birdColor.value;
      references = birdAttributes.reference.value;
      birdVertex = birdAttributes.birdVertex.value;
      v = 0;
      _results = [];
      while (v < vertices.length) {
        i = ~~(v / 3);
        x = (i % WIDTH) / WIDTH;
        y = ~~(i / WIDTH) / WIDTH;
        birdColors[v] = new THREE.Color(0x444444 + ~~(v / 9) / BIRDS * 0x666666);
        references[v] = new THREE.Vector2(x, y);
        birdVertex[v] = v % 9;
        _results.push(v++);
      }
      return _results;
    };

    return Birds;

  })();

}).call(this);
