(function() {
  var LightTower;

  FW.LightTower = LightTower = (function() {
    var rnd;

    rnd = FW.rnd;

    function LightTower() {
      this.towerGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
        blending: THREE.AdditiveBlending,
        maxAge: 111
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
        size: 5000,
        position: new THREE.Vector3(-2000, 0, -20000),
        positionSpread: new THREE.Vector3(100, 0, 100),
        colorStart: colorStart,
        velocity: new THREE.Vector3(0, 5, 0),
        acceleration: new THREE.Vector3(0, 1.8, 0),
        accelerationSpread: new THREE.Vector3(0, .03, 0),
        particlesPerSecond: 5
      });
      return this.towerGroup.addEmitter(this.towerEmitter);
    };

    LightTower.prototype.tick = function() {
      return this.towerGroup.tick(FW.globalTick);
    };

    return LightTower;

  })();

}).call(this);
