(function() {
  var Rockets;

  FW.Rockets = Rockets = (function() {
    var rnd;

    rnd = FW.rnd;

    function Rockets() {
      this.launching = false;
      rnd = FW.rnd;
      this.rockets = [];
      this.launchSound = new Audio('./assets/launch.mp3');
      this.launchSound.volume = FW.sfxVolume * 0.5;
      this.color = new THREE.Color();
      this.color.setRGB(200, 10, 0);
      this.firework = new FW.Firework(this.color);
      this.projector = new THREE.Projector();
      this.launchSpeed = 25;
      this.explosionDelay = 1000;
      this.shootDirection = new THREE.Vector3();
      this.rocketMat = new THREE.MeshBasicMaterial({
        color: 0xff00ff
      });
      this.rocketGeo = new THREE.CylinderGeometry(.1, 1, 1);
    }

    Rockets.prototype.explode = function(rocket) {
      FW.scene.remove(rocket);
      this.rockets.splice(this.rockets.indexOf(rocket), 1);
      FW.birds.scatter();
      return this.firework.createExplosion(rocket.position);
    };

    Rockets.prototype.launchRocket = function() {
      var ray, rocket, vector, _ref,
        _this = this;
      FW.numExplosionsPerRocket = (_ref = Math.random() > 0.99) != null ? _ref : {
        1: 0
      };
      if (Math.random() > 0.90) {
        FW.numExplosionsPerRocket = 4;
      }
      if (this.launching) {
        return;
      }
      this.launching = true;
      this.launchSound.load();
      rocket = new THREE.Mesh(this.rocketGeo, this.rocketMat);
      rocket.position.set(FW.camera.position.x, FW.camera.position.y, FW.camera.position.z);
      vector = new THREE.Vector3();
      vector.set(0, 0, 1);
      this.projector.unprojectVector(vector, FW.camera);
      ray = new THREE.Ray(FW.camera.position, vector.sub(FW.camera.position).normalize());
      FW.scene.add(rocket);
      rocket.shootDirection = new THREE.Vector3();
      rocket.shootDirection.x = ray.direction.x;
      rocket.shootDirection.y = ray.direction.y;
      rocket.shootDirection.z = ray.direction.z;
      rocket.launchSpeedY = rnd(3, 6);
      rocket.translateX(rocket.shootDirection.x);
      rocket.translateY(rocket.shootDirection.y);
      rocket.translateZ(rocket.shootDirection.z);
      if (soundOn) {
        this.launchSound.play();
      }
      this.rockets.push(rocket);
      return setTimeout(function() {
        _this.explode(rocket);
        return _this.launching = false;
      }, this.explosionDelay);
    };

    Rockets.prototype.update = function() {
      var rocket, _i, _len, _ref;
      _ref = this.rockets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rocket = _ref[_i];
        this.updateRocket(rocket);
      }
      return this.firework.tick();
    };

    Rockets.prototype.updateRocket = function(rocket) {
      rocket.translateX(this.launchSpeed * rocket.shootDirection.x);
      rocket.translateY(this.launchSpeed * rocket.shootDirection.y);
      rocket.translateZ(this.launchSpeed * rocket.shootDirection.z);
      rocket.translateY(rocket.launchSpeedY);
      return rocket.launchSpeedY -= .05;
    };

    return Rockets;

  })();

}).call(this);
