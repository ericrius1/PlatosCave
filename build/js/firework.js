(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    var rnd;

    rnd = FW.rnd;

    function Firework() {
      var i, _i;
      this.lightIndex = 0;
      this.fwSpread = 200;
      this.fwAge = 11;
      this.lightRange = 10000;
      this.startLightIntensity = 10;
      this.lightDimmingFactor = 2 / this.fwAge;
      this.explodeSound = new Audio('./assets/explosion.mp3');
      this.explodeSound.volume = FW.sfxVolume * 0.6;
      this.crackleSound = new Audio('./assets/crackle.mp3');
      this.crackleSound.volume = FW.sfxVolume * 0.2;
      this.explodeSound.load();
      this.crackleSound.load();
      this.lights = [];
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: this.fwAge
      });
      for (i = _i = 1; _i <= 11; i = ++_i) {
        this.particleGroup.addPool(1, this.generateEmitter(), false);
      }
      FW.scene.add(this.particleGroup.mesh);
    }

    Firework.prototype.generateEmitter = function() {
      var colorStart, emitterSettings, light;
      colorStart = new THREE.Color();
      colorStart.setRGB(Math.random(), Math.random(), Math.random());
      light = new THREE.PointLight(colorStart, 0.0, this.lightRange);
      FW.scene.add(light);
      this.lights.push(light);
      return emitterSettings = {
        positionSpread: new THREE.Vector3(10, 10, 10),
        velocitySpread: new THREE.Vector3(50, 50, 50),
        accelerationSpread: new THREE.Vector3(10, 10, 10),
        size: 200,
        sizeSpread: 100,
        colorStart: colorStart,
        colorSpread: new THREE.Vector3(.2, .2, .2),
        particlesPerSecond: 500,
        alive: 0,
        emitterDuration: 1.0
      };
    };

    Firework.prototype.createExplosion = function(origPos, newPos, count) {
      var emitter, light,
        _this = this;
      if (newPos == null) {
        newPos = origPos;
      }
      if (count == null) {
        count = 0;
      }
      emitter = this.particleGroup.triggerPoolEmitter(1, newPos);
      light = this.lights[this.lightIndex++];
      if (this.lightIndex === this.lights.length) {
        this.lightIndex = 0;
      }
      light.position.set(newPos.x, newPos.y, newPos.z);
      light.intensity = this.startLightIntensity;
      if (count < FW.numExplosionsPerRocket) {
        return setTimeout(function() {
          if (soundOn) {
            setTimeout(function() {
              _this.explodeSound.load();
              _this.explodeSound.play();
              return setTimeout(function() {
                _this.crackleSound.load();
                return _this.crackleSound.play();
              }, 100);
            }, 100);
          }
          count++;
          newPos = new THREE.Vector3(rnd(origPos.x - _this.fwSpread, origPos.x + _this.fwSpread), rnd(origPos.y - _this.fwSpread, origPos.y + _this.fwSpread), rnd(origPos.z - _this.fwSpread, origPos.z + _this.fwSpread));
          return _this.createExplosion(origPos, newPos, count++);
        }, rnd(10, 300));
      }
    };

    Firework.prototype.tick = function() {
      var light, _i, _len, _ref, _results;
      this.particleGroup.tick(FW.globalTick);
      _ref = this.lights;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        light = _ref[_i];
        if (light.intensity > 0) {
          _results.push(light.intensity -= this.lightDimmingFactor);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Firework;

  })();

}).call(this);
