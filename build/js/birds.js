(function() {
  var Birds, last, rnd;

  window.WIDTH = 16;

  window.BIRDS = WIDTH * WIDTH;

  window.HEIGHT = WIDTH;

  window.BOUNDS = 800;

  window.BOUNDS_HALF = BOUNDS / 2;

  rnd = FW.rnd;

  THREE.BirdGeometry = function() {
    var f, faces, fi, uvs, verts, wingsSpan;
    THREE.Geometry.call(this);
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

  last = performance.now();

  FW.Birds = Birds = (function() {
    function Birds() {
      this.birdsPosition = new THREE.Vector3(0, 0, 0);
      window.simulator = new SimulatorRenderer(WIDTH, FW.Renderer, this.birdsPosition);
      simulator.init();
      this.flockingFactors = {
        seperation: 10.0,
        alignment: 20.0,
        cohesion: 5.0,
        freedom: 0.75
      };
      simulator.velocityUniforms.seperationDistance.value = this.flockingFactors.seperation;
      simulator.velocityUniforms.alignmentDistance.value = this.flockingFactors.alignment;
      simulator.velocityUniforms.cohesionDistance.value = this.flockingFactors.cohesion;
      simulator.velocityUniforms.freedomFactor.value = this.flockingFactors.freedom;
      this.initBirds();
    }

    Birds.prototype.scatter = function() {
      var _this = this;
      simulator.velocityUniforms.seperationDistance.value = this.flockingFactors.seperation * 100;
      return setTimeout(function() {
        return _this.reunite();
      }, 20);
    };

    Birds.prototype.reunite = function() {
      console.log(this.flockingFactors.seperation);
      return simulator.velocityUniforms.seperationDistance.value = this.flockingFactors.seperation;
    };

    Birds.prototype.initBirds = function() {
      var birdAttributes, birdColors, birdVertex, geometry, i, references, shaderMaterial, v, vertices, x, y;
      geometry = new THREE.BirdGeometry();
      birdAttributes = {
        index: {
          type: "i",
          value: []
        },
        birdColor: {
          type: "c",
          value: []
        },
        reference: {
          type: "v2",
          value: []
        },
        birdVertex: {
          type: "f",
          value: []
        }
      };
      this.birdUniforms = {
        color: {
          type: "c",
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
        uniforms: this.birdUniforms,
        attributes: birdAttributes,
        vertexShader: document.getElementById("birdVS").textContent,
        fragmentShader: document.getElementById("birdFS").textContent,
        side: THREE.DoubleSide
      });
      vertices = geometry.vertices;
      birdColors = birdAttributes.birdColor.value;
      references = birdAttributes.reference.value;
      birdVertex = birdAttributes.birdVertex.value;
      v = 0;
      while (v < vertices.length) {
        i = ~~(v / 3);
        x = (i % WIDTH) / WIDTH;
        y = ~~(i / WIDTH) / WIDTH;
        birdColors[v] = new THREE.Color(0x444444 + ~~(v / 9) / BIRDS * 0x666666);
        references[v] = new THREE.Vector2(x, y);
        birdVertex[v] = v % 9;
        v++;
      }
      this.birdMesh = new THREE.Mesh(geometry, shaderMaterial);
      this.birdMesh.rotation.y = Math.PI / 2;
      this.birdMesh.sortObjects = false;
      this.birdMesh.matrixAutoUpdate = false;
      this.birdMesh.updateMatrix();
      this.birdMesh.position = new THREE.Vector3().copy(this.birdsPosition);
      return FW.scene.add(this.birdMesh);
    };

    return Birds;

  })();

}).call(this);
