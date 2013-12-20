(function() {
  var LightTower;

  FW.LightTower = LightTower = (function() {
    var rnd;

    rnd = FW.rnd;

    function LightTower() {
      this.towerGroup = new ShaderParticleGroup({
        texture: THREE.ImageUtils.loadTexture('assets/smokeparticle.png'),
        maxAge: 111
      });
      this.colorEnd = new THREE.Color();
      this.position = new THREE.Vector3(-5000, 100, -30000);
      this.colorEnd.setRGB(Math.random(), Math.random(), Math.random());
      this.generateTower();
      FW.scene.add(this.towerGroup.mesh);
    }

    LightTower.prototype.generateTower = function() {
      var colorStart;
      colorStart = new THREE.Color();
      colorStart.setRGB(.8, .1, .9);
      this.towerEmitter = new ShaderParticleEmitter({
        size: 10000,
        position: this.position,
        positionSpread: new THREE.Vector3(100, 0, 100),
        colorStart: colorStart,
        velocity: new THREE.Vector3(0, 5, 0),
        acceleration: new THREE.Vector3(0, 4.8, 0),
        accelerationSpread: new THREE.Vector3(0, .03, 0),
        particlesPerSecond: 1
      });
      return this.towerGroup.addEmitter(this.towerEmitter);
    };

    LightTower.prototype.tick = function() {
      return this.towerGroup.tick(FW.globalTick);
    };

    return LightTower;

  })();

}).call(this);
