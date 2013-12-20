(function() {
  var LightCity;

  FW.LightCity = LightCity = (function() {
    var rnd;

    rnd = FW.rnd;

    function LightCity() {
      var i, _i;
      this.cityGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
        maxAge: 111
      });
      this.colorEnd = new THREE.Color();
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      for (i = _i = 1; _i <= 100; i = ++_i) {
        this.cityGroup.addPool(1, this.generateBuilding(), false);
      }
      FW.scene.add(this.cityGroup.mesh);
    }

    LightCity.prototype.generateBuilding = function() {
      var cityEmitter, colorEnd, colorStart;
      colorStart = new THREE.Color();
      colorStart.setRGB(Math.random(), Math.random(), Math.random());
      colorEnd = new THREE.Color();
      colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      return cityEmitter = new ShaderParticleEmitter({
        size: 2000,
        colorStart: colorStart,
        colorEnd: colorEnd,
        velocity: new THREE.Vector3(0, 100, 0),
        acceleration: new THREE.Vector3(rnd(-1, 1), 0, rnd(-1, 1)),
        particlesPerSecond: 1,
        opacityEnd: 0.5,
        alive: 0
      });
    };

    LightCity.prototype.activate = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 1; _i <= 100; i = ++_i) {
        _results.push(this.cityGroup.triggerPoolEmitter(1, new THREE.Vector3(rnd(-40000, 20000), -100, rnd(-50000, -70000))));
      }
      return _results;
    };

    LightCity.prototype.tick = function() {
      return this.cityGroup.tick(FW.globalTick);
    };

    return LightCity;

  })();

}).call(this);
