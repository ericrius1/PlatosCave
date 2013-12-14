(function() {
  var World, rnd,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  rnd = FW.rnd;

  FW.World = World = (function() {
    function World() {
      this.animate = __bind(this.animate, this);
      var aMeshMirror, directionalLight, i, screenGeo, screenMat, waterNormals, _i,
        _this = this;
      this.textureCounter = 0;
      this.animDelta = 0;
      this.animDeltaDir = 1;
      this.lightVal = .16;
      this.lightDir = 0;
      this.clock = new THREE.Clock();
      this.updateNoise = true;
      this.animateTerrain = false;
      this.mlib = {};
      this.MARGIN = 10;
      this.SCREEN_WIDTH = window.innerWidth;
      this.SCREEN_HEIGHT = window.innerHeight - 2 * this.MARGIN;
      this.camFar = 200000;
      this.width = 100000;
      this.height = 100000;
      this.startingY = 40;
      this.rippleFactor = rnd(60, 300);
      FW.camera = new THREE.PerspectiveCamera(55.0, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 3, this.camFar);
      FW.camera.position.set(0, this.startingY, 0);
      FW.camera.lookAt(new THREE.Vector3(0, 40, 0));
      this.controls = new THREE.FlyControls(FW.camera);
      this.controls.movementSpeed = 800;
      this.controls.rollSpeed = Math.PI / 8;
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      FW.scene = new THREE.Scene();
      this.groundControl = new FW.Rockets();
      this.meteor = new FW.Meteor();
      this.stars = new FW.Stars();
      this.lightTower = new FW.LightTower();
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      document.body.appendChild(this.renderer.domElement);
      directionalLight = new THREE.DirectionalLight(0xff0000, 3);
      directionalLight.position.set(-600, 300, 600);
      FW.scene.add(directionalLight);
      screenGeo = new THREE.PlaneGeometry(200, 100, 10, 10);
      screenMat = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('assets/sagan.jpg'),
        side: THREE.DoubleSide
      });
      this.screen = new THREE.Mesh(screenGeo, screenMat);
      this.screen.position.set(0, -50, -200);
      FW.scene.add(this.screen);
      this.loadTerrain(new THREE.Vector3());
      for (i = _i = 1; _i <= 4; i = ++_i) {
        this.loadTerrain(new THREE.Vector3(rnd(-this.width / 5, this.width / 5), 0, rnd(-this.height / 5, this.height / 5)));
      }
      waterNormals = new THREE.ImageUtils.loadTexture('./assets/waternormals.jpg');
      waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
      this.water = new THREE.Water(this.renderer, FW.camera, FW.scene, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        alpha: 0.99,
        waterColor: 0x001e0f,
        distortionScale: 50
      });
      aMeshMirror = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height, 50, 50), this.water.material);
      aMeshMirror.add(this.water);
      aMeshMirror.rotation.x = -Math.PI * 0.5;
      FW.scene.add(aMeshMirror);
      window.addEventListener("resize", (function() {
        return _this.onWindowResize();
      }), false);
    }

    World.prototype.loadSkyBox = function() {
      var aCubeMap, aShader, aSkyBox, aSkyBoxMaterial;
      aCubeMap = THREE.ImageUtils.loadTextureCube(['./assets/px.jpg', './assets/nx.jpg', './assets/py.jpg', './assets/ny.jpg', './assets/pz.jpg', './assets/nz.jpg']);
      aCubeMap.format = THREE.RGBFormat;
      aShader = THREE.ShaderLib['cube'];
      aShader.uniforms['tCube'].value = aCubeMap;
      aSkyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: aShader.fragmentShader,
        vertexShader: aShader.vertexShader,
        uniforms: aShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      });
      aSkyBox = new THREE.Mesh(new THREE.CubeGeometry(1000000, 1000000, 1000000), aSkyBoxMaterial);
      return FW.scene.add(aSkyBox);
    };

    World.prototype.loadTerrain = function(position) {
      var parameters, terrain, terrainGeo, terrainMaterial;
      parameters = {
        alea: RAND_MT,
        generator: PN_GENERATOR,
        width: rnd(1000, 2000),
        height: rnd(1000, 2000),
        widthSegments: 100,
        heightSegments: 100,
        depth: rnd(1500, 5000),
        param: 4,
        filterparam: 1,
        filter: [CIRCLE_FILTER],
        postgen: [MOUNTAINS_COLORS],
        effect: [DESTRUCTURE_EFFECT]
      };
      terrainGeo = TERRAINGEN.Get(parameters);
      terrainMaterial = new THREE.MeshPhongMaterial({
        vertexColors: THREE.VertexColors,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide
      });
      terrain = new THREE.Mesh(terrainGeo, terrainMaterial);
      terrain.position = position;
      return FW.scene.add(terrain);
    };

    World.prototype.onWindowResize = function(event) {
      this.SCREEN_WIDTH = window.innerWidth;
      this.SCREEN_HEIGHT = window.innerHeight - 2 * this.MARGIN;
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      FW.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
      return FW.camera.updateProjectionMatrix();
    };

    World.prototype.animate = function() {
      var delta, time;
      requestAnimationFrame(this.animate);
      delta = this.clock.getDelta();
      time = Date.now();
      this.water.material.uniforms.time.value += 1.0 / 60;
      this.controls.update(delta);
      return this.render();
    };

    World.prototype.render = function() {
      this.screen.position.y += .1;
      FW.camera.position.y = this.startingY;
      this.groundControl.update();
      this.meteor.tick();
      this.stars.tick();
      this.lightTower.tick();
      this.water.render();
      return this.renderer.render(FW.scene, FW.camera);
    };

    return World;

  })();

}).call(this);
