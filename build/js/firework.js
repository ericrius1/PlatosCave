(function() {
  var Firework;

  FW.Firework = Firework = (function() {
    var rnd;

    rnd = FW.rnd;

    function Firework() {
      var i, _i;
      this.colorStart = new THREE.Color();
      this.colorEnd = new THREE.Color();
      this.fwSpread = 200;
      this.fwAge = 15;
      this.explodeSound = new Audio('./assets/explosion.mp3');
      this.explodeSound.volume = FW.sfxVolume;
      this.crackleSound = new Audio('./assets/crackle.mp3');
      this.crackleSound.volume = FW.sfxVolume * 0.5;
      this.particleGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 9
      });
      for (i = _i = 1; _i <= 10; i = ++_i) {
        this.particleGroup.addPool(1, this.generateEmitter(), false);
      }
      FW.scene.add(this.particleGroup.mesh);
    }

    Firework.prototype.generateEmitter = function() {
      var emitterSettings;
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      return emitterSettings = {
        type: 'sphere',
        radius: 4,
        radiusScale: new THREE.Vector3(rnd(1, 1.5), rnd(1, 1.5), rnd(1, 1.5)),
        speed: 10,
        speedSpread: 10,
        colorStart: this.colorStart,
        colorSpread: new THREE.Vector3(.2, .2, .2),
        colorEnd: this.colorEnd,
        particlesPerSecond: 400,
        alive: 0,
        emitterDuration: 1.0
      };
    };

    Firework.prototype.createExplosion = function(origPos, newPos, count) {
      var emitter,
        _this = this;
      if (newPos == null) {
        newPos = origPos;
      }
      if (count == null) {
        count = 0;
      }
      emitter = this.particleGroup.triggerPoolEmitter(1, newPos);
      if (count < FW.numExplosionsPerRocket - 1) {
        return setTimeout(function() {
          if (soundOn) {
            setTimeout(function() {
              _this.explodeSound.load();
              _this.explodeSound.play();
              return setTimeout(function() {
                _this.crackleSound.load();
                return _this.crackleSound.play();
              }, 100);
            }, 50);
          }
          count++;
          newPos = new THREE.Vector3(rnd(origPos.x - _this.fwSpread, origPos.x + _this.fwSpread), rnd(origPos.y - _this.fwSpread, origPos.y + _this.fwSpread), rnd(origPos.z - _this.fwSpread, origPos.z + _this.fwSpread));
          return _this.createExplosion(origPos, newPos, count++);
        }, rnd(10, 300));
      }
    };

    Firework.prototype.tick = function() {
      return this.particleGroup.tick(0.16);
    };

    return Firework;

  })();

}).call(this);
