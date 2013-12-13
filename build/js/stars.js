(function() {
  var Stars,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FW.Stars = Stars = (function() {
    var rnd;

    rnd = FW.rnd;

    function Stars() {
      this.changeColor = __bind(this.changeColor, this);
      this.colorStart = new THREE.Color();
      this.colorStart.setRGB(Math.random(), Math.random(), Math.random());
      this.starGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/star.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 100
      });
      this.colorEnd = new THREE.Color();
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      this.generateStars();
      FW.scene.add(this.starGroup.mesh);
      this.changeColor();
    }

    Stars.prototype.generateStars = function() {
      this.starEmitter = new ShaderParticleEmitter({
        type: 'sphere',
        radius: 90000,
        speed: .1,
        size: 10000,
        sizeSpread: 5000,
        particlesPerSecond: 2000,
        opacityStart: 0,
        opacityMiddle: 1,
        opacityEnd: 0,
        colorStart: this.colorStart,
        colorSpread: new THREE.Vector3(rnd(.1, .5), rnd(.1, .5), rnd(.1, .5)),
        colorEnd: this.colorEnd
      });
      return this.starGroup.addEmitter(this.starEmitter);
    };

    Stars.prototype.changeColor = function() {
      var _this = this;
      return setTimeout(function() {
        return console.log(_this);
      }, 5000);
    };

    Stars.prototype.tick = function() {
      this.starGroup.tick(0.16);
      return this.starEmitter.size += 100;
    };

    return Stars;

  })();

}).call(this);
