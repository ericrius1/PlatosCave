(function() {
  var World, rnd,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.windowHalfX = window.innerWidth / 2;

  window.windowHalfY = window.innerHeight / 2;

  rnd = FW.rnd;

  FW.World = World = (function() {
    function World() {
      this.animate = __bind(this.animate, this);
      var aMeshMirror, directionalLight, i, randColor, screenGeo, screenMat, waterNormals, _i,
        _this = this;
      this.textureCounter = 0;
      this.animDelta = 0;
      this.animDeltaDir = 1;
      this.lightVal = .16;
      this.lightDir = 0;
      FW.clock = new THREE.Clock();
      this.updateNoise = true;
      this.animateTerrain = false;
      this.mlib = {};
      this.MARGIN = 10;
      this.SCREEN_WIDTH = window.innerWidth;
      this.SCREEN_HEIGHT = window.innerHeight - 2 * this.MARGIN;
      this.camFar = 200000;
      this.width = 150000;
      this.height = 150000;
      this.startingY = 40;
      this.rippleFactor = rnd(60, 300);
      window.mouseX = 10000;
      window.mouseY = 10000;
      this.slowUpdateInterval = 1000;
      this.noLightCity = true;
      FW.camera = new THREE.PerspectiveCamera(55.0, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, this.camFar);
      FW.camera.position.set(0, this.startingY, 100);
      FW.camera.lookAt(new THREE.Vector3(0, 40, 0));
      this.controls = new THREE.FlyControls(FW.camera);
      this.controls.movementSpeed = 800;
      this.controls.rollSpeed = Math.PI / 8;
      if (FW.development === true) {
        this.controls.pitchEnabled = true;
        this.controls.flyEnabled = true;
      }
      if (FW.development === true) {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
      }
      FW.scene = new THREE.Scene();
      FW.Renderer = new THREE.WebGLRenderer();
      FW.Renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      document.body.appendChild(FW.Renderer.domElement);
      this.groundControl = new FW.Rockets();
      this.meteor = new FW.Meteor();
      this.stars = new FW.Stars();
      this.lightTower = new FW.LightTower();
      this.lightCity = new FW.LightCity();
      FW.birds = new FW.Birds();
      directionalLight = new THREE.DirectionalLight(0xff0000, rnd(0.5, 1.5));
      randColor = Math.floor(Math.random() * 16777215);
      console.log(randColor);
      directionalLight.color.setHex(randColor);
      directionalLight.position.set(0, 6000, 0);
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
      for (i = _i = 1; _i <= 10; i = ++_i) {
        this.loadTerrain(new THREE.Vector3(rnd(-this.width / 5, this.width / 5), 0, rnd(-this.height / 5, this.height / 5)));
      }
      waterNormals = new THREE.ImageUtils.loadTexture('./assets/waternormals.jpg');
      waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
      this.water = new THREE.Water(FW.Renderer, FW.camera, FW.scene, {
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
      this.slowUpdate();
    }

    World.prototype.loadTerrain = function(position) {
      var parameters, terrain, terrainGeo, terrainMaterial;
      parameters = {
        alea: RAND_MT,
        generator: PN_GENERATOR,
        width: rnd(2000, 4000),
        height: rnd(2000, 4000),
        widthSegments: 100,
        heightSegments: 100,
        depth: rnd(500, 2000),
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
      FW.Renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      FW.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
      return FW.camera.updateProjectionMatrix();
    };

    World.prototype.animate = function() {
      var delta, time;
      requestAnimationFrame(this.animate);
      delta = FW.clock.getDelta();
      time = Date.now();
      this.water.material.uniforms.time.value += 1.0 / 60;
      this.controls.update(delta);
      FW.birds.birdUniforms.time.value = performance.now();
      FW.birds.birdUniforms.delta.value = delta;
      simulator.simulate(delta);
      FW.birds.birdUniforms.texturePosition.value = simulator.currentPosition;
      FW.birds.birdUniforms.textureVelocity.value = simulator.currentVelocity;
      simulator.velocityUniforms.predator.value.set(0, 0, 0);
      return this.render();
    };

    World.prototype.render = function() {
      this.screen.position.y += .2;
      if (FW.development === true) {
        this.stats.update();
      }
      FW.camera.position.y = this.startingY;
      this.groundControl.update();
      this.meteor.tick();
      this.stars.tick();
      this.lightTower.tick();
      this.lightCity.tick();
      this.water.render();
      return FW.Renderer.render(FW.scene, FW.camera);
    };

    World.prototype.slowUpdate = function() {
      var _this = this;
      return setTimeout(function() {
        var distance;
        _this.meteor.calcPositions();
        if (_this.noLightCity) {
          distance = FW.camera.position.distanceTo(_this.lightTower.position);
          if (distance < 2000) {
            _this.activateLightCity();
            _this.noLightCity = false;
          }
        }
        return _this.slowUpdate();
      }, this.slowUpdateInterval);
    };

    World.prototype.activateLightCity = function() {
      return this.lightCity.activate();
    };

    return World;

  })();

}).call(this);
