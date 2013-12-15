(function() {
  var Birds, last, windowHalfX, windowHalfY,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.WIDTH = 32;

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

  windowHalfX = window.innerWidth / 2;

  windowHalfY = window.innerHeight / 2;

  window.HEIGHT = WIDTH;

  window.PARTICLES = WIDTH * WIDTH;

  window.BOUNDS = 800;

  window.BOUNDS_HALF = BOUNDS / 2;

  last = performance.now();

  FW.Birds = Birds = (function() {
    function Birds() {
      this.animate = __bind(this.animate, this);
      var container;
      container = document.createElement("div");
      document.body.appendChild(container);
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
      this.camera.position.z = 350;
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0xffffff, 100, 1000);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(this.renderer.domElement);
      this.renderer.setClearColor(this.scene.fog.color, 1);
      this.renderer.autoClear = true;
      window.simulator = new SimulatorRenderer(WIDTH, this.renderer);
      simulator.init();
      this.effectController = {
        seperation: 20.0,
        alignment: 20.0,
        cohesion: 20.0,
        freedom: 0.75
      };
      this.valuesChanger();
      this.initBirds();
      this.scene.add(new THREE.Mesh(new THREE.CubeGeometry(400, 400), new THREE.MeshBasicMaterial({
        color: 0xff0000
      })));
    }

    Birds.prototype.valuesChanger = function() {
      simulator.velocityUniforms.seperationDistance.value = this.effectController.seperation;
      simulator.velocityUniforms.alignmentDistance.value = this.effectController.alignment;
      simulator.velocityUniforms.cohesionDistance.value = this.effectController.cohesion;
      return simulator.velocityUniforms.freedomFactor.value = this.effectController.freedom;
    };

    Birds.prototype.initBirds = function() {
      var birdAttributes, birdColors, birdMesh, birdVertex, geometry, i, references, shaderMaterial, v, vertices, x, y;
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
      birdMesh = new THREE.Mesh(geometry, shaderMaterial);
      birdMesh.rotation.y = Math.PI / 2;
      birdMesh.sortObjects = false;
      birdMesh.matrixAutoUpdate = false;
      birdMesh.updateMatrix();
      return this.scene.add(birdMesh);
    };

    Birds.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      return this.render();
    };

    Birds.prototype.update = function() {
      var delta, now;
      now = performance.now();
      delta = (now - last) / 1000;
      if (delta > 1) {
        delta = 1;
      }
      last = now;
      this.birdUniforms.time.value = now;
      this.birdUniforms.delta.value = delta;
      simulator.simulate(delta);
      this.birdUniforms.texturePosition.value = simulator.currentPosition;
      this.birdUniforms.textureVelocity.value = simulator.currentVelocity;
      return this.renderer.render(this.scene, this.camera);
    };

    return Birds;

  })();

}).call(this);
