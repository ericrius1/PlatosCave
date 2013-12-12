(function() {
  var Stars;

  FW.Stars = Stars = (function() {
    var rnd;

    rnd = FW.rnd;

    function Stars() {
      this.colorStart = new THREE.Color();
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      this.starGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 100
      });
      this.colorEnd = new THREE.Color();
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      this.createStars();
      FW.scene.add(this.starGroup.mesh);
    }

    Stars.prototype.createStars = function() {
      this.starEmitter = new ShaderParticleEmitter({
        type: 'sphere',
        radius: 100000,
        speed: .1,
        position: new THREE.Vector3().copy(FW.camera.position),
        size: 30000,
        sizeSpread: 300,
        particlesPerSecond: 300,
        opacityStart: 0,
        opacityMiddle: 1,
        opacityEnd: 0,
        colorStart: this.colorStart,
        colorSpread: new THREE.Vector3(.2, .2, .2),
        colorEnd: this.colorEnd
      });
      return this.starGroup.addEmitter(this.starEmitter);
    };

    Stars.prototype.tick = function() {};

    return Stars;

  })();

}).call(this);
