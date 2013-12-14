(function() {
  var LightTower;

  FW.LightTower = LightTower = (function() {
    var rnd;

    rnd = FW.rnd;

    function LightTower() {
      this.towerGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 100
      });
      this.colorEnd = new THREE.Color();
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      this.generateTower();
      FW.scene.add(this.towerGroup.mesh);
    }

    LightTower.prototype.generateTower = function() {
      var colorStart;
      colorStart = new THREE.Color();
      colorStart.setRGB(.8, .1, .9);
      this.towerEmitter = new ShaderParticleEmitter({
        colorStart: colorStart
      });
      return this.towerGroup.addEmitter(this.towerEmitter);
    };

    LightTower.prototype.tick = function() {
      return this.towerGroup.tick(FW.globalTick);
    };

    return LightTower;

  })();

}).call(this);
