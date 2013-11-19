(function() {
  var Rockets;

  FW.Rockets = Rockets = (function() {
    function Rockets() {
      var rnd;
      rnd = FW.rnd;
      this.rockets = [];
      this.launchSound = new Audio('./assets/launch.mp3');
      this.explodeSound = new Audio('./assets/explosion.mp3');
      this.crackleSound = new Audio('./assets/crackle.mp3');
      this.projector = new THREE.Projector();
      this.targetVec = new THREE.Vector3();
      this.launchSpeed = 1;
      this.explosionDelay = 1000;
      this.shootDirection = new THREE.Vector3();
      this.rocketMat = new THREE.ShaderMaterial({
        uniforms: uniforms1,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragment_shader1').textContent
      });
      this.rocketGeo = new THREE.CylinderGeometry(.1, 1, 1);
      this.light = new THREE.PointLight(0xffeeee, 0.0, 500);
      this.light.position.set(1, 1, 1);
      this.scene.add(this.light);
    }

    Rockets.prototype.explode = function(position) {
      var _this = this;
      this.light.intensity = 1.0;
      this.light.position.set(position.x, position.y, position.z);
      this.firework.createExplosion(position);
      return setTimeout(function() {
        _this.explodeSound.play();
        return setTimeout(function() {
          return _this.crackleSound.play();
        }, 400);
      }, 800);
    };

    Rockets.prototype.launchRocket = function() {
      var ray, rocket, vector,
        _this = this;
      this.launchSound.load();
      this.explodeSound.load();
      this.crackleSound.load();
      rocket = new THREE.Mesh(this.rocketGeo, this.rocketMat);
      rocket.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      this.rockets.push(rocket);
      vector = new THREE.Vector3();
      vector.set(0, 0, 1);
      this.projector.unprojectVector(vector, this.camera);
      ray = new THREE.Ray(this.camera.position, vector.sub(this.camera.position).normalize());
      this.scene.add(rocket);
      this.target = vector.sub(this.camera.position).normalize();
      rocket.shootDirection = new THREE.Vector3();
      rocket.shootDirection.x = ray.direction.x;
      rocket.shootDirection.y = ray.direction.y;
      rocket.shootDirection.z = ray.direction.z;
      this.launchSound.play();
      return setTimeout(function() {
        _this.scene.remove(rocket);
        return _this.explode(rocket.position);
      }, this.explosionDelay);
    };

    Rockets.prototype.update = function() {
      var rocket, _i, _len, _ref;
      if (this.light.intensity > 0) {
        this.light.intensity -= 0.01;
      }
      _ref = this.rockets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rocket = _ref[_i];
        this.updateRocket(rocket);
      }
      if (this.firework.exploding) {
        return this.firework.tick();
      }
    };

    Rockets.prototype.updateRocket = function(rocket) {
      rocket.translateX(this.launchSpeed * rocket.shootDirection.x);
      rocket.translateY(this.launchSpeed * rocket.shootDirection.y);
      return rocket.translateZ(this.launchSpeed * rocket.shootDirection.z);
    };

    return Rockets;

  })();

}).call(this);
